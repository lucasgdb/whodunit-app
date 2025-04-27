import { Room } from "@/types/Room";
import { User } from "@/types/User";
import { create } from "zustand";

interface RoomState {
  room: Room | null;
  setRoom: (room: Room | null) => void;
  users: User[];
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  closeRoom: () => void;
}

export const roomStore = create<RoomState>((set, get) => ({
  room: null,
  setRoom: (room) => set({ room }),
  users: [],
  addUser: (user) => {
    const existingUser = get().users.find((u) => u.id === user.id);

    if (!existingUser) {
      set({ users: [...get().users, user] });
    }
  },
  removeUser: (userId) => {
    const updatedUsers = get().users.filter((u) => u.id !== userId);

    set({ users: updatedUsers });
  },
  closeRoom: () => set({ room: null, users: [] }),
}));
