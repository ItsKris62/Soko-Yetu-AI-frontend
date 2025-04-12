import { create } from 'zustand'

type ModalView = 'login' | 'register' | 'reset'

interface ModalState {
  isOpen: boolean
  view: ModalView
  openModal: (view: ModalView) => void
  closeModal: () => void
  setView: (view: ModalView) => void
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  view: 'login',
  openModal: (view) => set({ isOpen: true, view }),
  closeModal: () => set({ isOpen: false }),
  setView: (view) => set({ view }),
}))
