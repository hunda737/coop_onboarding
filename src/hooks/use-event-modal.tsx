import { create } from "zustand";

interface useEventModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useEventModal = create<useEventModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
