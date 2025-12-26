import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000', // הכתובת של השרת שלך
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // אם יש טוקן, נצרף אותו לבקשה תחת הכותרת Authorization
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;