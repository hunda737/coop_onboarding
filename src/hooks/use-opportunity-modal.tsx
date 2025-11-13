import { create } from "zustand";

interface useOpportunityModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useOpportunityModal = create<useOpportunityModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
