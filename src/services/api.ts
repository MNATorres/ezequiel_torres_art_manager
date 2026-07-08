import axios from 'axios';
import type {
  AuthResponse,
  User,
  CreateUserData,
  UpdateUserData,
  Experience,
  ExperienceData,
  Artwork,
  ArtworkData,
} from '../types';

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
  // For file uploads, let the browser set the multipart boundary itself.
  if (config.data instanceof FormData) {
    config.headers.delete('Content-Type');
  }
  return config;
});

export const authService = {
  googleLogin: (idToken: string) => api.post<AuthResponse>('/api/auth/google', { idToken }),
};

export const userService = {
  getAllUsers: () => api.get<User[]>('/api/users'),

  getUserById: (id: string) => api.get<User>(`/api/users/${id}`),

  createUser: (data: CreateUserData) => api.post<User>('/api/users', data),

  updateUser: (id: string, data: UpdateUserData) =>
    api.put<User>(`/api/users/${id}`, data),

  deleteUser: (id: string) => api.delete(`/api/users/${id}`),
};

export const experienceService = {
  getAll: () => api.get<Experience[]>('/api/experiences'),

  create: (data: ExperienceData) => api.post<Experience>('/api/experiences', data),

  update: (id: string, data: ExperienceData) =>
    api.put<Experience>(`/api/experiences/${id}`, data),

  remove: (id: string) => api.delete(`/api/experiences/${id}`),
};

export const artworkService = {
  getAll: () => api.get<Artwork[]>('/api/artworks'),

  create: (data: ArtworkData) => api.post<Artwork>('/api/artworks', data),

  update: (id: string, data: ArtworkData) =>
    api.put<Artwork>(`/api/artworks/${id}`, data),

  remove: (id: string) => api.delete(`/api/artworks/${id}`),
};

export const uploadService = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post<{ url: string }>('/api/uploads', formData);
  },
};

export default api;
