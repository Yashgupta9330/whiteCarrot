
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL || '',
  withCredentials: true
});

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

