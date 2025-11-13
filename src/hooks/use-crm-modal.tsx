import { create } from "zustand";

interface useCrmModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCrmModal = create<useCrmModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
