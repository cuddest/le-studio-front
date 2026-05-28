import { useMemo, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/authService';
import { listUserPacks, listTrainingTypes } from '../services/userPackService';
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
  const [userPacks, setUserPacks] = useState([]);
  const [trainingTypes, setTrainingTypes] = useState([]);
  const [packsLoading, setPacksLoading] = useState(false);

  // Fetch user packs and training types when authenticated
  useEffect(() => {
    if (!token || !user) {
      setUserPacks([]);
      setTrainingTypes([]);
      return;
    }

    const loadPacksAndTypes = async () => {
      setPacksLoading(true);
      try {
        const [packs, types] = await Promise.all([listUserPacks(), listTrainingTypes()]);
        setUserPacks(packs);
        setTrainingTypes(types);
      } catch (err) {
        console.error('Failed to load packs/types:', err);
        // Don't break auth; just show empty packs
        setUserPacks([]);
      } finally {
        setPacksLoading(false);
      }
    };

    loadPacksAndTypes();
  }, [token, user]);

  const logout = () => {
    clearStoredAuth();
    setToken(null);
    setUser(null);
    setUserPacks([]);
    setTrainingTypes([]);
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

  const refreshPacks = async () => {
    try {
      const packs = await listUserPacks();
      setUserPacks(packs);
      return packs;
    } catch (err) {
      console.error('Failed to refresh packs:', err);
      return userPacks;
    }
  };

  const value = useMemo(
    () => ({
      token,
      user,
      userPacks,
      trainingTypes,
      packsLoading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      updateUser,
      refreshPacks,
    }),
    [token, user, userPacks, trainingTypes, packsLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
