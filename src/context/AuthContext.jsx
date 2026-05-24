import { useMemo, useState } from 'react';
import { loginUser, registerUser } from '../services/authService';
import {
  clearStoredAuth,
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
  setStoredRefreshToken,
} from '../services/authStorage';
import { setUnauthorizedHandler } from '../services/apiClient';
import { AuthContext } from './authContext';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => getStoredUser());

  const logout = () => {
    clearStoredAuth();
    setToken(null);
    setUser(null);
  };

  setUnauthorizedHandler(logout);

  const login = async (payload) => {
    const response = await loginUser(payload);
    setStoredToken(response.token);
    if (response.refreshToken) setStoredRefreshToken(response.refreshToken);
    setStoredUser(response.user);
    setToken(response.token);
    setUser(response.user);
    return response.user;
  };

  const register = async (payload) => {
    const response = await registerUser(payload);
    setStoredToken(response.token);
    if (response.refreshToken) setStoredRefreshToken(response.refreshToken);
    setStoredUser(response.user);
    setToken(response.token);
    setUser(response.user);
    return response.user;
  };

  const updateUser = (nextUser) => {
    setStoredUser(nextUser);
    setUser(nextUser);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      updateUser,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
