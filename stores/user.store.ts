import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserState {
  username: string;
  setUsername: (username: string) => void;
}

export const userStore = create(
  persist<UserState>(
    (set) => ({
      username: "",
      setUsername: (username) => set({ username }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage<UserState>(() => AsyncStorage),
    }
  )
);
