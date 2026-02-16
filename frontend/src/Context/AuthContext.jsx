import { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize auth state from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Register
    const register = async (name, email, password) => {
        try {
            setError(null);
            setLoading(true);
            const { data } = await api.post("/api/auth/register", {
                name,
                email,
                password,
            });

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setToken(data.token);
            setUser(data.user);
            setLoading(false);
            return { success: true };
        } catch (err) {
            setLoading(false);
            const errorMessage = err.response?.data?.error || "Registration failed";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    // Login
    const login = async (email, password) => {
        try {
            setError(null);
            setLoading(true);
            const { data } = await api.post("/api/auth/login", { email, password });

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setToken(data.token);
            setUser(data.user);
            setLoading(false);
            return { success: true };
        } catch (err) {
            setLoading(false);
            const errorMessage = err.response?.data?.error || "Login failed";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated: !!token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
