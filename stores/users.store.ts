import { User } from "@/types/User";
import { create } from "zustand";

interface UsersState {
  users: User[];
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
}

export const usersStore = create<UsersState>((set, get) => ({
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
}));
