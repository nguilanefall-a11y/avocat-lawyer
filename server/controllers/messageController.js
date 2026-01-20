const messagesData = require('../data/messages');

// Get all messages
const getMessages = (req, res) => {
    res.json(messagesData);
};

// Send quick reply (simulation)
const sendReply = (req, res) => {
    const { id, replyType } = req.body;
    const msg = messagesData.find(m => m.id === parseInt(id));

    if (!msg) {
        return res.status(404).json({ message: "Message non trouvé" });
    }

    // Simulate reply logic
    let replyText = "";
    if (replyType === "ACK") replyText = "Bien reçu, je traite votre demande.";
    if (replyType === "MEETING") replyText = "Prenons rendez-vous pour en discuter.";
    if (replyType === "DOCS") replyText = "Merci de déposer les pièces sur votre espace.";

    res.json({
        success: true,
        message: `Réponse envoyée à ${msg.client} : "${replyText}"`,
        replyText
    });
};

module.exports = {
    getMessages,
    sendReply
};
