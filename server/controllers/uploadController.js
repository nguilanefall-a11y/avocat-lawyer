const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const db = require('../db');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzePdf = async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    try {
        const data = await pdf(req.file.buffer);
        const text = data.text;

        // Ask Gemini to extract Client Info
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
        Extrais info client (Nom, Email, Tel, Adresse) de ce texte.
        Réponds UNIQUEMENT JSON: { "name": "...", "email": "...", "phone": "...", "address": "..." } ou null si pas de client clair.
        Texte: ${text.substring(0, 10000)}
        `;

        // We catch error here to strictly return success even if extraction fails (we still want the Text)
        let clientData = null;
        try {
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            clientData = JSON.parse(cleanJson);
            // Check if it's empty/null
            if (!clientData.name) clientData = null;
        } catch (e) {
            console.log("Client extraction failed, but proceeding with text.");
        }

        res.json({ success: true, text: text, client: clientData });

    } catch (error) {
        console.error("PDF Extraction Error:", error);
        res.status(500).json({ success: false, message: "Erreur d'analyse." });
    }
};

exports.createClient = async (req, res) => {
    const { name, email, phone, address } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO clients (name, email, phone, address) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, phone, address]
        );
        res.json({ success: true, client: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur création." });
    }
};
