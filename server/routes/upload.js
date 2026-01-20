const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/uploadController');

// Configure Multer (Memory Storage)
const upload = multer({ storage: multer.memoryStorage() });

// Routes
router.post('/analyze', upload.single('file'), uploadController.analyzePdf);
router.post('/create-client', uploadController.createClient);

module.exports = router;
