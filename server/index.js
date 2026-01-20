require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const invoiceRoutes = require('./routes/invoices');
const documentRoutes = require('./routes/documents');
const messageRoutes = require('./routes/messages');
const calendarRoutes = require('./routes/calendar');

// Middleware
app.use(cors());
app.use(express.json());

const resetController = require('./controllers/resetController');

// Routes
app.use('/api/invoices', invoiceRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/calendar', calendarRoutes);
app.post('/api/reset', resetController.resetData);

app.get('/', (req, res) => {
    res.json({ status: 'active', message: 'Lawyer App Backend is running' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
