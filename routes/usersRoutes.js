'use strict';
const { Router } = require('express');
const userController = require('../controllers/userController');
const router = Router();

// Rotas públicas
router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;