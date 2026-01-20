const { GoogleGenerativeAI } = require("@google/generative-ai");
const db = require('../db');
const gmailController = require('./gmailController');
const documentController = require('./documentController');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chat = async (req, res) => {
    try {
        const { message, context_text } = req.body;

        // 1. Save User Message
        const displayedMessage = context_text ? `${message}\n\n[CONTEXTE DOCUMENT JOINT]` : message;
        await db.query('INSERT INTO messages (role, content) VALUES ($1, $2)', ['user', displayedMessage]);

        // 2. Load History
        const historyData = await db.query('SELECT role, content FROM messages ORDER BY id ASC');
        const dbMessages = historyData.rows;

        // 3. Load Recent Generated Documents (Source of Truth)
        const docsRes = await db.query('SELECT id, title, source_data FROM documents ORDER BY created_at DESC LIMIT 5');
        const recentDocs = docsRes.rows.map(d => ({ id: d.id, title: d.title, data: d.source_data }));

        // 4. Prepare Context
        let emailContext = "Service Gmail indisponible.";
        try {
            const unreadEmails = await gmailController.fetchUnreadEmails();
            emailContext = unreadEmails.length > 0 ? JSON.stringify(unreadEmails, null, 2) : "Aucun email non lu.";
        } catch (e) {
            console.error("Gmail Fetch Error (non-blocking):", e.message);
        }

        const context = `
CONTEXTE JURIDIQUE:
Date: ${new Date().toLocaleDateString('fr-FR')}
DERNIERS DOCUMENTS GÉNÉRÉS PAR ATLAS (MODIFIABLES):
${JSON.stringify(recentDocs, null, 2)}
EMAILS RECENTS (Lectures Seule): ${emailContext.substring(0, 2000)}

INSTRUCTIONS (ATLAS):
Vous êtes "Atlas", l'Assistant Juridique Intelligent du Cabinet.
VOTRE RÔLE :
1. DISCUTER : Vous êtes un expert juridique. Répondez aux questions, donnez des conseils, ou discutez simplement. Soyez professionnel mais chaleureux.
2. AGIR : Si on vous demande une action spécifique (Facture, Modif), utilisez les commandes JSON.

COMMANDES :
1. GÉNÉRATION : :::JSON_COMMAND { action: "GENERATE_PDF", ... } :::
2. MODIFICATION (INTERNE) : Pour modifier un document existant, réutilisez son JSON, modifiez-le, et relancez GENERATE_PDF.
3. MODIFICATION (EXTERNE) : Si via upload, utilisez la méthode de réécriture.

Si l'utilisateur dit juste "Bonjour", répondez poliment sans JSON.
`;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const pastMessages = dbMessages.slice(0, -1);
        const geminiHistory = pastMessages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: "System Context: " + context }] },
                { role: "model", parts: [{ text: "Bien reçu." }] },
                ...geminiHistory
            ]
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        let text = response.text();

        // 5. EXECUTE COMMAND
        const commandRegex = /:::JSON_COMMAND([\s\S]*?):::/;
        const match = text.match(commandRegex);

        if (match) {
            try {
                const commandJson = JSON.parse(match[1].trim());
                if (commandJson.action === 'GENERATE_PDF') {
                    const pdfResult = await documentController.internalGenerate(commandJson.type, commandJson.data);
                    if (pdfResult.success) {
                        text = text.replace(match[0], `\n\n✅ **DOCUMENT CRÉÉ/MIS À JOUR :** [Télécharger](${pdfResult.url})\n`);
                    }
                }
            } catch (e) {
                console.error("Command Error", e);
                text += "\n(Erreur génération)";
            }
        }

        // 6. Save AI Response
        await db.query('INSERT INTO messages (role, content) VALUES ($1, $2)', ['assistant', text]);

        res.json({ text });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ text: "Erreur traitement." });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const result = await db.query('SELECT id, role, content, created_at FROM messages ORDER BY id ASC');
        const messages = result.rows.map(r => ({
            id: r.id,
            sender: r.role === 'user' ? 'user' : 'ai',
            text: r.content,
            timestamp: r.created_at
        }));
        res.json(messages);
    } catch (e) {
        console.error("History Error", e);
        res.json([]);
    }
};
