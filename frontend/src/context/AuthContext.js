import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, usersApi } from '../services/bankingApi';
import { getErrorMessage } from '../services/api';

const AuthContext = createContext(null);

const USER_STORAGE_KEY = 'user';
const TOKEN_STORAGE_KEY = 'token';
const PENDING_EMAIL_KEY = 'pendingEmail';
const PENDING_USER_KEY = 'pendingUser';

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function mapUserResponse(user) {
  if (!user) return null;
  return {
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    address: user.address || '',
    createdAt: user.created_at,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [pendingEmail, setPendingEmail] = useState(() => sessionStorage.getItem(PENDING_EMAIL_KEY));
  const [loading, setLoading] = useState(false);

  const persistSession = useCallback((nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    sessionStorage.removeItem(PENDING_EMAIL_KEY);
    sessionStorage.removeItem(PENDING_USER_KEY);
    setPendingEmail(null);
  }, []);

  const clearSession = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    sessionStorage.removeItem(PENDING_EMAIL_KEY);
    sessionStorage.removeItem(PENDING_USER_KEY);
    setPendingEmail(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!localStorage.getItem(TOKEN_STORAGE_KEY)) return;
    try {
      const { data } = await usersApi.getProfile();
      const mappedUser = mapUserResponse(data);
      setUser(mappedUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mappedUser));
    } catch {
      // Ignore profile refresh errors during startup.
    }
  }, []);

  useEffect(() => {
    if (token) {
      refreshProfile();
    }
  }, [token, refreshProfile]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await authApi.login({ email, password });
      persistSession(data.access_token, mapUserResponse(data.user));
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      setLoading(false);
    }
  }, [persistSession]);

  const signup = useCallback(async ({ name, email, password, phone }) => {
    setLoading(true);
    try {
      await authApi.register({ name, email, password, phone });
      sessionStorage.setItem(PENDING_EMAIL_KEY, email);
      sessionStorage.setItem(PENDING_USER_KEY, JSON.stringify({ email, name, phone }));
      setPendingEmail(email);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyEmail = useCallback(async (code) => {
    const email = pendingEmail || sessionStorage.getItem(PENDING_EMAIL_KEY);
    if (!email) {
      return { success: false, error: 'No pending registration found. Please sign up again.' };
    }

    setLoading(true);
    try {
      const { data } = await authApi.verify({ email, code });
      persistSession(data.access_token, mapUserResponse(data.user));
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      setLoading(false);
    }
  }, [pendingEmail, persistSession]);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await authApi.logout();
      }
    } catch {
      // Clear local session even if the server call fails.
    } finally {
      clearSession();
    }
  }, [clearSession, token]);

  const updateProfile = useCallback(async (profileData) => {
    try {
      const { data } = await usersApi.updateProfile(profileData);
      const mappedUser = mapUserResponse(data);
      setUser(mappedUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mappedUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      needsVerification: Boolean(pendingEmail),
      pendingEmail,
      login,
      signup,
      verifyEmail,
      logout,
      updateProfile,
      refreshProfile,
    }),
    [user, token, loading, pendingEmail, login, signup, verifyEmail, logout, updateProfile, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
