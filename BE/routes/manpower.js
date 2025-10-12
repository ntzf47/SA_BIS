// routes/manpower.js
const express = require('express');
const router = express.Router();
const manpowerController = require('../controllers/MController')
const {
    protect
} = require('../middleware/auth');
const {
    restrictTo
} = require('../middleware/role');

const approvalRoles = ['Manager', 'HR-Manager','Admin'];


router.post('/plans', protect, restrictTo(['Admin', 'HR']), manpowerController.createPlan);
router.get('/plans/deficit', protect, manpowerController.getDeficitPlans); 

router.route('/requests')
    .post(protect, manpowerController.createRequest)
    .get(protect, manpowerController.getAllRequests);

router.get('/requests/:requestNo', protect, manpowerController.getRequestById);

router.post('/requests/:requestNo/approve', protect, restrictTo(approvalRoles), manpowerController.approveRequest);
router.post('/requests/:requestNo/reject', protect, restrictTo(approvalRoles), manpowerController.rejectRequest);

module.exports = router;
