import { Broadcast } from "@/constants/Broadcast";
import { roomsStore } from "@/stores/rooms.store";
import { generateUUID } from "@/utils/generate-uuid";
import { useEffect } from "react";
import dgram from "react-native-udp";

export function useBroadcast() {
  const addRoom = roomsStore((store) => store.addRoom);
  const removeRoom = roomsStore((store) => store.removeRoom);

  useEffect(() => {
    const socket = dgram.createSocket({
      type: "udp4",
    });

    socket.on("message", (msg) => {
      const [id, type, name, ip, hostPort] = msg.toString().split("|");
      console.log("mensagem recebida", id, type, name, ip, hostPort);

      if (type == "ROOM_CREATE") {
        addRoom({ id, name, ip, port: hostPort });
      }

      if (type === "ROOM_DELETE") {
        removeRoom(name);
      }
    });

    socket.bind(Broadcast.port);

    return () => {
      socket.close();
    };
  }, []);
}
