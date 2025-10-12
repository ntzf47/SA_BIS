const express = require('express');
const router = express.Router();
const masterController = require('../controllers/masterController')
const {
    protect
} = require('../middleware/auth');
const {
    restrictTo
} = require('../middleware/role');

const adminHR = ['Admin', 'HR'];

router.route('/organizations')
    .post(protect, restrictTo(['Admin']), masterController.createOrganization)
    .get(masterController.getOrganizations);

router.route('/departments')
    .post(protect, restrictTo(adminHR), masterController.createDepartment)
    .get(masterController.getDepartments);

router.route('/positions')
    .post(protect, restrictTo(adminHR), masterController.createPosition)
    .get(masterController.getPositions);

router.post('/roles'/*, protect, restrictTo(['Admin'])*/, masterController.createRole);

module.exports = router;