import { create } from "zustand";
import { AccountFlowSettings } from "@/features/account-flow-settings/accountFlowSettingsApiSlice";

interface UseFlowSettingsModalStore {
  isOpen: boolean;
  data: AccountFlowSettings | null;
  onOpen: (data?: AccountFlowSettings) => void;
  onClose: () => void;
}

export const useFlowSettingsModal = create<UseFlowSettingsModalStore>((set) => ({
  isOpen: false,
  data: null,
  onOpen: (data) => set({ isOpen: true, data: data || null }),
  onClose: () => set({ isOpen: false, data: null }),
}));

