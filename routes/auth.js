const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.getLogin.bind(authController));
router.post('/login', authController.postLogin.bind(authController));
router.get('/register', authController.getRegister.bind(authController));
router.post('/register', authController.postRegister.bind(authController));
router.post('/logout', authController.logout.bind(authController));

module.exports = router;
