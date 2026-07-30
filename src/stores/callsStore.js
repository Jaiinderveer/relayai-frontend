import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCallsStore = create(
  persist(
    (set) => ({
      expandedCallId: null,
      setExpandedCallId: (id) => set({ expandedCallId: id }),
    }),
    { name: 'relay-calls-storage' }
  )
);