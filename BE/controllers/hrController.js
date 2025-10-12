// controllers/hrController.js
const Employee = require('../models/Employee');
const Turnover = require('../models/Turnover');
const Recruitment = require('../models/Recruitment');
const ManpowerPlan = require('../models/ManpowerPlan');
const Department = require('../models/Department');

const createEmployee = async (req, res) => {
    try {
        const newEmployee = await new Employee(req.body).save();
        await Department.findByIdAndUpdate(newEmployee.department, {
            $inc: {
                currentHeadcount: 1
            }
        });
        return res.status(201).json({
            status: 'success',
            message: 'Employee created.',
            data: newEmployee
        });
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        });
    }
};
const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find()
            .populate('department', 'name')
            .populate('position', 'title');
        return res.status(200).json({
            status: 'success',
            message: 'Employees fetched.',
            data: employees
        });
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        });
    }
};

const recordTurnover = async (req, res) => {
    try {
        const {
            employee: employeeId,
            eventType
        } = req.body;
        const newTurnover = await new Turnover({
            ...req.body,
            eventDate: new Date()
        }).save();
        if (eventType === 'Resign') {
            const employee = await Employee.findByIdAndUpdate(
                employeeId, {
                    resignDate: newTurnover.eventDate
                }, {
                    new: true
                }
            );
            if (!employee) {
                return res.status(404).json({
                    message: 'Employee not found!'
                })
            }
            await Department.findByIdAndUpdate(employee.department, {
                $inc: {
                    currentHeadcount: -1
                }
            });
        }
        return res.status(201).json({
            status: 'success',
            message: 'Turnover event recorded.',
            data: newTurnover
        });
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        });
    }
};

const createRecruitment = async (req, res) => {
    try {
        const newRecruitment = await new Recruitment(req.body).save();
        return res.status(201).json({
            status: 'success',
            message: 'Recruitment status recorded.',
            data: newRecruitment
        });
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        });
    }
};
const changeEmployee = async (req, res) => {
    const {
        department,
        position
    } = req.body
    const user = req.params.userchange
    try {
        const find = await Employee.findOneAndUpdate({
            username: user
        }, {
            $set: {
                department,
                position
            }
        }, {
            new: true,
            runValidators: true
        })

        if (!find) {
            return res.status(404).json({
                status: 'Error',
                message: 'Employee not found!'
            })
        }
        return res.status(200).json({
            status : 'Success!',
            message : 'Update success!'
        })

    } catch(error){
       return  res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const getAllManpowerPlans = async (req, res) => {
    try {
        const plans = await ManpowerPlan.find()
            .populate('department', 'name currentHeadcount')
            .populate('position', 'title');
        return res.status(200).json({
            status: 'success',
            message: 'Manpower plans fetched.',
            data: plans
        });
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        });
    }
};

const createManpowerPlan = async (req, res) => {
    try {
        const { department: departmentId } = req.body;
        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(404).json({ status: 'error', message: 'Department not found' });
        }

        const newPlan = await new ManpowerPlan({
            ...req.body,
            currentHeadcount: department.currentHeadcount
        }).save();

        return res.status(201).json({
            status: 'success',
            message: 'Manpower plan created.',
            data: newPlan
        });
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        });
    }
};

const updateManpowerPlan = async (req, res) => {
    try {
        const { department: departmentId } = req.body;
        let updatedData = req.body;

        if (departmentId) {
            const department = await Department.findById(departmentId);
            if (!department) {
                return res.status(404).json({ status: 'error', message: 'Department not found' });
            }
            updatedData.currentHeadcount = department.currentHeadcount;
        }

        const updatedPlan = await ManpowerPlan.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });
        if (!updatedPlan) {
            return res.status(404).json({
                status: 'error',
                message: 'Manpower plan not found'
            });
        }
        return res.status(200).json({
            status: 'success',
            message: 'Manpower plan updated.',
            data: updatedPlan
        });
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        });
    }
};

const deleteManpowerPlan = async (req, res) => {
    try {
        const deletedPlan = await ManpowerPlan.findByIdAndDelete(req.params.id);
        if (!deletedPlan) {
            return res.status(404).json({
                status: 'error',
                message: 'Manpower plan not found'
            });
        }
        return res.status(200).json({
            status: 'success',
            message: 'Manpower plan deleted.'
        });
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        });
    }
};

const changeEmployeeDepartment = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const { department: newDepartmentId } = req.body;

        if (!newDepartmentId) {
            return res.status(400).json({ status: 'error', message: 'New department ID is required.' });
        }

        const employee = await Employee.findById(employeeId).populate('department');
        if (!employee) {
            return res.status(404).json({ status: 'error', message: 'Employee not found.' });
        }

        const oldDepartmentId = employee.department?._id;

        if (oldDepartmentId && oldDepartmentId.toString() === newDepartmentId.toString()) {
            return res.status(400).json({ status: 'error', message: 'Employee is already in this department.' });
        }

        const newDepartment = await Department.findById(newDepartmentId);
        if (!newDepartment) {
            return res.status(404).json({ status: 'error', message: 'New department not found.' });
        }

        // Decrement old department headcount
        if (oldDepartmentId) {
            await Department.findByIdAndUpdate(oldDepartmentId, { $inc: { currentHeadcount: -1 } });
        }

        // Increment new department headcount
        await Department.findByIdAndUpdate(newDepartmentId, { $inc: { currentHeadcount: 1 } });

        // Update employee's department
        employee.department = newDepartmentId;
        await employee.save();

        return res.status(200).json({
            status: 'success',
            message: 'Employee department updated successfully.',
            data: employee
        });

    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        });
    }
};

module.exports = {
    createEmployee,
    getAllEmployees,
    recordTurnover,
    createRecruitment,
    changeEmployee,
    getAllManpowerPlans,
    createManpowerPlan,
    updateManpowerPlan,
    deleteManpowerPlan,
    changeEmployeeDepartment
};