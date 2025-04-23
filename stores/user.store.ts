import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types/User";
import { generateUUID } from "@/utils/generate-uuid";

interface UserState {
  user: User;
  setUsername: (username: string) => void;
}

export const userStore = create(
  persist<UserState>(
    (set, get) => ({
      user: {
        id: generateUUID(),
        name: "",
      },
      setUsername: (username) =>
        set({ user: { id: get().user.id, name: username } }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage<UserState>(() => AsyncStorage),
    }
  )
);
