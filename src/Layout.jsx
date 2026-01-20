import { Link, useLocation, Outlet } from 'react-router-dom';

function Layout() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <div className="layout-shell">
            <header className="nav-header">
                <div className="nav-container">
                    <div className="logo">
                        <span style={{ fontSize: '1.5rem' }}>⚖️</span>
                        <span>Cabinet <span className="text-gold">Avocat</span></span>
                    </div>
                    <nav className="nav-links">
                        <Link to="/" className={`nav-item ${isActive('/')}`}>Tableau de Bord</Link>
                        <Link to="/dossiers" className={`nav-item ${isActive('/dossiers')}`}>Dossiers</Link>
                        <Link to="/agenda" className={`nav-item ${isActive('/agenda')}`}>Agenda</Link>
                        <Link to="/clients" className={`nav-item ${isActive('/clients')}`}>Clients</Link>
                    </nav>
                </div>
            </header>
            <Outlet />
        </div>
    );
}

export default Layout;
