const express = require('express');
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');

const router = express.Router();

router.get('/stats', AppController.getStats);
router.get('/status', AppController.getStatus);
router.post('/users', UsersController.postNew);

module.exports = router;
