import { useState, useEffect, useCallback } from 'react';
import { agenciasService } from '../services/agencias.service';
import AgenciaCard from '../components/AgenciaCard';
import './Home.css';

const Home = () => {
    const [agencias, setAgencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [busquedaTimeout, setBusquedaTimeout] = useState(null);

    // Cache timeout ID para evitar múltiples peticiones
    const CACHE_KEY = 'agencias_home_cache';
    const CACHE_TIME_KEY = 'agencias_home_time';
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

    const cargarAgenciasDelCache = () => {
        try {
            const cached = sessionStorage.getItem(CACHE_KEY);
            const cacheTime = sessionStorage.getItem(CACHE_TIME_KEY);

            if (cached && cacheTime) {
                const now = Date.now();
                if (now - parseInt(cacheTime) < CACHE_DURATION) {
                    console.log(' Cargando agencias del caché');
                    return JSON.parse(cached);
                }
            }
            return null;
        } catch (err) {
            console.error('Error al leer caché:', err);
            return null;
        }
    };

    const guardarEnCache = (datos) => {
        try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(datos));
            sessionStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
            console.log('💾 Agencias guardadas en caché');
        } catch (err) {
            console.error('Error al guardar caché:', err);
        }
    };

    const cargarAgencias = useCallback(async (filtros = {}) => {
        try {
            setLoading(true);

            // Primero intentar cargar del caché
            if (!filtros.buscar) {
                const cached = cargarAgenciasDelCache();
                if (cached) {
                    setAgencias(cached);
                    setLoading(false);
                    return;
                }
            }

            console.log(' Cargando agencias del servidor');
            // Si no hay caché o hay búsqueda, cargar del servidor
            const data = await agenciasService.getForHome({
                estado: true,
                ...filtros
            });

            setAgencias(data);

            // Guardar en caché solo si no hay búsqueda activa
            if (!filtros.buscar) {
                guardarEnCache(data);
            }

            setError(null);
        } catch (err) {
            setError('Error al cargar las agencias');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarAgencias();
    }, [cargarAgencias]);

    // Búsqueda con debounce (espera 300ms antes de hacer la petición)
    const manejarBusqueda = (valor) => {
        setBusqueda(valor);

        // Limpiar timeout anterior
        if (busquedaTimeout) {
            clearTimeout(busquedaTimeout);
        }

        if (valor.trim() === '') {
            // Si el campo está vacío, restaurar datos del caché
            const cached = cargarAgenciasDelCache();
            if (cached) {
                setAgencias(cached);
            }
            return;
        }

        // Debounce: esperar 300ms antes de hacer la búsqueda
        const timeout = setTimeout(() => {
            console.log('🔍 Buscando:', valor);
            cargarAgencias({ buscar: valor });
        }, 300);

        setBusquedaTimeout(timeout);
    };

    // Filtrar localmente para búsqueda en dirección
    const agenciasFiltradas = agencias.filter(agencia =>
        agencia.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        agencia.direccion.toLowerCase().includes(busqueda.toLowerCase())
    );

    if (loading) {
        return <div className="loading"> Cargando agencias...</div>;
    }

    if (error) {
        return <div className="error"> {error}</div>;
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
                        onChange={(e) => manejarBusqueda(e.target.value)}
                    />
                </div>
            </header>

            <div className="agencias-grid">
                {agenciasFiltradas.length > 0 ? (
                    agenciasFiltradas.map((agencia) => (
                        <AgenciaCard key={agencia.id_agencia} agencia={agencia} />
                    ))
                ) : (
                    <p className="no-results">No se encontraron agencias</p>
                )}
            </div>
        </div>
    );
};

export default Home;
