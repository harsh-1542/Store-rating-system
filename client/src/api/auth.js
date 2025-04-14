// src/api/auth.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Adjust based on your backend URL

// Create axios instance with auth header
 const authAxios = axios.create({
  baseURL: API_URL,
});

// Add interceptor to include token in requests
authAxios.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    // console.log(user.accessToken);
    
    if (user && user.accessToken) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = (email, password) => {
  return axios.post(`${API_URL}/auth/signin`, { email, password });
};

export const signup = (userData) => {
  console.log("signUp called");
  
  return axios.post(`${API_URL}/auth/signup`, userData);
};

export const logout = () => {
  return authAxios.post(`${API_URL}/auth/logout`);
};

export const updatePassword = (oldPassword, newPassword) => {
  return authAxios.put(`${API_URL}/auth/update-password`, { oldPassword, newPassword });
};


export  {authAxios};