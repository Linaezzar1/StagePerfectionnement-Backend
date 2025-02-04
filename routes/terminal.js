const express = require('express');
const { executeCommand } = require('../controllers/terminalController');

const router = express.Router();

// Route POST pour exécuter une commande
router.post('/execute', executeCommand);

module.exports = router;
