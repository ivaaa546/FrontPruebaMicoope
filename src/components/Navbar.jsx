import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">
                    <h1>Cooperativa Cobán</h1>
                </Link>
            </div>

            <div className="navbar-links">
                <Link to="/">Agencias</Link>

                {user ? (
                    <>
                        <Link to="/admin">Administrar</Link>
                        <span className="user-name">{user.nombre}</span>
                        <button onClick={handleLogout} className="btn-logout">
                            Cerrar Sesión
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="btn-login">Iniciar Sesión</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
