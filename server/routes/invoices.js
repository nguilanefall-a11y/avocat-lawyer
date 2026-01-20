const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

router.get('/', invoiceController.getInvoices);
router.post('/reminders', invoiceController.sendReminder);

module.exports = router;
