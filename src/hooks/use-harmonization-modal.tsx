import { create } from "zustand";
import { FaydaData, VerifyOtpResponse } from "@/features/harmonization/harmonizationApiSlice";

interface HarmonizationData {
  accountNumber: string;
  harmonizationRequestId?: number;
  phoneNumber?: string;
  maskedPhoneNumber?: string;
  accountData?: VerifyOtpResponse["harmonizationData"];
}

interface UseHarmonizationModalStore {
  isOpen: boolean;
  currentStep: 1 | 2 | 3;
  harmonizationData: HarmonizationData | null;
  faydaData: FaydaData | null;
  onOpen: () => void;
  onClose: () => void;
  setStep: (step: 1 | 2 | 3) => void;
  setHarmonizationData: (data: Partial<HarmonizationData>) => void;
  setFaydaData: (data: FaydaData | null) => void;
  reset: () => void;
}

const initialState = {
  isOpen: false,
  currentStep: 1 as 1 | 2 | 3,
  harmonizationData: null,
  faydaData: null,
};

export const useHarmonizationModal = create<UseHarmonizationModalStore>((set) => ({
  ...initialState,
  
  onOpen: () => set({ isOpen: true, currentStep: 1 }),
  
  onClose: () => set(initialState),
  
  setStep: (step) => set({ currentStep: step }),
  
  setHarmonizationData: (data) =>
    set((state) => ({
      harmonizationData: state.harmonizationData
        ? { ...state.harmonizationData, ...data }
        : (data as HarmonizationData),
    })),
  
  setFaydaData: (data) => set({ faydaData: data }),
  
  reset: () => set(initialState),
}));

