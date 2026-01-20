const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

router.get('/', documentController.getDocuments);
router.post('/status', documentController.updateStatus);

module.exports = router;
