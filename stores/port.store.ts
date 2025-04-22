import { create } from "zustand";

interface PortState {
  port: number;
  setPort: (port: number) => void;
}

export const portStore = create<PortState>((set) => ({
  port: 0,
  setPort: (port) => set({ port }),
}));
