import { createServer, startBroadcast } from "@/network/host";
import { useCallback, useEffect, useRef, useState } from "react";
import Server from "react-native-tcp-socket/lib/types/Server";
import UdpSocket from "react-native-udp/lib/types/UdpSocket";
import dgram from "react-native-udp";
import TcpSocket from "react-native-tcp-socket";
import { Alert } from "react-native";
import { userStore } from "@/stores/user.store";
import { portStore } from "@/stores/port.store";

export function useNetwork() {
  const username = userStore((store) => store.username);
  const port = portStore((store) => store.port);

  const [rooms, setRooms] = useState<
    { name: string; ip: string; port: number }[]
  >([]);

  const [clients, setClients] = useState<{ name: string; ip: string }[]>([]);

  const broadcast = useRef<UdpSocket | null>(null);
  const broadcastInterval = useRef<NodeJS.Timeout | null>(null);
  const tcpServer = useRef<Server | null>(null);

  useEffect(() => {
    const socket = dgram.createSocket({
      type: "udp4",
    });

    const foundIPs = new Set();

    socket.on("message", (msg) => {
      const [type, name, ip] = msg.toString().split("|");

      if (type == "ROOM_CREATE" && !foundIPs.has(name)) {
        foundIPs.add(name);
        setRooms((prev) => [...prev, { name, ip, port }]);
      }

      if (type === "ROOM_DELETE") {
        foundIPs.delete(name);

        setRooms((prevRooms) => {
          const newRooms = prevRooms.filter(
            (prevRoom) => prevRoom.name !== name
          );

          return newRooms;
        });
      }
    });

    socket.bind(port);

    return () => {
      socket.close();
    };
  }, []);

  const createRoom = useCallback(async () => {
    if (broadcast.current || tcpServer.current) {
      return;
    }

    const { interval, socket, ip } = await startBroadcast(username, port);

    if (!ip) {
      return;
    }

    const server = createServer(ip, port);

    tcpServer.current = server;
    broadcast.current = socket;
    broadcastInterval.current = interval;
  }, []);

  const closeRoom = useCallback(() => {
    if (broadcastInterval.current) clearInterval(broadcastInterval.current);

    const message = `ROOM_DELETE|Lucas|null|null`;

    broadcast.current?.send(
      message,
      0,
      message.length,
      port, // porta de broadcast
      "255.255.255.255", // enviar para todos na rede
      (err) => {
        if (err) console.error("Erro ao enviar broadcast:", err);
      }
    );

    if (broadcast.current) broadcast.current.close();
    if (tcpServer.current) tcpServer.current.close();
  }, []);

  const connectToServer = useCallback((ip: string, port: number) => {
    const client = TcpSocket.createConnection({ host: ip, port: port }, () => {
      console.log("Conectado ao servidor");
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
    });

    return client;
  }, []);

  return {
    rooms,
    createRoom,
    closeRoom,
    connectToServer,
  };
}
