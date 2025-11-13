import { create } from "zustand";

interface useRtgsModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useRtgsModal = create<useRtgsModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
