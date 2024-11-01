const express = require('express');
const AppController = require('../controllers/AppController');

const router = express.Router();

router.get('/stats', AppController.getStats);
router.get('/status', AppController.getStatus);

module.exports = router;
