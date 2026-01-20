import React from 'react';

const Messages = ({ messages, getSourceIcon, getSourceLabel, initiateReply }) => {
    return (
        <div className="z-animate-fadein">
            <div className="panel-head">
                <div className="panel-title">Messagerie Unifiée</div>
            </div>

            <div className="crystal-panel">
                {messages.length === 0 && <div style={{ opacity: 0.5 }}>Boite vide.</div>}
                {messages.map(msg => (
                    <div key={msg.id} style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', paddingBottom: '1.5rem', borderBottom: '1px solid #eee' }}>
                        <div style={{ fontSize: '1.5rem', background: '#f5f5f4', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title={getSourceLabel(msg.source)}>
                            {getSourceIcon(msg.source)}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 'bold' }}>{msg.client}</span>
                                <span style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(msg.date).toLocaleDateString()}</span>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>{msg.subject}</div>
                            <div style={{ background: '#fafafa', padding: '1rem', borderRadius: '8px', fontSize: '0.95rem' }}>
                                "{msg.content}"
                            </div>
                            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => initiateReply(msg)} className="z-btn-action">Répondre (IA)</button>
                                <button className="z-btn-action" style={{ background: 'white' }}>Archiver</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Messages;
