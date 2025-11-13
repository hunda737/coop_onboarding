import { create } from "zustand";

interface useIPSModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useTargetModal = create<useIPSModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
