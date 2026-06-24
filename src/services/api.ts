import axios from 'axios';
import type { AuthResponse, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/api/auth/login', { email, password }),

  register: (name: string, email: string, password: string) =>
    api.post<AuthResponse>('/api/auth/register', { name, email, password }),
};

export const userService = {
  getAllUsers: () => api.get<User[]>('/api/users'),

  getUserById: (id: string) => api.get<User>(`/api/users/${id}`),

  createUser: (name: string, email: string, password: string, role: 'ADMIN' | 'USER') =>
    api.post<User>('/api/users', { name, email, password, role }),

  updateUser: (id: string, data: Partial<User>) =>
    api.put<User>(`/api/users/${id}`, data),

  deleteUser: (id: string) => api.delete(`/api/users/${id}`),
};

export default api;
