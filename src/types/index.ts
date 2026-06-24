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
  password: string;
  role: Role;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
}
