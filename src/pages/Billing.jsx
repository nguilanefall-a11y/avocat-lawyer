import React, { useState } from 'react';

const Billing = () => {
    // Shared state or mock global state would be better, but local for now
    const [clients, setClients] = useState([
        { id: 1, name: "M. Martin" },
        { id: 2, name: "Société Dupuis" },
        { id: 3, name: "Mme. Lefebvre" }
    ]);

    const [invoices, setInvoices] = useState([
        { id: 101, client: "M. Martin", amount: 1200, status: "DRAFT", date: "2024-01-15" },
        { id: 102, client: "Société Dupuis", amount: 4500, status: "SENT", date: "2024-01-10" }
    ]);
    const [showCreate, setShowCreate] = useState(false);

    // FORM STATE
    const [createMode, setCreateMode] = useState('INVOICE'); // 'INVOICE' or 'NEW_CLIENT'
    const [newInvoice, setNewInvoice] = useState({ clientName: '', amount: '', details: '' });
    const [tempClient, setTempClient] = useState({ name: '', email: '' });

    const handleCreateInvoice = () => {
        setInvoices([...invoices, {
            id: Date.now(),
            client: newInvoice.clientName,
            amount: newInvoice.amount,
            status: 'DRAFT',
            date: new Date().toISOString().split('T')[0]
        }]);
        setShowCreate(false);
        setNewInvoice({ clientName: '', amount: '', details: '' });
    };

    const handleQuickAddClient = () => {
        if (!tempClient.name) return;
        const newC = { id: Date.now(), name: tempClient.name };
        setClients([...clients, newC]);
        setNewInvoice({ ...newInvoice, clientName: newC.name }); // Auto-select
        setCreateMode('INVOICE');
        setTempClient({ name: '', email: '' });
    };

    return (
        <div className="z-animate-fadein">
            <div className="panel-head">
                <div className="panel-title">Facturation & Honoraires</div>
                <button className="z-btn" onClick={() => { setShowCreate(true); setCreateMode('INVOICE'); }}>+ Créer Facture</button>
            </div>

            {/* MODAL */}
            {showCreate && (
                <div className="preview-overlay" style={{ display: 'flex' }}>
                    <div className="preview-bubble">

                        {/* HEADER SWITCH */}
                        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                            <h3 style={{ margin: 0 }}>
                                {createMode === 'INVOICE' ? 'Nouvelle Facture' : 'Nouveau Client Rapide'}
                            </h3>
                        </div>

                        {/* MODE: INVOICE FORM */}
                        {createMode === 'INVOICE' && (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <label>Client</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <select
                                            className="z-input"
                                            value={newInvoice.clientName}
                                            onChange={e => setNewInvoice({ ...newInvoice, clientName: e.target.value })}
                                            style={{ flex: 1 }}
                                        >
                                            <option value="">Sélectionner un client...</option>
                                            {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                        </select>
                                        <button
                                            className="z-btn z-btn-ghost"
                                            onClick={() => setCreateMode('NEW_CLIENT')}
                                            title="Ajouter un nouveau client"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label>Montant HT (€)</label>
                                            <input
                                                className="z-input"
                                                type="number"
                                                value={newInvoice.amount}
                                                onChange={e => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label>TVA (20%)</label>
                                            <input
                                                className="z-input"
                                                value={newInvoice.amount ? (newInvoice.amount * 0.2).toFixed(2) : ''}
                                                readOnly
                                                style={{ background: '#f5f5f5' }}
                                            />
                                        </div>
                                    </div>

                                    <label>Détails / Prestation</label>
                                    <textarea
                                        className="z-input"
                                        rows={3}
                                        placeholder="Rédaction d'acte, Consultation..."
                                        value={newInvoice.details}
                                        onChange={e => setNewInvoice({ ...newInvoice, details: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="preview-actions">
                                    <button className="z-btn z-btn-ghost" style={{ color: 'black', borderColor: '#ccc' }} onClick={() => setShowCreate(false)}>Annuler</button>
                                    <button className="z-btn" onClick={handleCreateInvoice}>Générer PDF</button>
                                </div>
                            </>
                        )}

                        {/* MODE: NEW CLIENT FORM */}
                        {createMode === 'NEW_CLIENT' && (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <label>Nom / Raison Sociale</label>
                                    <input
                                        className="z-input"
                                        autoFocus
                                        value={tempClient.name}
                                        onChange={e => setTempClient({ ...tempClient, name: e.target.value })}
                                    />
                                    <label>Email (Optionnel)</label>
                                    <input
                                        className="z-input"
                                        value={tempClient.email}
                                        onChange={e => setTempClient({ ...tempClient, email: e.target.value })}
                                    />
                                </div>
                                <div className="preview-actions">
                                    <button className="z-btn z-btn-ghost" style={{ color: 'black', borderColor: '#ccc' }} onClick={() => setCreateMode('INVOICE')}>Retour</button>
                                    <button className="z-btn" onClick={handleQuickAddClient}>Enregistrer & Sélectionner</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className="crystal-panel">
                <div className="z-list-item" style={{ borderBottom: '2px solid #eee' }}>
                    <div style={{ flex: 1, fontWeight: 'bold' }}>Client</div>
                    <div style={{ flex: 1, fontWeight: 'bold' }}>Date</div>
                    <div style={{ flex: 1, fontWeight: 'bold' }}>Montant</div>
                    <div style={{ flex: 1, fontWeight: 'bold' }}>Status</div>
                    <div style={{ width: '100px' }}></div>
                </div>
                {invoices.map(inv => (
                    <div key={inv.id} className="z-list-item">
                        <div style={{ flex: 1 }}>{inv.client}</div>
                        <div style={{ flex: 1 }}>{inv.date}</div>
                        <div style={{ flex: 1 }}>{inv.amount} €</div>
                        <div style={{ flex: 1 }}>
                            <span style={{
                                padding: '0.2rem 0.5rem',
                                borderRadius: '4px',
                                background: inv.status === 'SENT' ? '#dcfce7' : '#f3f4f6',
                                color: inv.status === 'SENT' ? '#166534' : '#6b7280',
                                fontSize: '0.8rem', fontWeight: 600
                            }}>{inv.status}</span>
                        </div>
                        <div style={{ width: '100px', display: 'flex', gap: '10px' }}>
                            <button className="z-btn-action">Voir</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Billing;
