import { create } from "zustand";

interface useTaskModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useTaskModal = create<useTaskModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
