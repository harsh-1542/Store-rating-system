
// src/api/users.js
import { authAxios } from './auth';

export const getUsers = (query) => {
  return authAxios.get('/admin/users', { params: query });
};
export const getAllUsers = () => {
  return authAxios.get('/admin/users');
};

export const getUserById = (id) => {
  return authAxios.get(`/admin/users/${id}`);
};

export const createUser = (userData) => {
  return authAxios.post('/admin/users', userData);
};

export const updateUser = (id, userData) => {
  return authAxios.put(`/users/${id}`, userData);
};

export const deleteUser = (id) => {
  return authAxios.delete(`/users/${id}`);
};

export const updatePassword = (currentPassword, newPassword) => {
  return authAxios.put(`/auth/update-password`,currentPassword, newPassword);
};