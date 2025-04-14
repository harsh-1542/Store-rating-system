
// src/api/stores.js
import { authAxios } from './auth';

export const getStores = (filters = {}) => {
  return authAxios.get('/admin/stores', { params: filters });
};
export const getAllStores = () => {
  return authAxios.get('/admin/stores');
};

export const getStoreById = (id) => {
  return authAxios.get(`/admin/stores/${id}`);
};

export const createStore = (storeData) => {
  return authAxios.post('/admin/stores', storeData);
};

export const updateStore = (id, storeData) => {
  return authAxios.put(`/admin/stores/${id}`, storeData);
};

export const deleteStore = (id) => {
  return authAxios.delete(`/admin/stores/${id}`);
};