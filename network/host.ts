import dgram from "react-native-udp";
import TcpSocket from "react-native-tcp-socket";
import { User } from "@/types/User";
import { Broadcast } from "@/constants/Broadcast";
import UdpSocket from "react-native-udp/lib/types/UdpSocket";
import Server from "react-native-tcp-socket/lib/types/Server";
import { Room } from "@/types/Room";

let broadcastSocket: UdpSocket | null = null;
let broadcastInterval: ReturnType<typeof setInterval> | null;
let tcpServer: Server | null;

const clients: TcpSocket.Socket[] = [];
const socketClientsMap = new Map<
  TcpSocket.Socket,
  { id: string; name: string }
>();

export const startBroadcast = (room: Room, user: User, port: number) => {
  if (!user.ip) {
    return;
  }

  broadcastSocket = dgram.createSocket({
    type: "udp4",
  });

  broadcastInterval = setInterval(() => {
    if (!broadcastSocket) {
      return;
    }

    const message = JSON.stringify({
      id: user.id,
      type: "ROOM_CREATE",
      owner: user.name,
      roomName: room.name,
      ip: user.ip,
      port,
    });

    try {
      broadcastSocket.send(
        message,
        0,
        message.length,
        Broadcast.port,
        "255.255.255.255",
        (err) => {
          if (err) console.error("Erro ao enviar broadcast:", err);
        }
      );
    } catch (error) {
      console.error(error);
    }
  }, 1000);

  broadcastSocket.bind(port, () => {
    broadcastSocket?.setBroadcast(true);
  });

  broadcastSocket.on("error", (err) => {
    console.warn("Broadcast socket error capturado:", err);
  });

  return broadcastSocket;
};

export const closeBroadcast = async (room: Room) => {
  if (!broadcastSocket || !broadcastInterval) {
    return;
  }

  if (broadcastInterval) {
    clearInterval(broadcastInterval);
    broadcastInterval = null;
  }

  if (broadcastSocket) {
    const message = JSON.stringify({
      id: room.id,
      type: "ROOM_DELETE",
      roomName: null,
      ip: null,
      port: null,
    });

    try {
      broadcastSocket.send(
        message,
        0,
        message.length,
        Broadcast.port,
        "255.255.255.255", // send to everyone on network
        (err) => {
          if (err) console.error("Erro ao enviar broadcast:", err);

          broadcastSocket?.close();
          broadcastSocket = null;
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  if (tcpServer) {
    tcpServer.close();
    tcpServer = null;
  }

  clients.forEach((socket) => {
    socket.destroy();
  });

  clients.length = 0;
};

export function createServer(host: string, port: number) {
  if (tcpServer) {
    return tcpServer;
  }

  tcpServer = TcpSocket.createServer((socket) => {
    clients.push(socket);

    let buffer = "";

    socket.on("data", (data) => {
      buffer += data.toString();

      let boundary: number;

      while ((boundary = buffer.indexOf("\n")) !== -1) {
        const packet = buffer.slice(0, boundary).trim();
        buffer = buffer.slice(boundary + 1);

        if (!packet) continue;

        try {
          const msg = JSON.parse(data.toString());

          if (msg.type === "joinRoom") {
            for (const [_, user] of socketClientsMap.entries()) {
              socket.write(
                JSON.stringify({ type: "playerJoined", payload: user }) + "\n"
              );
            }

            const { id, name } = msg.payload as { id: string; name: string };

            socketClientsMap.set(socket, { id, name });

            broadcast({ type: "playerJoined", payload: { id, name } });
          }
        } catch (err) {
          console.warn("invalid json:", packet);
        }
      }
    });

    socket.on("close", () => {
      const user = socketClientsMap.get(socket);
      if (user) {
        broadcast({ type: "playerLeft", payload: { id: user.id } });
        socketClientsMap.delete(socket);
      }

      const idx = clients.indexOf(socket);
      if (idx !== -1) clients.splice(idx, 1);
    });

    socket.on("error", (err) => {
      console.error("Erro no socket:", err);

      const user = socketClientsMap.get(socket);
      if (user) {
        broadcast({ type: "playerLeft", payload: { id: user.id } });
        socketClientsMap.delete(socket);
      }

      const idx = clients.indexOf(socket);
      if (idx !== -1) clients.splice(idx, 1);
    });
  });

  tcpServer.listen({ port, host }, () => {
    console.log("Servidor TCP aguardando conexões...");
  });

  return tcpServer;
}

function broadcast(msg: unknown) {
  const str = JSON.stringify(msg) + "\n";
  clients.forEach((c) => c.write(str));
}
