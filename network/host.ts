import dgram from "react-native-udp";
import TcpSocket from "react-native-tcp-socket";
import { User } from "@/types/User";
import { Broadcast } from "@/constants/Broadcast";
import UdpSocket from "react-native-udp/lib/types/UdpSocket";
import Server from "react-native-tcp-socket/lib/types/Server";
import { Room } from "@/types/Room";

let isBroadcasting = false;

let udpSocket: UdpSocket | null = null;
let udpMessagesInterval: ReturnType<typeof setInterval> | null;
let tcpServer: Server | null;

const clients: TcpSocket.Socket[] = [];
const socketClientUsersMap = new Map<TcpSocket.Socket, User>();

export function startBroadcast(room: Room, user: User, port: number) {
  stopBroadcast(room);

  isBroadcasting = true;

  udpSocket = dgram.createSocket({
    type: "udp4",
  });

  udpSocket.on("error", (err) => {
    stopBroadcast(room);
    console.error(err);
  });

  udpSocket.bind(port, () => {
    if (!isBroadcasting || !udpSocket) return;

    udpSocket.setBroadcast(true);

    udpMessagesInterval = setInterval(() => {
      if (!udpSocket) {
        return;
      }

      const message =
        JSON.stringify({ id: user.id, type: "ROOM_CREATE", owner: user.name, roomName: room.name, ip: user.ip, port }) +
        "\n";

      udpSocket.send(message, 0, message.length, Broadcast.port, "255.255.255.255", (err) => {
        if (err) console.error(err);
      });
    }, 1000);
  });

  return udpSocket;
}

export function stopBroadcast(room: Room) {
  isBroadcasting = false;

  if (udpMessagesInterval) {
    clearInterval(udpMessagesInterval);
    udpMessagesInterval = null;
  }

  if (udpSocket) {
    const message = JSON.stringify({ id: room.id, type: "ROOM_DELETE", roomName: null, ip: null, port: null }) + "\n";

    udpSocket.send(
      message,
      0,
      message.length,
      Broadcast.port,
      "255.255.255.255", // send to everyone on network
      (err) => {
        if (err) console.error(err);

        udpSocket?.close();
        udpSocket = null;
      }
    );
  }

  if (tcpServer) {
    tcpServer.close();
    tcpServer = null;
  }

  clients.forEach((socket) => {
    socket.destroy();
  });

  clients.length = 0;
}

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
          const msg = JSON.parse(packet);

          if (msg.type === "joinRoom") {
            for (const [_, user] of socketClientUsersMap.entries()) {
              socket.write(JSON.stringify({ type: "playerJoined", payload: { user } }) + "\n");
            }

            const user = msg.payload.user as User;

            socketClientUsersMap.set(socket, user);

            broadcast({ type: "playerJoined", payload: { user } });
          }
        } catch (err) {
          console.warn("invalid json:", packet);
        }
      }
    });

    socket.on("close", () => {
      const user = socketClientUsersMap.get(socket);
      if (user) {
        broadcast({ type: "playerLeft", payload: { user } });
        socketClientUsersMap.delete(socket);
      }

      const idx = clients.indexOf(socket);
      if (idx !== -1) clients.splice(idx, 1);
    });

    socket.on("error", (err) => {
      console.error("Erro no socket:", err);

      const user = socketClientUsersMap.get(socket);
      if (user) {
        broadcast({ type: "playerLeft", payload: { user } });
        socketClientUsersMap.delete(socket);
      }

      const idx = clients.indexOf(socket);
      if (idx !== -1) clients.splice(idx, 1);
    });
  });

  tcpServer.listen({ port, host }, () => {
    console.info("TCP Ready for connections...");
  });

  return tcpServer;
}

function broadcast(msg: unknown) {
  const str = JSON.stringify(msg) + "\n";
  clients.forEach((c) => c.write(str));
}
