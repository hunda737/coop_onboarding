import { create } from "zustand";

interface useSettleModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useSettleModal = create<useSettleModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
