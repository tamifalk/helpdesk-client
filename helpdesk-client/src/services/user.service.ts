import axiosInstance from "../api/axiosInstance";
import type { IUser } from "../types/auth.types";

export const getUsers = async (): Promise<IUser[]> => {
    try {

        const response = await axiosInstance.get('/users');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUsersById = async (id: number): Promise<IUser> => {
    try {
        const response = await axiosInstance.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const AddUser = async (user: IUser): Promise<IUser> => {
    try {
        const response = await axiosInstance.post('/users', user);
        return response.data;
    } catch (error) {
        throw error;
    }
};



