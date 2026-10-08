import { createContext, useContext, useEffect, useState } from "react";

import {
    loginUser,
    getCurrentUser
} from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        getCurrentUser(token)
            .then((userData) => {
                setUser(userData);
            })
            .catch(() => {
                localStorage.removeItem("token");
                setToken(null);
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [token]);

    async function login(email, password) {
        const data = await loginUser(email, password);

        localStorage.setItem(
            "token",
            data.access_token
        );

        setToken(data.access_token);

        const userData = await getCurrentUser(
            data.access_token
        );

        setUser(userData);

        return userData;
    }

    function logout() {
        localStorage.removeItem("token");

        setToken(null);
        setUser(null);
    }

    const value = {
        token,
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}