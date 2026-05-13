import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("aiml_token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("aiml_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [checkingSession, setCheckingSession] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setCheckingSession(false);
      return;
    }

    api
      .get("/auth/me")
      .then(({ data }) => {
        const nextUser = data.user;
        localStorage.setItem("aiml_user", JSON.stringify(nextUser));
        setUser(nextUser);
      })
      .catch(() => {
        localStorage.removeItem("aiml_token");
        localStorage.removeItem("aiml_user");
        setToken(null);
        setUser(null);
      })
      .finally(() => setCheckingSession(false));
  }, [token]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("aiml_token", data.token);
    localStorage.setItem("aiml_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("aiml_token");
    localStorage.removeItem("aiml_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ checkingSession, isAuthenticated: Boolean(token) && user?.role === "admin", login, logout, token, user }), [checkingSession, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
