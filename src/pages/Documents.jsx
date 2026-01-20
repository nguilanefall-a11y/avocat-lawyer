import React, { useState } from 'react';

const Documents = () => {
    // STATE MACHINE
    const [step, setStep] = useState(1);
    const [selections, setSelections] = useState({
        category: null,
        type: null,
        client: '',
        details: ''
    });

    // MOCK DATA
    const categories = [
        { id: 'REDACTION', label: 'Rédaction d\'Actes', icon: '📝', desc: 'Contrats, Baux, Statuts...' },
        { id: 'CONSEIL', label: 'Conseil Juridique', icon: '💡', desc: 'Avis, Stratégies, RGPD...' },
        { id: 'REPRESENTATION', label: 'Représentation', icon: '⚖️', desc: 'Procédures, Audiences...' },
        { id: 'FORMALITES', label: 'Formalités', icon: 'stamp', desc: 'Immatriculations, Dépôts...' }, // stamp emoji placeholder
    ];

    const subTypes = {
        REDACTION: [
            { id: 'CONTRAT_TRAVAIL', label: 'Contrat de Travail (CDI)', template: "ENTRE LES SOUSSIGNÉS : \n\nL'employeur : [CLIENT] \nEt \nLe salarié : [NOM_SALARIE] \n\nIL A ÉTÉ CONVENU CE QUI SUIT : \nLe salarié est engagé en qualité de [POSTE]..." },
            { id: 'MISE_EN_DEMEURE', label: 'Mise en Demeure', template: "OBJET : MISE EN DEMEURE DE PAYER \n\nMadame, Monsieur,\n\nSauf erreur ou omission de notre part, le paiement de la facture n°[NUM_FACTURE] d'un montant de [MONTANT]€ ne nous est pas parvenu.\n\nNous vous mettons en demeure par la présente..." },
            { id: 'NDA', label: 'Accord de Confidentialité', template: "ACCORD DE CONFIDENTIALITÉ \n\nEntre [CLIENT] et [PARTIE_ADVERSE].\n\nLes parties s'engagent à conserver confidentielles toutes les informations..." },
            { id: 'STATUTS', label: 'Statuts SAS', template: "STATUTS DE LA SOCIÉTÉ [CLIENT] \n\nForme : Société par Actions Simplifiée \nSiège social : [ADRESSE] \n\nARTICLE 1 : FORME \nIl est formé..." }
        ],
        CONSEIL: [
            { id: 'NOTE_SYNTHESE', label: 'Note de Synthèse', template: "NOTE JURIDIQUE \n\nCLIENT : [CLIENT] \nOBJET : Analyse de risque \n\n1. RAPPEL DES FAITS \n...\n\n2. ANALYSE JURIDIQUE \n...\n\n3. RECOMMANDATIONS \n..." },
            { id: 'AUDIT_RGPD', label: 'Audit de Conformité', template: "RAPPORT D'AUDIT \n\nEntité auditée : [CLIENT] \nDate : [DATE] \n\nConclusion : Le niveau de conformité est..." }
        ],
        REPRESENTATION: [
            { id: 'ASSIGNATION', label: 'Projet d\'Assignation', template: "ASSIGNATION DEVANT LE TRIBUNAL \n\nPOUR : [CLIENT] \nCONTRE : [PARTIE_ADVERSE] \n\nPLAISE AU TRIBUNAL, \n\nAttendu que..." }
        ],
        FORMALITES: [
            { id: 'IMMATRICULATION', label: 'Dossier Immatriculation', template: "LISTE DES PIÈCES - IMMATRICULATION \n\n1. Formulaire M0 signé \n2. Statuts originaux \n3. Attestation de dépôt des fonds..." }
        ]
    };

    const clients = ["M. Martin", "Société Dupuis", "Mme. Lefebvre", "Dupont Tech"];

    // HANDLERS
    const handleCategorySelect = (catId) => {
        setSelections({ ...selections, category: catId });
        setStep(2);
    };

    const handleTypeSelect = (type) => {
        setSelections({ ...selections, type: type });
        setStep(3);
    };

    const handleGenerate = () => {
        setStep(4);
    };

    const getPreviewContent = () => {
        if (!selections.type) return "";
        let text = selections.type.template || "Génération en cours...";
        text = text.replace(/\[CLIENT\]/g, selections.client || "LE CLIENT");
        return text;
    };

    const steps = [
        { num: 1, label: "Catégorie" },
        { num: 2, label: "Type d'Acte" },
        { num: 3, label: "Configuration" },
        { num: 4, label: "Prévisualisation" }
    ];

    return (
        <div className="z-animate-fadein">
            {/* HEADER & STEPS */}
            <div className="panel-head" style={{ marginBottom: '2rem' }}>
                <div className="panel-title">Atelier Juridique</div>
                <div style={{ display: 'flex', gap: '1rem', marginLeft: 'auto' }}>
                    {steps.map(s => (
                        <div key={s.num} style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            opacity: step === s.num ? 1 : 0.4,
                            fontWeight: step === s.num ? 'bold' : 'normal'
                        }}>
                            <div style={{
                                width: '24px', height: '24px', borderRadius: '50%', background: step >= s.num ? 'var(--gold-antique)' : '#ccc', color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem'
                            }}>{s.num}</div>
                            <span>{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="crystal-panel" style={{ minHeight: '600px', display: 'flex', flexDirection: 'column' }}>

                {/* STEP 1: CATEGORY */}
                {step === 1 && (
                    <div className="z-animate-fadein">
                        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Que souhaitez-vous produire ?</h2>
                        <div className="quick-actions-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                            {categories.map(cat => (
                                <button key={cat.id} className="quick-action-card" style={{ height: '150px', alignItems: 'center', justifyContent: 'center' }} onClick={() => handleCategorySelect(cat.id)}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{cat.icon === 'stamp' ? '✒️' : cat.icon}</div>
                                    <div className="qa-label" style={{ fontSize: '1.2rem' }}>{cat.label}</div>
                                    <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>{cat.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 2: SUB-TYPE */}
                {step === 2 && (
                    <div className="z-animate-fadein">
                        <button className="z-btn z-btn-ghost" onClick={() => setStep(1)} style={{ marginBottom: '1rem' }}>← Retour</button>
                        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Précisez votre besoin</h2>
                        <div className="z-list" style={{ display: 'grid', gap: '1rem' }}>
                            {subTypes[selections.category]?.map(type => (
                                <div key={type.id} className="z-list-item" onClick={() => handleTypeSelect(type)} style={{ cursor: 'pointer', padding: '1.5rem' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{type.label}</div>
                                    <div style={{ color: 'var(--gold-antique)' }}>Sélectionner →</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 3: CONFIG */}
                {step === 3 && (
                    <div className="z-animate-fadein" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                        <button className="z-btn z-btn-ghost" onClick={() => setStep(2)} style={{ marginBottom: '1rem' }}>← Retour</button>
                        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Configuration du dossier</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Client Concerné</label>
                                <select className="z-input" value={selections.client} onChange={e => setSelections({ ...selections, client: e.target.value })}>
                                    <option value="">Choisir un client...</option>
                                    {clients.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Éléments de contexte</label>
                                <textarea
                                    className="z-input"
                                    rows={5}
                                    placeholder="Décrivez les spécificités (ex: Clause de non-concurrence, salaires, dates...)"
                                    value={selections.details}
                                    onChange={e => setSelections({ ...selections, details: e.target.value })}
                                />
                            </div>

                            <button className="z-btn" style={{ marginTop: '1rem' }} onClick={handleGenerate}>
                                Lancer la production (IA)
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 4: PREVIEW */}
                {step === 4 && (
                    <div className="z-animate-fadein" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <button className="z-btn z-btn-ghost" onClick={() => setStep(3)}>← Modifier</button>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="z-btn z-btn-ghost">Envoyer au Client</button>
                                <button className="z-btn">Télécharger PDF</button>
                            </div>
                        </div>

                        <div className="doc-preview" style={{
                            flex: 1,
                            background: 'white',
                            padding: '3rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #e5e7eb',
                            fontFamily: 'Georgia, serif',
                            lineHeight: '1.6',
                            whiteSpace: 'pre-wrap'
                        }}>
                            <h1 style={{ textAlign: 'center', marginBottom: '2rem', textTransform: 'uppercase', fontSize: '1.5rem', borderBottom: '1px solid black', paddingBottom: '1rem' }}>
                                {selections.type?.label}
                            </h1>
                            {getPreviewContent()}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Documents;
