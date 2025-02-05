const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');



// Route pour créer un message (accessible à tous les utilisateurs)
router.post('/createmessage', auth, messageController.createMessage);

// Route pour récupérer tous les messages (réservée aux admins)
router.get('/getmessage', auth,authorize(['admin']), messageController.getAllMessages);

router.get('/getmessagebyUserId', auth, messageController.getMessageByUserId);

module.exports = router;
