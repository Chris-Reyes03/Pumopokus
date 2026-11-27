import { create } from 'zustand'

export const useRewardStore = create((set) => ({
  quote: null,

  show: (quote) => {
    if (quote) set({ quote })
  },

  dismiss: () => set({ quote: null }),
}))
