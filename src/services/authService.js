// Backend API configuration
const API_BASE = import.meta.env.VITE_API_BASE || "";

/**
 * Register a new user via backend API
 * POST /api/v1/auth/register
 */
export async function registerUser(payload) {
  if (!API_BASE) {
    throw new Error("API base URL not configured. Set VITE_API_BASE in .env");
  }

  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: payload.name?.split(" ")[0] || payload.name || "User",
        last_name: payload.name?.split(" ").slice(1).join(" ") || " ",
        email: payload.email,
        password: payload.password,
        phone: payload.phone || "",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.error?.message || "Registration failed";
      throw new Error(message);
    }

    const data = await response.json();
    const { access_token, refresh_token, user } = data.data || data;

    if (!access_token || !user) {
      throw new Error("Invalid registration response from server");
    }

    return {
      token: access_token,
      refreshToken: refresh_token,
      user: {
        id: user.ID || user.id,
        name: `${user.FirstName || ""} ${user.LastName || ""}`.trim(),
        email: user.Email || user.email,
        phone: user.Phone || user.phone || "",
      },
    };
  } catch (error) {
    throw new Error(error.message || "Registration failed. Please try again.");
  }
}

/**
 * Login user via backend API
 * POST /api/v1/auth/login
 */
export async function loginUser(payload) {
  if (!API_BASE) {
    throw new Error("API base URL not configured. Set VITE_API_BASE in .env");
  }

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.error?.message || "Invalid email or password";
      throw new Error(message);
    }

    const data = await response.json();
    const { access_token, refresh_token, user } = data.data || data;

    if (!access_token || !user) {
      throw new Error("Invalid login response from server");
    }

    return {
      token: access_token,
      refreshToken: refresh_token,
      user: {
        id: user.ID || user.id,
        name: `${user.FirstName || ""} ${user.LastName || ""}`.trim(),
        email: user.Email || user.email,
        phone: user.Phone || user.phone || "",
      },
    };
  } catch (error) {
    throw new Error(error.message || "Login failed. Please try again.");
  }
}

/**
 * Refresh access token using refresh token
 * POST /api/v1/auth/refresh
 */
export async function refreshUserToken(refreshToken) {
  if (!API_BASE) {
    throw new Error("API base URL not configured");
  }

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const data = await response.json();
    const { access_token, refresh_token } = data.data || data;

    if (!access_token) {
      throw new Error("No new access token received");
    }

    return {
      token: access_token,
      refreshToken: refresh_token,
    };
  } catch (error) {
    throw new Error(error.message || "Token refresh failed");
  }
}

/**
 * Logout user (optional - revokes refresh token on backend)
 * POST /api/v1/auth/logout
 */
export async function logoutUser(token) {
  if (!API_BASE || !token) {
    return;
  }

  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }).catch(() => null); // Ignore errors on logout
  } catch (error) {
    // Silent fail - client will clear auth anyway
  }
}


