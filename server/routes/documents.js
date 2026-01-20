const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

router.get('/', documentController.getDocuments);
router.post('/status', documentController.updateStatus);
router.post('/generate', documentController.generate);
// router.get('/download/:filename', documentController.download); // Deprecated
router.get('/render/:id', documentController.render);

module.exports = router;
