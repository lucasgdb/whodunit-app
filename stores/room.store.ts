import Server from "react-native-tcp-socket/lib/types/Server";
import UdpSocket from "react-native-udp/lib/types/UdpSocket";
import { create } from "zustand";

interface RoomState {
  broadcast: UdpSocket | null;
  broadcastInterval: NodeJS.Timeout | null;
  tcpServer: Server | null;
  setBroadcast: (socket: UdpSocket, interval: NodeJS.Timeout) => void;
  setTcpServer: (server: Server) => void;
  reset: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  broadcast: null,
  broadcastInterval: null,
  tcpServer: null,
  setBroadcast: (socket, interval) =>
    set({ broadcast: socket, broadcastInterval: interval }),
  setTcpServer: (server) => set({ tcpServer: server }),
  reset: () =>
    set({ broadcast: null, broadcastInterval: null, tcpServer: null }),
}));
