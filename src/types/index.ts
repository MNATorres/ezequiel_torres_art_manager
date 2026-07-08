export type Role = 'ADMIN' | 'USER';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  role: Role;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: Role;
}

export interface Experience {
  _id: string;
  title: string;
  date: string; // ISO date string from the backend
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExperienceData {
  title: string;
  date: string; // 'YYYY-MM-DD' from the date input
  description: string;
  imageUrl?: string;
}

export interface Artwork {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ArtworkData {
  title: string;
  description: string;
  imageUrl?: string;
  order: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
}
