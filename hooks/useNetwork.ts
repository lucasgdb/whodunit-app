import { closeBroadcast, createServer, startBroadcast } from "@/network/host";
import { useCallback } from "react";
import { userStore } from "@/stores/user.store";
import { portStore } from "@/stores/port.store";
import { connectToHost } from "@/network/client";
import { roomStore } from "@/stores/room.store";
import { Room } from "@/types/Room";
import { router } from "expo-router";

export function useNetwork() {
  const user = userStore((store) => store.user);
  const port = portStore((store) => store.port);
  const room = roomStore((store) => store.room);

  const setRoom = roomStore((store) => store.setRoom);

  const connectToRoom = useCallback((room: Room, callback?: () => void) => {
    return connectToHost(room).once("connect", () => {
      callback?.();
      setRoom(room);
      router.replace("/(lobby)/lobby");
    });
  }, []);

  const createRoom = useCallback(
    (room: Room, callback: () => void) => {
      startBroadcast(room, user, port);

      createServer(user.ip, port).once("listening", () => {
        connectToRoom(room, callback);
      });
    },
    [user, port]
  );

  const closeRoom = useCallback(() => {
    if (room) {
      closeBroadcast(room);
    }
  }, [room]);

  return {
    createRoom,
    closeRoom,
    connectToRoom,
  };
}
