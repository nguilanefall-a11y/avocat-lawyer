const eventsData = require('../data/events');

// Get all events sorted by date
const getEvents = (req, res) => {
    const sortedEvents = [...eventsData].sort((a, b) => new Date(a.date) - new Date(b.date));
    res.json(sortedEvents);
};

// Toggle event status (Mark as Done - simulation)
const completeEvent = (req, res) => {
    const { id } = req.body;
    // In a real app, we would update the DB. Here we just confirm.
    res.json({ success: true, message: "Evénement marqué comme traité." });
};

module.exports = {
    getEvents,
    completeEvent
};
