import { create } from "zustand";

interface useLeadModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useLeadModal = create<useLeadModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
