import { listenBroadcast } from "@/network/client";
import { useEffect } from "react";

export function useBroadcast() {
  useEffect(() => {
    const socket = listenBroadcast();

    return () => {
      socket.close();
    };
  }, []);
}
