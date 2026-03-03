'use strict';
const { Router } = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.put("/profile", authMiddleware, userController.updateProfile);
router.patch("/users/:id/role", authMiddleware, userController.updateProfile); 

module.exports = router;