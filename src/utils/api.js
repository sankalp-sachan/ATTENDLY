import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || (
        window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:5000/api'
            : 'https://attendly-backend-pe5k.onrender.com/api'
    ),
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const user = localStorage.getItem('attendly_current_user'); // Note: AuthContext stores the whole user object
        // Wait, AuthContext stores user object which has 'token' inside it from my backend controller response
        // But currently frontend localStorage 'attendly_current_user' might just have structure defined in AuthContext.
        // I need to ensure when I integrate, I save the token.
        // For now, let's assume if it has token, we use it.
        if (user) {
            const parsedUser = JSON.parse(user);
            if (parsedUser.token) {
                config.headers.Authorization = `Bearer ${parsedUser.token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
