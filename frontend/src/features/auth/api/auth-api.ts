import api from '@/lib/api';
import { LoginCredentials, AuthResponse } from '@/features/auth/types';

export const loginApi = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};

export const getMeApi = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
