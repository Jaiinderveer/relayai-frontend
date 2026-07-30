import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useChatStore = create(
  persist(
    (set) => ({
      messages: [],
      inputValue: '',
      setMessages: (newMessages) => set({ 
        messages: Array.isArray(newMessages) ? newMessages : [] 
      }),
      setInputValue: (inputValue) => set({ inputValue }),
      addMessage: (message) => set((state) => ({ 
        messages: Array.isArray(state.messages) ? [...state.messages, message] : [message] 
      })),
    }),
    { 
      name: 'relay-chat-storage',
      version: 1,
      migrate: (persistedState, version) => {
        if (!persistedState) return { messages: [], inputValue: '' };

        if (!Array.isArray(persistedState.messages)) {
          persistedState.messages = [];
        }
        if (typeof persistedState.inputValue !== 'string') {
          persistedState.inputValue = '';
        }
        
        return persistedState;
      }
    }
  )
);