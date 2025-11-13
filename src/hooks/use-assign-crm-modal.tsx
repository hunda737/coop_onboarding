import { create } from "zustand";

interface useAssignBulkCRMModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useAssignBulkCRMModal = create<useAssignBulkCRMModalStore>(
  (set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
  })
);
