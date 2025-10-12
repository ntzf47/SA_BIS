// routes/hr.js
const express = require('express');
const router = express.Router();
const hrController = require('../controllers/hrController');
const employeeController = require('../controllers/employeeController');
const {
    protect
} = require('../middleware/auth');
const {
    restrictTo
} = require('../middleware/role');
const adminHR = ['Admin', 'HR'];


router.route('/employees')
    .post(protect, restrictTo(adminHR), hrController.createEmployee)
    .get(protect, restrictTo(adminHR), hrController.getAllEmployees);

router.route('/manpower-plans')
    .get(protect, restrictTo(adminHR), hrController.getAllManpowerPlans)
    .post(protect, restrictTo(adminHR), hrController.createManpowerPlan);

router.route('/manpower-plans/:id')
    .put(protect, restrictTo(adminHR), hrController.updateManpowerPlan)
    .delete(protect, restrictTo(adminHR), hrController.deleteManpowerPlan);

router.post('/turnover/record', protect, restrictTo(adminHR), hrController.recordTurnover);

router.post('/recruitment', protect, restrictTo(adminHR), hrController.createRecruitment);

router.put('/changeDataEmployee/:userchange',protect,restrictTo(adminHR),hrController.changeEmployee)

router.patch('/employees/:id', protect, restrictTo(adminHR), employeeController.updateEmployee);
router.patch('/employees/:id/change-department', protect, restrictTo(adminHR), hrController.changeEmployeeDepartment);

router.delete('/employees/:id', protect, restrictTo(adminHR), employeeController.deleteEmployee);

module.exports = router;