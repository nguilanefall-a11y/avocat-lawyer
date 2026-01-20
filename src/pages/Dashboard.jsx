
import React from 'react';

const Dashboard = ({ invoices, documents, events, initiateRemind, handleUpload, onQuickAction }) => {
    const totalLate = invoices.filter(i => i.status === 'LATE').reduce((acc, c) => acc + c.amount, 0);
    const criticalEvents = events.filter(e => e.risk === 'CRITICAL').length;
    const missingDocs = documents.filter(d => d.status !== 'MISSING' && d.status !== 'VALID').length; // Correcting filter logic based on previous usage

    return (
        <div className="zenith-grid">
            <div className="crystal-panel col-kpi">
                <div className="panel-caption">Recouvrement</div>
                <div className="kpi-huge">{totalLate.toLocaleString()} €</div>
            </div>
            <div className="crystal-panel col-kpi">
                <div className="panel-caption">Pièces à Valider</div>
                <div className="kpi-huge">{missingDocs}</div>
            </div>
            <div className="crystal-panel col-kpi">
                <div className="panel-caption">Prochaines Audiences</div>
                <div className="kpi-huge">{criticalEvents}</div>
            </div>

            {/* QUICK ACTIONS - TIME SAVER */}
            <div className="crystal-panel col-main" style={{ marginBottom: '0' }}>
                <div className="panel-head">
                    <div className="panel-title">Outils Rapides</div>
                    <div className="panel-caption">Gain de temps</div>
                </div>
                <div className="quick-actions-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                    <button className="quick-action-card" onClick={() => onQuickAction("BILLING")}>
                        <div className="qa-icon">💶</div>
                        <div className="qa-label">Créer Facture</div>
                    </button>
                    <button className="quick-action-card" onClick={() => onQuickAction("DOCUMENTS")}>
                        <div className="qa-icon">📝</div>
                        <div className="qa-label">Rédiger Acte</div>
                    </button>
                    <button className="quick-action-card" onClick={() => onQuickAction("MESSAGES")}>
                        <div className="qa-icon">📨</div>
                        <div className="qa-label">Traiter Mails</div>
                    </button>
                    <button className="quick-action-card" onClick={() => onQuickAction("CLIENTS")}>
                        <div className="qa-icon">👥</div>
                        <div className="qa-label">Nouveau Client</div>
                    </button>
                </div>
            </div>

            <div className="crystal-panel col-main">
                <div className="panel-head">
                    <div className="panel-title">Actions Requises</div>
                    <div className="panel-caption">Gestion Zen</div>
                </div>
                {/* INVOICES */}
                {invoices.filter(i => i.status === 'LATE').length === 0 && <div style={{ color: '#888', fontStyle: 'italic', padding: '1rem' }}>Aucun retard de paiement.</div>}
                {invoices.filter(i => i.status === 'LATE').map(inv => (
                    <div key={inv.id} className="z-list-item">
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{inv.client}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                En attente • {inv.amount} € • <span style={{ fontWeight: 500, color: 'var(--gold-antique)' }}>Suivi #{inv.remindersSent + 1}</span>
                            </div>
                        </div>
                        <button onClick={() => initiateRemind(inv)} className="z-btn-action">Relancer (IA)</button>
                    </div>
                ))}
                {/* DOCS */}
                <div style={{ marginTop: '2rem' }}>
                    {documents.filter(d => d.status !== 'VALID').map(doc => (
                        <div key={doc.id} className="z-list-item">
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{doc.client}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--gold-antique)', fontWeight: 600, marginRight: '0.5rem' }}>À COMPLÉTER</span>
                                    {doc.docType}
                                </div>
                            </div>
                            <button onClick={() => handleUpload(doc.id)} className="z-btn-action">
                                {doc.status === 'MISSING' ? 'Réceptionner' : 'Valider'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="col-side" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="crystal-panel">
                    <div className="panel-head">
                        <div className="panel-title">Agenda</div>
                    </div>
                    <div className="z-timeline">
                        <div className="z-time-line"></div>
                        {events.map(event => (
                            <div key={event.id} className="z-event">
                                <div className="z-dot"></div>
                                <div style={{ fontWeight: 600 }}>{event.title}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    {new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric' })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
