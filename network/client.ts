import TcpSocket from "react-native-tcp-socket";
import { Alert } from "react-native";
import { userStore } from "@/stores/user.store";
import { roomStore } from "@/stores/room.store";
import { User } from "@/types/User";
import { router } from "expo-router";
import { roomsStore } from "@/stores/rooms.store";
import { Room } from "@/types/Room";
import dgram from "react-native-udp";
import { Broadcast } from "@/constants/Broadcast";

let client: TcpSocket.Socket | null = null;

export const listenBroadcast = () => {
  const { addRoom, removeRoom, clearRooms } = roomsStore.getState();

  const socket = dgram.createSocket({
    type: "udp4",
  });

  let buffer = "";

  socket.on("message", (msg) => {
    buffer += msg.toString();

    let boundary: number;

    while ((boundary = buffer.indexOf("\n")) !== -1) {
      const packet = buffer.slice(0, boundary).trim();

      buffer = buffer.slice(boundary + 1);

      if (!packet) continue;

      try {
        const { id, type, owner, roomName, ip, port } = JSON.parse(packet);

        if (type == "ROOM_CREATE") {
          addRoom({ id, name: roomName, owner, ip, port });
        }

        if (type === "ROOM_DELETE") {
          removeRoom(id);
        }
      } catch (err) {
        console.warn("invalid json:", packet);
      }
    }
  });

  socket.on("close", () => {
    clearRooms();
  });

  socket.bind(Broadcast.port);

  return socket;
};

export const connectToHost = (room: Room) => {
  if (client) {
    return client;
  }

  client = TcpSocket.createConnection({ host: room.ip, port: room.port }, () => {
    const { user } = userStore.getState();

    const message = JSON.stringify({ type: "joinRoom", payload: { user } }) + "\n";

    client?.write(message);
  });

  let buffer = "";

  client.on("data", (data) => {
    buffer += data.toString();

    let boundary: number;

    while ((boundary = buffer.indexOf("\n")) !== -1) {
      const packet = buffer.slice(0, boundary).trim();
      buffer = buffer.slice(boundary + 1);

      if (!packet) continue;

      try {
        const msg = JSON.parse(packet);

        const { addUser, removeUser } = roomStore.getState();

        switch (msg.type) {
          case "playerJoined":
            addUser(msg.payload.user as User);
            break;
          case "playerLeft":
            removeUser(msg.payload.user.id as string);
            break;
        }
      } catch (err) {
        console.warn("invalid json:", packet);
      }
    }
  });

  client.on("close", (error) => {
    client?.destroy();
    client = null;

    roomStore.getState().closeRoom();
    roomsStore.getState().clearRooms();

    router.replace("/(locally)/locally");
  });

  client.on("error", (error) => {
    client = null;
    console.error("Erro ao conectar ao servidor: ", error);
    Alert.alert("Erro", "Não foi possível conectar ao servidor");
  });

  return client;
};

export const disconnectFromHost = () => {
  if (!client) return;

  const user = userStore.getState().user;

  const message = JSON.stringify({ type: "playerLeft", payload: { id: user.id } }) + "\n";

  client.write(message);

  client.off("data");
  client.off("error");
  client.off("close");

  client.destroy();
  client = null;

  router.replace("/(locally)/locally");
};
