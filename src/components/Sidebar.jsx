import React from 'react';

const Sidebar = ({ activeSection, setActiveSection }) => {
    return (
        <aside className="main-sidebar">
            <div className="brand-mark" style={{ padding: '2rem', fontSize: '1.2rem' }}>Cabinet Digital</div>
            <nav className="nav-menu">
                <button className={`nav-item ${activeSection === 'DASHBOARD' ? 'active' : ''}`} onClick={() => setActiveSection('DASHBOARD')}>Tableau de Bord</button>
                <button className={`nav-item ${activeSection === 'CLIENTS' ? 'active' : ''}`} onClick={() => setActiveSection('CLIENTS')}>Clients</button>
                <button className={`nav-item ${activeSection === 'DOSSIERS' ? 'active' : ''}`} onClick={() => setActiveSection('DOSSIERS')}>Dossiers</button>
                <button className={`nav-item ${activeSection === 'DOCUMENTS' ? 'active' : ''}`} onClick={() => setActiveSection('DOCUMENTS')}>Documents</button>
                <button className={`nav-item ${activeSection === 'BILLING' ? 'active' : ''}`} onClick={() => setActiveSection('BILLING')}>Facturation</button>
                <button className={`nav-item ${activeSection === 'CALENDAR' ? 'active' : ''}`} onClick={() => setActiveSection('CALENDAR')}>Agenda</button>
                <button className={`nav-item ${activeSection === 'MESSAGES' ? 'active' : ''}`} onClick={() => setActiveSection('MESSAGES')}>Messagerie</button>
            </nav>
        </aside>
    );
};

export default Sidebar;
