import { createServer, startBroadcast } from "@/network/host";
import { useCallback, useRef } from "react";
import Server from "react-native-tcp-socket/lib/types/Server";
import UdpSocket from "react-native-udp/lib/types/UdpSocket";
import TcpSocket from "react-native-tcp-socket";
import { Alert } from "react-native";
import { userStore } from "@/stores/user.store";
import { portStore } from "@/stores/port.store";
import { roomsStore } from "@/stores/rooms.store";
import { usersStore } from "@/stores/users.store";
import { useRoomStore } from "@/stores/room.store";
import { Broadcast } from "@/constants/Broadcast";

export function useNetwork() {
  const user = userStore((store) => store.user);
  const port = portStore((store) => store.port);

  const rooms = roomsStore((store) => store.rooms);

  const users = usersStore((store) => store.users);
  const addUser = usersStore((store) => store.addUser);
  const removeUser = usersStore((store) => store.removeUser);

  const createRoom = useCallback(async () => {
    const { broadcast, tcpServer, setBroadcast, setTcpServer } =
      useRoomStore.getState();

    if (broadcast || tcpServer) {
      return;
    }

    const { interval, socket, ip } = await startBroadcast(user, port);

    if (!ip) {
      return;
    }

    const server = createServer(ip, port);

    connectToServer(ip, port);

    setTcpServer(server);
    setBroadcast(socket, interval);
  }, []);

  const closeRoom = useCallback(() => {
    const { broadcast, broadcastInterval, tcpServer, reset } =
      useRoomStore.getState();

    if (broadcastInterval) clearInterval(broadcastInterval);

    if (broadcast) {
      const message = `${user.id}|ROOM_DELETE|${user.name}|null|${port}`;

      broadcast.send(
        message,
        0,
        message.length,
        port, // porta de broadcast
        "255.255.255.255", // enviar para todos na rede
        (err) => {
          if (err) console.error("Erro ao enviar broadcast:", err);
        }
      );

      broadcast.close();
    }

    if (tcpServer) tcpServer.close();

    reset();
  }, []);

  const connectToServer = useCallback((ip: string, port: number) => {
    const client = TcpSocket.createConnection({ host: ip, port }, () => {
      console.log("Conectado ao servidor");
      addUser({ id: user.id, name: user.name });
    });

    client.on("data", (data) => {
      console.log("Dados recebidos do servidor: ", data.toString());
    });

    client.on("error", (error) => {
      console.error("Erro ao conectar ao servidor: ", error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor");
    });

    client.on("close", () => {
      console.log("Conexão fechada");
      removeUser(user.id);
    });

    return client;
  }, []);

  return {
    rooms,
    users,
    createRoom,
    closeRoom,
    connectToServer,
  };
}
