import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
});

// Request interceptor for adding the bearer token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signUp = async (userData) => {
  try {
    const response = await API.post('/signup', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Signup failed';
  }
};

export const signIn = async (credentials) => {
  try {
    const response = await API.post('/signin', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Signin failed';
  }
};
