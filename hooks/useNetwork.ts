import { closeBroadcast, createServer, startBroadcast } from "@/network/host";
import { useCallback } from "react";
import { userStore } from "@/stores/user.store";
import { portStore } from "@/stores/port.store";
import { connectToServer } from "@/network/client";
import { roomStore } from "@/stores/room.store";
import { Room } from "@/types/Room";
import { router } from "expo-router";

export function useNetwork() {
  const user = userStore((store) => store.user);
  const port = portStore((store) => store.port);
  const room = roomStore((store) => store.room);

  const setRoom = roomStore((store) => store.setRoom);

  const createRoom = useCallback(
    (room: Room, callback: () => void) => {
      startBroadcast(room.name, user, port);

      createServer(user.ip, port).once("listening", () => {
        connectToHost(room).once("connect", callback);
      });
    },
    [user, port]
  );

  const closeRoom = useCallback(() => {
    if (room) {
      closeBroadcast(room);
    }
  }, [room]);

  const connectToHost = useCallback((room: Room) => {
    setRoom(room);

    return connectToServer(room.ip, room.port).once("connect", () => {
      router.replace("/(lobby)/lobby");
    });
  }, []);

  return {
    createRoom,
    closeRoom,
    connectToHost,
  };
}
