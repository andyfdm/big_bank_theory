import api from './api';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  verify: (data) => api.post('/auth/verify', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
};

export const usersApi = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
};

export const homeApi = {
  getHome: (limit = 50) => api.get('/home', { params: { limit } }),
};

export const accountsApi = {
  list: () => api.get('/accounts'),
  get: (accountId) => api.get(`/accounts/${accountId}`),
  create: (data) => api.post('/accounts', data),
  delete: (accountId) => api.delete(`/accounts/${accountId}`),
  setPayId: (accountId, data) => api.put(`/accounts/${accountId}/payid`, data),
};

export const transactionsApi = {
  list: (limit = 50) => api.get('/transactions', { params: { limit } }),
  listByAccount: (accountId, limit = 50) =>
    api.get(`/transactions/account/${accountId}`, { params: { limit } }),
  spend: (data) => api.post('/transactions/spend', data),
  deposit: (data) => api.post('/transactions/deposit', data),
  withdraw: (data) => api.post('/transactions/withdraw', data),
  transfer: (data) => api.post('/transactions/transfer', data),
};

export const payIdApi = {
  lookup: (data) => api.post('/payid/lookup', data),
  pay: (data) => api.post('/payid/pay', data),
};
