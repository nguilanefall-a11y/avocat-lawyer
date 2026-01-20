import React, { useState, useEffect } from 'react';

const Clients = () => {
    // Mock data for now, ideally fetched from API
    const [clients, setClients] = useState([
        { id: 1, name: "M. Martin", email: "martin@email.com", phone: "0601020304" },
        { id: 2, name: "Société Dupuis", email: "contact@dupuis.com", phone: "0102030405" },
        { id: 3, name: "Mme. Lefebvre", email: "lefebvre@email.com", phone: "0612345678" }
    ]);

    const [isAdding, setIsAdding] = useState(false);
    const [newClient, setNewClient] = useState({ name: '', email: '', phone: '' });

    const handleAddClient = () => {
        if (!newClient.name) return;
        setClients([...clients, { ...newClient, id: Date.now() }]);
        setNewClient({ name: '', email: '', phone: '' });
        setIsAdding(false);
    };

    return (
        <div className="z-animate-fadein">
            <div className="panel-head">
                <div className="panel-title">Clients</div>
                <button className="z-btn" onClick={() => setIsAdding(!isAdding)}>+ Nouveau Client</button>
            </div>

            {isAdding && (
                <div className="crystal-panel" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginTop: 0 }}>Ajouter un client</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <input
                            className="z-input"
                            placeholder="Nom / Raison Sociale"
                            value={newClient.name}
                            onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                        />
                        <input
                            className="z-input"
                            placeholder="Email"
                            value={newClient.email}
                            onChange={e => setNewClient({ ...newClient, email: e.target.value })}
                        />
                        <input
                            className="z-input"
                            placeholder="Téléphone"
                            value={newClient.phone}
                            onChange={e => setNewClient({ ...newClient, phone: e.target.value })}
                        />
                    </div>
                    <button className="z-btn" onClick={handleAddClient}>Enregistrer</button>
                </div>
            )}

            <div className="crystal-panel">
                <table className="z-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                            <th style={{ padding: '1rem' }}>Nom</th>
                            <th style={{ padding: '1rem' }}>Email</th>
                            <th style={{ padding: '1rem' }}>Téléphone</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(client => (
                            <tr key={client.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <td style={{ padding: '1rem' }}><strong>{client.name}</strong></td>
                                <td style={{ padding: '1rem' }}>{client.email}</td>
                                <td style={{ padding: '1rem' }}>{client.phone}</td>
                                <td style={{ padding: '1rem' }}>
                                    <button className="z-btn-action">Voir Dossier</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Clients;
