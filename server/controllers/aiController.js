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
        const unreadEmails = await gmailController.fetchUnreadEmails();
        const emailContext = unreadEmails.length > 0 ? JSON.stringify(unreadEmails, null, 2) : "Aucun email.";

        const context = `
CONTEXTE JURIDIQUE:
Date: ${new Date().toLocaleDateString('fr-FR')}
DERNIERS DOCUMENTS GÉNÉRÉS PAR ATLAS (MODIFIABLES):
${JSON.stringify(recentDocs, null, 2)}

INSTRUCTIONS (ATLAS):
1. GÉNÉRATION : Si on demande une facture, utilisez :::JSON_COMMAND { action: "GENERATE_PDF", ... } :::
2. MODIFICATION (INTERNE) : Si on demande de modifier un des documents ci-dessus (ex: "Change le montant de la dernière facture à 600€"):
   - Retrouvez le document dans la liste ci-dessus par son contenu/titre.
   - Prenez ses données JSON ("data").
   - Modifiez les valeurs demandées.
   - GÉNÉREZ une nouvelle commande GENERATE_PDF avec les NOUVELLES données (et le même type).
   - Précisez dans le message: "J'ai régénéré le document..."

3. MODIFICATION (EXTERNE/UPLOAD) : Si un texte est fourni (upload), utilisez la méthode de réécriture (GENERATE_PDF type="generic").
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
