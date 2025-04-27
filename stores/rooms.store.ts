import { Room } from "@/types/Room";
import { create } from "zustand";

interface RoomsState {
  rooms: Room[];
  addRoom: (room: Room) => void;
  removeRoom: (roomId: string) => void;
  clearRooms: () => void;
}

export const roomsStore = create<RoomsState>((set, get) => ({
  rooms: [],
  addRoom: (room) => {
    const existingRoom = get().rooms.find((r) => r.id === room.id);

    if (!existingRoom) {
      set({ rooms: [...get().rooms, room] });
    }
  },
  removeRoom: (roomId) => {
    const updatedRooms = get().rooms.filter((r) => r.id !== roomId);

    set({ rooms: updatedRooms });
  },
  clearRooms: () => set({ rooms: [] }),
}));
