import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAnalyticsStore = create(
  persist(
    (set) => ({
      messages: [],
      inputValue: '',
      // Defensive setter ensures we NEVER commit a non-array to state
      setMessages: (newMessages) => set({ 
        messages: Array.isArray(newMessages) ? newMessages : [] 
      }),
      setInputValue: (inputValue) => set({ inputValue }),
    }),
    { 
      name: 'relay-analytics-storage',
      storage: createJSONStorage(() => sessionStorage),
      version: 1, // Store versioning introduced
      migrate: (persistedState, version) => {
        // If versions mismatch or state is corrupted, intercept and repair
        if (!persistedState) return { messages: [], inputValue: '' };

        // Ensure messages is strictly an array before hydration
        if (!Array.isArray(persistedState.messages)) {
          persistedState.messages = [];
        }
        
        // Ensure inputValue is strictly a string
        if (typeof persistedState.inputValue !== 'string') {
          persistedState.inputValue = '';
        }
        
        return persistedState;
      }
    }
  )
);