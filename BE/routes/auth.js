const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { restrictTo } = require('../middleware/role'); // เพิ่มบรรทัดนี้

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', protect, authController.getProfile);

router.post('/logout', protect, authController.logout);

router.put('/changeUser/:username', protect, authController.changeUser);
router.post('/changePassword', authController.changePassword);
router.post('/changeAllPassword', authController.changeAllPassword);

module.exports = router;