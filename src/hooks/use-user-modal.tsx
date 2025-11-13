import { create } from "zustand";

interface useClientModalStore {
  isOpen: boolean;
  isEdit: boolean;
  editData?: {
    id?: number;
    fullName?: string;
    email?: string;
    branchIds?: string[];
    mainBranchId?: number;
    status?: string;
  };
  setEditData: (data: {
    fullName?: string;
    email?: string;
    branchIds?: string[];
    mainBranchId?: number;
    status?: string;
    id?: number;
  }) => void;
  onEdit: () => void;
  onOpen: () => void;
  onClose: () => void;
}

export const useUserModal = create<useClientModalStore>((set) => ({
  isOpen: false,
  isEdit: false,
  editData: {},
  setEditData: (data) => set({ editData: data }),
  onEdit: () => set({ isOpen: true, isEdit: true }),
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false, editData: {} }),
}));

export const useAgentManagerModal = create<useClientModalStore>((set) => ({
  isOpen: false,
  isEdit: false,
  editData: {},
  setEditData: (data) => set({ editData: data }),
  onEdit: () => set({ isOpen: true, isEdit: true }),
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false, editData: {} }),
}));

export const useAgentModal = create<useClientModalStore>((set) => ({
  isOpen: false,
  isEdit: false,
  editData: {},
  setEditData: (data) => set({ editData: data }),
  onEdit: () => set({ isOpen: true, isEdit: true }),
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false, isEdit: false, editData: {} }),
}));
