import { useState, useEffect } from 'react';
import { agenciasService } from '../services/agencias.service';
import AgenciaCard from '../components/AgenciaCard';
import './Home.css';

const Home = () => {
    const [agencias, setAgencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        cargarAgencias();
    }, []);

    const cargarAgencias = async () => {
        try {
            setLoading(true);
            const data = await agenciasService.getAll({ estado: true });
            setAgencias(data);
        } catch (err) {
            setError('Error al cargar las agencias');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const agenciasFiltradas = agencias.filter(agencia =>
        agencia.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        agencia.direccion.toLowerCase().includes(busqueda.toLowerCase())
    );

    if (loading) {
        return <div className="loading">Cargando agencias...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="home">
            <header className="home-header">
                <h1>Nuestras Agencias</h1>
                <p>Encuentra la agencia más cercana a ti</p>

                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Buscar agencia..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
            </header>

            <div className="agencias-grid">
                {agenciasFiltradas.map((agencia) => (
                    <AgenciaCard key={agencia.id_agencia} agencia={agencia} />
                ))}
            </div>

            {agenciasFiltradas.length === 0 && (
                <p className="no-results">No se encontraron agencias</p>
            )}
        </div>
    );
};

export default Home;
