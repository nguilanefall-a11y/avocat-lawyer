const pdfService = require('../services/pdfService');
const db = require('../db');

exports.getDocuments = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM documents ORDER BY created_at DESC');
        const docs = result.rows.map(d => ({
            id: d.id,
            title: d.title,
            type: d.type.toUpperCase(),
            date: new Date(d.created_at).toLocaleDateString(),
            status: 'VALID',
            // Link points to RENDER endpoint
            fileUrl: `http://localhost:3000/api/documents/render/${d.id}`,
            source_data: d.source_data
        }));
        res.json(docs);
    } catch (e) {
        res.json([]);
    }
};

// Generates the 'Recipe' in DB and returns the Render Link
exports.internalGenerate = async (type, data) => {
    const title = data.title || (data.invoice ? `Facture ${data.invoice.number}` : `Document ${type}`);

    // Save to DB first
    const dbRes = await db.query(
        'INSERT INTO documents (type, title, filename, source_data) VALUES ($1, $2, $3, $4) RETURNING *',
        [type, title, 'dynamic', data]
    );
    const newDoc = dbRes.rows[0];

    // Determining Base URL (Local vs Prod) could be tricky internally, 
    // but the frontend/AI usually gets relative or absolute.
    // We'll return a relative path or standard localhost for now, AI rewrites it.
    // In Vercel, we might want the real URL.

    const url = `/api/documents/render/${newDoc.id}`;

    return {
        success: true,
        url: url,
        filename: `${type}_${newDoc.id}.pdf`,
        doc: newDoc
    };
};

exports.generate = async (req, res) => {
    const { type, data } = req.body;
    try {
        const result = await exports.internalGenerate(type, data);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// SERVERLESS RENDER: Generates on the fly
exports.render = async (req, res) => {
    const { id } = req.params;
    try {
        const dbRes = await db.query('SELECT * FROM documents WHERE id = $1', [id]);
        if (dbRes.rows.length === 0) return res.status(404).send('Document introuvable');

        const doc = dbRes.rows[0];

        // Generate PDF from stored Source Data
        const pdfBuffer = await pdfService.generatePdf(doc.type, doc.source_data);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${doc.type}_${doc.id}.pdf"`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error("Render Error", error);
        res.status(500).send("Erreur de génération");
    }
};

exports.updateStatus = (req, res) => { res.json({ success: true }); };
