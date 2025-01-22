const express = require('express');
const validateLogin = require('../middleware/validateLogin');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/signup',validateLogin, userController.signup);
router.post('/login',validateLogin, userController.login);
router.post('/resetPassword', auth , userController.resetPassword);


router.get('/all', userController.getAllUsers);
router.get('/userbyid/:id', userController.getUserById);
router.get('/currentUser', auth, userController.getCurrentUser);

router.patch('/activeStatus' , userController.updateActiveStatus);

module.exports = router;