import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useContactsStore = create(
  persist(
    (set) => ({
      searchQuery: '',
      selectedContact: null,
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedContact: (contact) => set({ selectedContact: contact }),
    }),
    { name: 'relay-contacts-storage' }
  )
);