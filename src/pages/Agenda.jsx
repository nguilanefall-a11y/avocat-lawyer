import React from 'react';

const Agenda = ({ events }) => {
    return (
        <div className="z-animate-fadein">
            <div className="panel-head">
                <div className="panel-title">Agenda & Audiences</div>
                <button className="z-btn" style={{ background: '#006BFF' }}>Import Calendly</button>
            </div>

            <div className="crystal-panel">
                {/* MOCK CALENDAR VIEW */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: '#eee', border: '1px solid #eee' }}>
                    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                        <div key={day} style={{ background: 'white', padding: '1rem', fontWeight: 'bold', textAlign: 'center' }}>{day}</div>
                    ))}
                    {/* Generating mock days */}
                    {Array.from({ length: 31 }).map((_, i) => {
                        const day = i + 1;
                        const todaysEvents = events ? events.filter(e => new Date(e.date).getDate() === day) : [];

                        return (
                            <div key={i} style={{ background: 'white', minHeight: '100px', padding: '0.5rem', position: 'relative' }}>
                                <div style={{ color: '#ccc', fontSize: '0.8rem' }}>{day}</div>
                                {todaysEvents.map(ev => (
                                    <div key={ev.id} style={{
                                        background: ev.risk === 'CRITICAL' ? '#fee2e2' : '#dbeafe',
                                        color: ev.risk === 'CRITICAL' ? '#b91c1c' : '#1e40af',
                                        fontSize: '0.7rem', padding: '2px 4px', borderRadius: '4px', marginBottom: '2px',
                                        cursor: 'pointer'
                                    }}>
                                        {ev.title}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Agenda;
