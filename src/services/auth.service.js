import api from './api';

export const authService = {
    // Login
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (!response.data) throw new Error('Error al obtener el perfil del usuario');
        return response.data;
    },

    // Logout
    logout: async () => {
        const response = await api.post('/auth/logout');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (!response.data) throw new Error('Error al obtener el perfil del usuario');
        return response.data;
    },

    // Obtener perfil
    getPerfil: async () => {
        const response = await api.get('/auth/perfil');
        if (!response.data) throw new Error('Error al obtener el perfil del usuario');
        return response.data;
    }
};
