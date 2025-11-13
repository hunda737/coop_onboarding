import { create } from "zustand";

interface useCaseModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCaseModal = create<useCaseModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
