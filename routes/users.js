const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/resetPassword', auth , userController.resetPassword);


router.get('/all', userController.getAllUsers);
router.get('/userbyid/:id', userController.getUserById);

module.exports = router;