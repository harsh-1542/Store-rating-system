
// src/api/ratings.js
import { authAxios } from './auth';

export const getUserRating = () => {
  console.log("get user rating called");
  
  return authAxios.get('/ratings');
};

export const getRatingsByStore = (storeId) => {
  return authAxios.get(`/ratings/store/${storeId}`);
};

export const getRatingsByUser = (userId) => {
  return authAxios.get(`/ratings/user/${userId}`);
};

export const createRating = (ratingData) => {
  return authAxios.post('/ratings/', ratingData);
};

export const updateRating = (id, ratingData) => {
  return authAxios.put(`/ratings/${id}`, ratingData);
};

export const deleteRating = (id) => {
  return authAxios.delete(`/ratings/${id}`);
};