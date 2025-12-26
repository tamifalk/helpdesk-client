import axiosInstance from "../api/axiosInstance";
import type { ILoginData, IRegisterData } from "../types/auth.types";

export const RegisterUser = async (data: IRegisterData) => {
    try {
        await axiosInstance.post('/auth/register', data);
        const response = await axiosInstance.post('/auth/login', {
            email: data.email,
            password: data.password
        });
        return response.data;
    } catch (error) {
        console.error("Register failed:", error);
        throw error;
    }
};

export const LoginUser = async (data: ILoginData) => {
    try {
        const response = await axiosInstance.post('/auth/login', data); 
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};

export const GetMe = async () => {
    try {
        const response = await axiosInstance.get('/auth/me');
        return response.data; 
    } catch (error) {
        console.error("GetMe failed:", error);
        throw error;
    }
};