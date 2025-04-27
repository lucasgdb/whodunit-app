import TcpSocket from "react-native-tcp-socket";
import { Alert } from "react-native";
import { userStore } from "@/stores/user.store";
import { roomStore } from "@/stores/room.store";
import { User } from "@/types/User";
import { router } from "expo-router";
import { roomsStore } from "@/stores/rooms.store";

let client: TcpSocket.Socket | null = null;

export const connectToServer = (ip: string, port: number = 41234) => {
  if (client) {
    return client;
  }

  client = TcpSocket.createConnection({ host: ip, port: port }, () => {
    const { user } = userStore.getState();

    const joinMsg = JSON.stringify({
      type: "joinRoom",
      payload: { id: user.id, name: user.name },
    });

    client?.write(joinMsg);
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
            addUser(msg.payload as User);
            break;
          case "playerLeft":
            removeUser(msg.payload.id as string);
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

export const disconnectFromServer = () => {
  if (!client) return;

  const user = userStore.getState().user;

  const leaveMsg = { type: "playerLeft", payload: { id: user.id } };

  client.write(JSON.stringify(leaveMsg) + "\n");

  client.off("data");
  client.off("error");
  client.off("close");

  client.destroy();
  client = null;

  router.replace("/(locally)/locally");
};
