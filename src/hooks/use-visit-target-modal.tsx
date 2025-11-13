import { create } from "zustand";

interface useVisitTargetModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useVisitTargetModal = create<useVisitTargetModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
