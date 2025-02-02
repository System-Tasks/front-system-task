"use client";
import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { loginRequest, registerRequest } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [error, setError] = useState([]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError([])
            }, 5000)

            return () => clearTimeout(timer)
        }
    }, [error])


    const login = async (credentials) => {
        try {
            const {data} = await loginRequest(credentials);
            console.log(data)
            Cookies.set("token", data.token, { expires: 7 });
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
            return { success: true, message: data.message };
        } catch (error) {
            console.log(error)
            setError([error.response.data.message]);
        }
    };

    const signUp = async (request) => {
        try {
            const {data} = await registerRequest(request);
            return { success: true, message: data.message };
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const logout = () => {
        Cookies.remove("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signUp, logout, error }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}