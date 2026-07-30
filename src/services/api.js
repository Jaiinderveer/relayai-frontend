import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatApi = {
  sendMessage: (inputList) => apiClient.post('/chat/', { input_list: inputList }),
};

export const callsApi = {
  getCalls: (intentStatus = '') => apiClient.get(`/calls/?intent_status=${intentStatus}`),
  getTranscript: (conversationId) => apiClient.get(`/calls/${conversationId}/transcript`),
};

export const analyticsApi = {
  getMetrics: () => apiClient.get('/analytics/'),
  askAnalyst: (inputList) => apiClient.post('/analytics/chat', { input_list: inputList }),
};

export const contactsApi = {
  getContacts: () => apiClient.get('/contacts/'),
  createContact: (contact) => apiClient.post('/contacts/', contact),
  updateContact: (name, contact) => apiClient.put(`/contacts/${name}`, contact),
  deleteContact: (name) => apiClient.delete(`/contacts/${name}`),
};