import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PortfolioPrivacyState {
  isVisible: boolean
  toggle: () => void
  setVisible: (visible: boolean) => void
}

export const usePortfolioPrivacy = create<PortfolioPrivacyState>()(
  persist(
    (set) => ({
      isVisible: true,
      toggle: () => set((state) => ({ isVisible: !state.isVisible })),
      setVisible: (visible: boolean) => set({ isVisible: visible }),
    }),
    {
      name: 'portfolio-privacy-storage',
    }
  )
)
