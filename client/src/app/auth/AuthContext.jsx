import React from "react";
import apiService from "../../services/api.js";

const AuthContext = React.createContext(null);

function loadToken() {
  return localStorage.getItem("token");
}

function saveToken(token) {
  if (!token) localStorage.removeItem("token");
  else localStorage.setItem("token", token);
}

const USER_KEY = "user";

function loadUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn("Failed to parse stored user", err);
    return null;
  }
}

function saveUser(user) {
  if (!user) {
    localStorage.removeItem(USER_KEY);
    return;
  }
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function init() {
      const token = loadToken();
      const storedUser = loadUser();

      // If we have both a token and stored user info, restore the full session
      if (token && storedUser) {
        apiService.setToken(token);
        setUser(storedUser);
      } else if (token) {
        // Token without user data is likely stale; clear it to avoid broken UI state
        saveToken(null);
        saveUser(null);
        apiService.token = null;
      }
      setLoading(false);
    }
    init();
  }, []);

  async function login(username, password) {
    const response = await apiService.login(username, password);
    setUser(response.user);
    saveUser(response.user);
    saveToken(response.token);
    return response.user;
  }

  function logout() {
    setUser(null);
    saveToken(null);
    saveUser(null);
    apiService.token = null;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("AuthProvider missing");
  return ctx;
}
