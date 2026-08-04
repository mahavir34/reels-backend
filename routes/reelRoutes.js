const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const autoEditController = require('../controllers/autoEditController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

router.post('/auto-edit', upload.single('video'), autoEditController.autoProcessReel);

module.exports = router;
