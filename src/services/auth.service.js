import api from './api';

export const authService = {
    // Login
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    // Logout
    logout: async () => {
        const response = await api.post('/auth/logout');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return response.data;
    },

    // Obtener perfil
    getPerfil: async () => {
        const response = await api.get('/auth/perfil');
        return response.data;
    }
};
