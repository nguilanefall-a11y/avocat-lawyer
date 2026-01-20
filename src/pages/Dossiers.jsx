import { useState, useEffect } from 'react';

function Dossiers() {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/documents')
            .then(res => res.json())
            .then(data => setDocuments(data));
    }, []);

    const handleUpload = (id) => {
        fetch('http://localhost:3000/api/documents/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setDocuments(prev => prev.map(d => d.id === id ? data.updatedDoc : d));
                }
            });
    };

    return (
        <main className="page-container">
            <div className="page-header">
                <h1 className="page-title">Nos Dossiers</h1>
                <p className="page-subtitle">Gestion fluide des pièces et justificatifs.</p>
            </div>

            <div className="card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Client</th>
                            <th>Document Requis</th>
                            <th>Référence Dossier</th>
                            <th>Statut</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map(doc => (
                            <tr key={doc.id}>
                                <td style={{ fontWeight: 500 }}>{doc.client}</td>
                                <td>{doc.docType}</td>
                                <td>{doc.requiredFor}</td>
                                <td>
                                    <span className={`status-badge status-${doc.status.toLowerCase()}`}>
                                        {doc.status}
                                    </span>
                                </td>
                                <td>
                                    {doc.status === 'MISSING' && (
                                        <button onClick={() => handleUpload(doc.id)} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                                            Simuler Upload
                                        </button>
                                    )}
                                    {doc.status === 'PENDING' && (
                                        <button onClick={() => handleUpload(doc.id)} className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                                            Valider la pièce
                                        </button>
                                    )}
                                    {doc.status === 'VALID' && <span style={{ color: 'var(--status-green-text)', fontSize: '1.2rem' }}>✓</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

export default Dossiers;
