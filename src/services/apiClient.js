import { getStoredToken, getStoredRefreshToken, setStoredToken, clearStoredAuth } from './authStorage';
import { refreshUserToken } from './authService';

let onUnauthorized = null;

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

export async function authenticatedFetch(url, options = {}) {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status !== 401) return response;

  // Try to refresh token once
  const refresh = getStoredRefreshToken();
  if (!refresh) {
    if (typeof onUnauthorized === 'function') onUnauthorized();
    return response;
  }

  // ensure single refresh in progress
  if (!window.__auth_refresh_in_progress) {
    window.__auth_refresh_in_progress = (async () => {
      try {
        const refreshed = await refreshUserToken(refresh);
        if (refreshed && refreshed.token) {
          setStoredToken(refreshed.token);
          if (refreshed.refreshToken) {
            try { localStorage.setItem('gym.auth.refresh', refreshed.refreshToken); } catch {}
          }
          return refreshed.token;
        }
      } catch (e) {
        return null;
      }
      return null;
    })();
  }

  const newToken = await window.__auth_refresh_in_progress;
  window.__auth_refresh_in_progress = null;

  if (!newToken) {
    if (typeof onUnauthorized === 'function') onUnauthorized();
    return response;
  }

  // retry original request with new token
  const retryHeaders = new Headers(options.headers || {});
  retryHeaders.set('Authorization', `Bearer ${newToken}`);
  if (!retryHeaders.has('Content-Type') && options.body) {
    retryHeaders.set('Content-Type', 'application/json');
  }

  return fetch(url, { ...options, headers: retryHeaders });
}
