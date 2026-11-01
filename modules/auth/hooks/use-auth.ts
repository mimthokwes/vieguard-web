"use client";

import { useState, useCallback } from 'react';
import { loginAction, registerAction } from '../actions';
import { logoutAction } from '@/app/actions';

/**
 * Hook to present auth actions and manage submission states.
 */
export function useAuth() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (formData: FormData) => {
    setIsPending(true);
    setError(null);
    try {
      const res = await loginAction({}, formData);
      if (res?.error) setError(res.error);
      return res;
    } finally {
      setIsPending(false);
    }
  }, []);

  const register = useCallback(async (formData: FormData) => {
    setIsPending(true);
    setError(null);
    try {
      const res = await registerAction({}, formData);
      if (res?.error) setError(res.error);
      return res;
    } finally {
      setIsPending(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsPending(true);
    try {
      await logoutAction();
    } finally {
      setIsPending(false);
    }
  }, []);

  return {
    isPending,
    error,
    login,
    register,
    logout,
  };
}
