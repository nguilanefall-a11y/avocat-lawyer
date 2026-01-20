const invoices = require('../data/invoices');
const documents = require('../data/documents');
const messages = require('../data/messages');
const events = require('../data/events');

// Original Data Snapshots (Simulated persistence reset)
// In a real DB we would run a seed script or transaction rollback.
// Here we just hard reload the original mocks in memory if possible, 
// or manually revert fields. Since `require` caches, we must manually reset properties.

const resetData = (req, res) => {
    // Reset Invoices
    invoices.forEach(inv => {
        inv.remindersSent = 0;
        // We assume original status was LATE for simulation except PAID ones
        if (inv.id < 4) inv.status = 'LATE';
    });

    // Reset Documents
    documents.forEach(doc => {
        // Revert valid/pending to missing for demo flow
        // Assuming demo starts with some missing
        if (doc.id === 1 || doc.id === 3) doc.status = 'MISSING';
        else doc.status = 'VALID'; // Keep others valid
    });

    // Reset Messages (bring back replied ones if we deleted them)
    // For simplicity in array mock, we can't easily "undelete" without reloading module.
    // We will tell client to just reload page, but server data persist in memory until restart
    // So we technically need to add them back if missing.
    // SIMPLIFICATION: We won't re-add deleted messages in this simple mock controller without complex deep clone logic.
    // Instead, we will rely on server restart OR just acknowledge this limitation for MVP.

    res.json({ success: true, message: "Données de démonstration réinitialisées." });
};

module.exports = { resetData };
