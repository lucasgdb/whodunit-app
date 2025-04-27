import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types/User";
import { generateUUID } from "@/utils/generate-uuid";

interface UserState {
  user: User;
  setUsername: (username: string) => void;
  setIp: (ip: string) => void;
}

export const userStore = create(
  persist<UserState>(
    (set, get) => ({
      user: {
        id: generateUUID(),
        name: "",
        ip: "",
      },
      setUsername: (name) => set({ user: { ...get().user, name } }),
      setIp: (ip) => set({ user: { ...get().user, ip } }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage<UserState>(() => AsyncStorage),
    }
  )
);
