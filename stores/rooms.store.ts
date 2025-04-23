import { Room } from "@/types/Room";
import { create } from "zustand";

interface RoomsState {
  rooms: Room[];
  addRoom: (room: Room) => void;
  removeRoom: (roomName: string) => void;
}

export const roomsStore = create<RoomsState>((set, get) => ({
  rooms: [],
  addRoom: (room) => {
    const existingRoom = get().rooms.find((r) => r.name === room.name);

    if (!existingRoom) {
      set({ rooms: [...get().rooms, room] });
    }
  },
  removeRoom: (roomName) => {
    const updatedRooms = get().rooms.filter((r) => r.name !== roomName);

    set({ rooms: updatedRooms });
  },
}));
