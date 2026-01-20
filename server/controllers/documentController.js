const documentsData = require('../data/documents');

// Get all document requests
const getDocuments = (req, res) => {
    res.json(documentsData);
};

// Simulate document upload/validation
const updateStatus = (req, res) => {
    const { id } = req.body;
    const doc = documentsData.find(d => d.id === parseInt(id));

    if (!doc) {
        return res.status(404).json({ message: "Document requis non trouvé" });
    }

    // Cycle status for demo: MISSING -> PENDING -> VALID
    if (doc.status === 'MISSING') doc.status = 'PENDING';
    else if (doc.status === 'PENDING') doc.status = 'VALID';

    res.json({
        success: true,
        message: `Statut mis à jour pour ${doc.docType}`,
        updatedDoc: doc
    });
};

module.exports = {
    getDocuments,
    updateStatus
};
