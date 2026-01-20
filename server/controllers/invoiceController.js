const invoicesData = require('../data/invoices');

// Get all invoices
const getInvoices = (req, res) => {
    res.json(invoicesData);
};

// Send reminder manually
const sendReminder = (req, res) => {
    const { id } = req.body;
    const invoice = invoicesData.find(inv => inv.id === parseInt(id));

    if (!invoice) {
        return res.status(404).json({ message: "Facture non trouvée" });
    }

    // Logic simulation for sending email
    invoice.remindersSent += 1;

    res.json({
        success: true,
        message: `Relance envoyée pour la facture #${id} de ${invoice.client}`,
        updatedInvoice: invoice
    });
};

module.exports = {
    getInvoices,
    sendReminder
};
