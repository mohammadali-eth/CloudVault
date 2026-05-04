import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginApi } from '@/features/auth/api/auth-api';
import { LoginCredentials } from '@/features/auth/types';
import { saveTokens, removeTokens } from '@/lib/auth';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await loginApi(credentials);
      saveTokens(data.tokens.accessToken, data.tokens.refreshToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeTokens();
    router.push('/login');
  };

  return { login, logout, isLoading, error };
};
