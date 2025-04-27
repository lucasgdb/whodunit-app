import { Broadcast } from "@/constants/Broadcast";
import { roomsStore } from "@/stores/rooms.store";
import { useEffect } from "react";
import dgram from "react-native-udp";

export function useBroadcast() {
  const addRoom = roomsStore((store) => store.addRoom);
  const removeRoom = roomsStore((store) => store.removeRoom);
  const clearRooms = roomsStore((store) => store.clearRooms);

  useEffect(() => {
    const socket = dgram.createSocket({
      type: "udp4",
    });

    socket.on("message", (msg) => {
      const { id, type, owner, roomName, ip, port } = JSON.parse(
        msg.toString()
      );
      console.log(id, type, roomName, ip, port);

      if (type == "ROOM_CREATE") {
        addRoom({ id, name: roomName, owner, ip, port });
      }

      if (type === "ROOM_DELETE") {
        removeRoom(id);
      }
    });

    socket.on("close", () => {
      clearRooms();
    });

    socket.bind(Broadcast.port);

    return () => {
      socket.close();
    };
  }, []);
}
