import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            setIsLoading(true);
            fetchMe();
        } else {
            delete axios.defaults.headers.common["Authorization"];
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const fetchMe = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/auth/profile`);
            const profileData = response.data.data;
            const standardizedUser = {
                id: profileData._id,
                username: profileData.username,
                role: profileData.role?.name,
                fullName: profileData.employee?.fullName,
                department: profileData.employee?.department?.name,
                position: profileData.employee?.position?.title,
                organization: profileData.employee?.department?.organization, // Corrected path
            };
            setUser(standardizedUser);
        } catch (error) {
            console.error("Error fetching user data:", error);
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                username,
                password,
            });

            const newToken = response.data.token;
            const userData = response.data.user;

            localStorage.setItem("token", newToken);
            setToken(newToken);
            setUser(userData);

            return { success: true, message: "Login successful!" };
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Incorrect username or password.";
            return { success: false, message: errorMessage };
        }
    };
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout, fetchMe }}>
            {children}
        </AuthContext.Provider>
    );
};