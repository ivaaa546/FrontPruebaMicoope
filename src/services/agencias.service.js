import api from './api';

export const agenciasService = {
    // Obtener todas las agencias
    getAll: async (filtros = {}) => {
        const params = new URLSearchParams(filtros).toString();
        const response = await api.get(`/agencias?${params}`);
        return response.data;
    },

    // Obtener una agencia por ID
    getById: async (id) => {
        const response = await api.get(`/agencias/${id}`);
        return response.data;
    },

    // Crear nueva agencia
    create: async (agencia) => {
        const response = await api.post('/agencias', agencia);
        return response.data;
    },

    // Actualizar agencia
    update: async (id, agencia) => {
        const response = await api.put(`/agencias/${id}`, agencia);
        return response.data;
    },

    // Eliminar agencia
    delete: async (id) => {
        const response = await api.delete(`/agencias/${id}`);
        return response.data;
    },

    // Actualizar estado (Activar/Desactivar)
    updateStatus: async (id, estado) => {
        const response = await api.patch(`/agencias/${id}/estado`, { estado });
        return response.data;
    }
};

export const municipiosService = {
    // Obtener todos los municipios
    getAll: async (departamento = null) => {
        const params = departamento ? `?departamento=${departamento}` : '';
        const response = await api.get(`/municipios${params}`);
        return response.data;
    },

    // Obtener departamentos
    getDepartamentos: async () => {
        const response = await api.get('/municipios/departamentos');
        return response.data;
    },

    // Crear un nuevo municipio
    create: async (municipio) => {
        const response = await api.post('/municipios', municipio);
        return response.data;
    }
};
