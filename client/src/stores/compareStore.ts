import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { College } from '../types';

interface CompareState {
  items: College[];
  addToCompare: (college: College) => string | null;
  removeFromCompare: (collegeId: string) => void;
  clearCompare: () => void;
  isInCompare: (collegeId: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCompare: (college) => {
        const { items } = get();
        if (items.find((i) => i.id === college.id)) {
          return `${college.shortName || college.name} is already in compare list`;
        }
        if (items.length >= 3) {
          return 'You can only compare up to 3 colleges at once';
        }
        set({ items: [...items, college] });
        return null;
      },
      removeFromCompare: (collegeId) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== collegeId) }));
      },
      clearCompare: () => {
        set({ items: [] });
      },
      isInCompare: (collegeId) => {
        return get().items.some((i) => i.id === collegeId);
      },
    }),
    {
      name: 'compare-storage',
    }
  )
);
