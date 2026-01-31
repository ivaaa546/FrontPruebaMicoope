import { useState, useEffect } from 'react';
import { agenciasService, municipiosService } from '../services/agencias.service';
import { useAuth } from '../context/AuthContext';
import AgenciaForm from '../components/AgenciaForm';
import './Admin.css';

const Admin = () => {
    const [agencias, setAgencias] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [agenciaEditar, setAgenciaEditar] = useState(null);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

    const { isAdmin } = useAuth();

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const [agenciasData, municipiosData, departamentosData] = await Promise.all([
                agenciasService.getAll(),
                municipiosService.getAll(),
                municipiosService.getDepartamentos()
            ]);
            setAgencias(agenciasData);
            setMunicipios(municipiosData);
            setDepartamentos(departamentosData);
        } catch (err) {
            mostrarMensaje('error', 'Error al cargar datos');
        } finally {
            setLoading(false);
        }
    };

    const mostrarMensaje = (tipo, texto) => {
        setMensaje({ tipo, texto });
        setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
    };

    const handleNueva = () => {
        setAgenciaEditar(null);
        setShowForm(true);
    };

    const handleEditar = (agencia) => {
        setAgenciaEditar(agencia);
        setShowForm(true);
    };

    const handleEliminar = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar esta agencia?')) return;

        try {
            await agenciasService.delete(id);
            mostrarMensaje('success', 'Agencia eliminada correctamente');
            cargarDatos();
        } catch (err) {
            mostrarMensaje('error', 'Error al eliminar la agencia');
        }
    };

    const handleCambiarEstado = async (agencia) => {
        try {
            const nuevoEstado = !agencia.estado;
            await agenciasService.updateStatus(agencia.id_agencia, nuevoEstado);
            mostrarMensaje('success', `Agencia ${nuevoEstado ? 'activada' : 'desactivada'} correctamente`);
            cargarDatos();
        } catch (err) {
            mostrarMensaje('error', 'Error al cambiar el estado');
        }
    };

    const handleGuardar = async (datos) => {
        try {
            // Si se está editando un municipio existente
            if (datos.editandoMunicipioExistente) {
                const { id_municipio, ...municipioData } = datos.editandoMunicipioExistente;
                await municipiosService.update(id_municipio, municipioData);
            }

            if (agenciaEditar) {
                await agenciasService.update(agenciaEditar.id_agencia, datos);
                mostrarMensaje('success', 'Agencia actualizada correctamente');
            } else {
                await agenciasService.create(datos);
                mostrarMensaje('success', 'Agencia creada correctamente');
            }
            setShowForm(false);
            cargarDatos();
        } catch (err) {
            // Re-lanzamos el error para que el AgenciaForm pueda mostrar validaciones específicas
            throw err;
        }
    };

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    return (
        <div className="admin">
            <header className="admin-header">
                <h1>Administrar Agencias</h1>
                {isAdmin() && (
                    <button onClick={handleNueva} className="btn-nueva">
                        + Nueva Agencia
                    </button>
                )}
            </header>

            {mensaje.texto && (
                <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>
            )}

            {showForm && (
                <AgenciaForm
                    agencia={agenciaEditar}
                    municipios={municipios}
                    departamentos={departamentos}
                    onGuardar={handleGuardar}
                    onCancelar={() => setShowForm(false)}
                />
            )}

            <table className="agencias-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Serie / Código</th>
                        <th>Municipio</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {agencias.map((agencia) => (
                        <tr key={agencia.id_agencia}>
                            <td>{agencia.nombre}</td>
                            <td>{agencia.serie} - {agencia.codigo}</td>
                            <td>{agencia.municipios?.nombre}</td>
                            <td>
                                <span className={`estado ${agencia.estado ? 'activa' : 'inactiva'}`}>
                                    {agencia.estado ? 'Activa' : 'Inactiva'}
                                </span>
                            </td>
                            <td className="acciones">
                                <button
                                    onClick={() => handleCambiarEstado(agencia)}
                                    className={`btn-estado ${agencia.estado ? 'btn-desactivar' : 'btn-activar'}`}
                                >
                                    {agencia.estado ? 'Desactivar' : 'Activar'}
                                </button>

                                {isAdmin() && (
                                    <>
                                        <button onClick={() => handleEditar(agencia)} className="btn-editar">
                                            Editar
                                        </button>
                                        <button onClick={() => handleEliminar(agencia.id_agencia)} className="btn-eliminar">
                                            Eliminar
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Admin;
