import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FilterState {
  filters: {
    category: string
    county: string
    min: string
    max: string
    quality: string
    q: string
  }
  setFilters: (filters: Partial<FilterState['filters']>) => void
  resetFilters: () => void
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      filters: {
        category: '',
        county: '',
        min: '',
        max: '',
        quality: '',
        q: '',
      },
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),
      resetFilters: () =>
        set(() => ({
          filters: {
            category: '',
            county: '',
            min: '',
            max: '',
            quality: '',
            q: '',
          },
        })),
    }),
    { name: 'agri-filters' }
  )
)
