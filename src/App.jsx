import { useState, useEffect, useRef } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import Billing from './pages/Billing'
import Documents from './pages/Documents'
import Agenda from './pages/Agenda'
import Messages from './pages/Messages'
import './index.css'

function App() {
  const [invoices, setInvoices] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [events, setEvents] = useState([]);

  // PREVIEW STATE (Editable for global actions like Reminder/Assistant)
  const [preview, setPreview] = useState({ show: false, type: '', id: null, content: '', meta: null });

  // SIDE CHAT STATE
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'ai', text: 'Bonjour Maître. Je suis votre Assistant Juridique. Je peux rédiger des actes, rechercher des jurisprudences ou analyser des pièces pour vous.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  const loadData = () => {
    fetch('http://localhost:3000/api/invoices').then(res => res.json()).then(setInvoices);
    fetch('http://localhost:3000/api/documents').then(res => res.json()).then(setDocuments);
    fetch('http://localhost:3000/api/messages').then(res => res.json()).then(setMessages);
    fetch('http://localhost:3000/api/calendar').then(res => res.json()).then(setEvents);
  };

  useEffect(() => { loadData(); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages, showChat]);

  // --- AI LOGIC ---
  const generateDraft = (type, item) => {
    // PRE-GENERATION logic
    if (type === 'REMIND') {
      return `Cher ${item.client},\n\nSauf erreur de notre part, la facture de ${item.amount}€ est toujours en attente de règlement.\nNous vous remercions de faire le nécessaire sous 48h afin d'éviter toute procédure.\n\nCordialement,\nVotre Cabinet.`;
    }
    if (type === 'REPLY') {
      if (item.content.includes('voiture')) {
        return `Bonjour ${item.client},\n\nConcernant le véhicule, l'ordonnance de non-conciliation précise bien l'attribution de la jouissance.\nJe vous invite à ne pas céder aux pressions adverses et à conserver le véhicule.\n\nBien à vous.`;
      }
      return `Bonjour ${item.client},\n\nJ'ai bien pris connaissance de votre message.\nNous traitons votre demande et revenons vers vous dans la journée.\n\nCordialement.`;
    }
    return "Contenu généré...";
  };

  const handleChatSubmit = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!chatInput.trim()) return;
      const userMsg = { id: Date.now(), sender: 'user', text: chatInput };
      setChatMessages(prev => [...prev, userMsg]);
      setChatInput('');

      // MOCK AI RESPONSE
      setTimeout(() => {
        const aiMsg = { id: Date.now() + 1, sender: 'ai', text: "Entendu Maître. Je génère le document demandé..." };
        if (userMsg.text.toLowerCase().includes('concl')) aiMsg.text = "Voici une ébauche de conclusions pour le dossier Martin:\n\nPLAISE AU TRIBUNAL,\nAttendu que...";
        setChatMessages(prev => [...prev, aiMsg]);
      }, 1000);
    }
  };

  // --- HANDLERS ---
  const handleReset = () => { if (confirm('Initier le Reset ?')) fetch('http://localhost:3000/api/reset', { method: 'POST' }).then(() => { loadData(); }); };

  const initiateRemind = (inv) => {
    setPreview({ show: true, type: 'REMIND', id: inv.id, content: generateDraft('REMIND', inv), meta: inv });
  };
  const initiateReply = (msg) => {
    setPreview({ show: true, type: 'REPLY', id: msg.id, content: generateDraft('REPLY', msg), meta: msg });
  };

  const confirmAction = () => {
    const { type, id } = preview;
    if (type === 'REMIND') {
      fetch('http://localhost:3000/api/invoices/reminders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
        .then(res => res.json()).then(d => { if (d.success) setInvoices(p => p.map(i => i.id === id ? { ...i, remindersSent: i.remindersSent + 1 } : i)) });
    }
    if (type === 'REPLY') {
      fetch('http://localhost:3000/api/messages/reply', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, replyType: 'ACK' }) })
        .then(() => setMessages(p => p.filter(m => m.id !== id)));
    }
    setPreview({ show: false, type: '', id: null, content: '', meta: null });
  };

  const handleUpload = (id) => fetch('http://localhost:3000/api/documents/status', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }).then(res => res.json()).then(d => { if (d.success) setDocuments(p => p.map(doc => doc.id === id ? d.updatedDoc : doc)) });

  // --- NAVIGATION STATE ---
  const [activeSection, setActiveSection] = useState('DASHBOARD');

  // --- ICONS HELPER ---
  const getSourceIcon = (source) => {
    switch (source) {
      case 'GMAIL': return '📧'; // Or use an SVG/Icon component
      case 'WHATSAPP': return '💬';
      case 'PHONE': return '📞';
      default: return '✉️';
    }
  };

  const getSourceLabel = (source) => {
    switch (source) {
      case 'GMAIL': return 'Email';
      case 'WHATSAPP': return 'WhatsApp';
      case 'PHONE': return 'Téléphone';
      default: return 'Message';
    }
  };

  // --- DERIVED STATE ---
  const totalLate = invoices.filter(i => i.status === 'LATE').reduce((acc, c) => acc + c.amount, 0);
  const criticalEvents = events.filter(e => e.risk === 'CRITICAL').length;
  const missingDocs = documents.filter(d => d.status !== 'VALID').length;
  const hours = new Date().getHours();
  const greeting = hours < 12 ? 'Bonne matinée,' : (hours < 18 ? 'Bon après-midi,' : 'Bonsoir,');

  // --- RENDER CONTENT ---
  const renderContent = () => {
    switch (activeSection) {
      case 'DASHBOARD': return <Dashboard invoices={invoices} documents={documents} events={events} initiateRemind={initiateRemind} handleUpload={handleUpload} onQuickAction={setActiveSection} />;
      case 'CLIENTS': return <Clients />;
      case 'BILLING': return <Billing />;
      case 'DOCUMENTS': return <Documents />;
      case 'CALENDAR': return <Agenda events={events} />;
      case 'MESSAGES': return <Messages messages={messages} getSourceIcon={getSourceIcon} getSourceLabel={getSourceLabel} initiateReply={initiateReply} />;
      default: return <div className="crystal-panel">Section construction...</div>;
    }
  };

  return (
    <div className="app-container">
      {/* PREVIEW MODAL (Editable) */}
      {preview.show && (
        <div className="preview-overlay">
          <div className="preview-bubble">
            <div className="preview-header">
              <div className="ai-avatar">IA</div>
              <div style={{ fontWeight: 600 }}>Brouillon Automatique</div>
            </div>
            <div className="preview-content">
              <textarea
                className="preview-textarea"
                value={preview.content}
                onChange={(e) => setPreview({ ...preview, content: e.target.value })}
              />
            </div>
            <div className="preview-actions">
              <button onClick={() => setPreview({ show: false, type: '', content: '' })} className="z-btn z-btn-ghost" style={{ color: 'var(--text-primary)', borderColor: 'var(--text-muted)' }}>Annuler</button>
              <button onClick={confirmAction} className="z-btn">Envoyer</button>
            </div>
          </div>
        </div>
      )}

      {/* SIDE CHAT */}
      <div className={`side-panel ${showChat ? 'open' : ''}`}>
        <div className="chat-header">
          <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div className="ai-avatar" style={{ width: '28px', height: '28px', background: 'var(--gold-antique)' }}>✦</div>
            <div>
              <div style={{ fontSize: '1rem', fontFamily: 'Playfair Display' }}>Assistant Atlas</div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>IA Juridique</div>
            </div>
          </div>
          <button onClick={() => setShowChat(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-muted)' }}>×</button>
        </div>

        <div className="chat-body">
          {chatMessages.map(msg => (
            <div key={msg.id} className={`chat-msg ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef}></div>
          {/* QUICK ACTIONS DASHBOARD */}
          {chatMessages.length < 3 && (
            <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                Outils Rapides
              </div>
              <div className="quick-actions-grid">
                <button className="quick-action-card" onClick={() => setChatInput("Rédiger une mise en demeure pour...")}>
                  <div className="qa-icon">⚖️</div>
                  <div className="qa-label">Mise en Demeure</div>
                </button>
                <button className="quick-action-card" onClick={() => setChatInput("Analyser ce contrat et détecter les clauses abusives...")}>
                  <div className="qa-icon">🔍</div>
                  <div className="qa-label">Audit Contrat</div>
                </button>
                <button className="quick-action-card" onClick={() => setChatInput("Rechercher la jurisprudence récente sur...")}>
                  <div className="qa-icon">🏛️</div>
                  <div className="qa-label">Jurisprudence</div>
                </button>
                <button className="quick-action-card" onClick={() => setChatInput("Générer une convention d'honoraires...")}>
                  <div className="qa-icon">📝</div>
                  <div className="qa-label">Honoraires</div>
                </button>
                <button className="quick-action-card" onClick={() => setChatInput("Synthétiser les pièces du dossier...")}>
                  <div className="qa-icon">⚡️</div>
                  <div className="qa-label">Synthèse Dossier</div>
                </button>
                <button className="quick-action-card" onClick={() => setChatInput("Calculer les intérêts légaux pour...")}>
                  <div className="qa-icon">🧮</div>
                  <div className="qa-label">Calcul Intérêts</div>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="chat-input-area">
          <textarea
            className="chat-input"
            placeholder="Décrivez votre requête ou sélectionnez un outil..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleChatSubmit}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.8rem', alignItems: 'center' }}>
            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
              📎 Joindre une pièce
            </button>
            <button onClick={() => handleChatSubmit({ key: 'Enter', preventDefault: () => { } })} className="z-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Envoyer ↵</button>
          </div>
        </div>
      </div>

      {/* NEW SIDEBAR COMPONENT */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        <div className="zenith-header">
          <div className="zenith-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Spacer for proper alignment if needed, or breadcrumbs */}
              <div></div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button onClick={handleReset} className="z-btn z-btn-ghost">Réinitialiser</button>
                <button className="z-btn" style={{ background: 'white', color: 'black' }}>+ Nouveau Dossier</button>
                <button onClick={() => setShowChat(!showChat)} className="z-btn" style={{ background: 'var(--onyx-light)', border: '1px solid #333' }}>
                  ✦ Assistant
                </button>
              </div>
            </div>

            <div style={{ marginTop: '3rem' }}>
              <h1 className="hero-title">{greeting} Maître.</h1>
              <p className="hero-subtitle">
                L'interface a détecté <strong>{criticalEvents} urgences</strong> et
                <strong> {missingDocs} pièces</strong> en attente.
              </p>
            </div>
          </div>
        </div>

        <div className="zenith-body">
          <div className="zenith-container">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
