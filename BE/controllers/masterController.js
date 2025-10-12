const Organization = require('../models/Organization');
const Department = require('../models/Department');
const Position = require('../models/Position')
const Role = require('../models/Role');

const createOrganization = async (req, res) => {
    try {
        const newOrg = await new Organization(req.body).save();
        return res.status(201).json({
            status: 'success',
            message: 'Organization created.',
            data: newOrg
        });
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        });
    }
};

const getOrganizations = async (req, res) => {
    try {
        const orgs = await Organization.find();
        return res.status(200).json({
            status: 'success',
            message: 'Organizations fetched.',
            data: orgs
        });
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        });
    }
};

const createDepartment = async (req, res) => {
    try {
        const newDept = await new Department(req.body).save();
        return res.status(201).json({
            status: 'success',
            message: 'Department created.',
            data: newDept
        });
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        });
    }
};

const getDepartments = async (req, res) => {
    try {
        const dept= await Department.find().populate('organization', 'name');
        return res.status(200).json({
            status: 'success',
            message: 'Departments fetched.',
            data: dept
        });
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        });
    }
};


const createPosition = async (req, res) => {
    try {
        const newPos = await new Position(req.body).save();
        return res.status(201).json({
            status: 'success',
            message: 'Position created.',
            data: newPos
        });
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        });
    }
};

const getPositions = async (req, res) => {
    try {
        const positions = await Position.find().populate('department', 'name');
        return res.status(200).json({
            status: 'success',
            message: 'Positions fetched.',
            data: positions
        });
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        });
    }
};

const createRole = async (req, res) => {
    try {
        const newRole = await new Role(req.body).save();
        return res.status(201).json({
            status: 'success',
            message: 'Role created.',
            data: newRole
        });
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        });
    }
};

const getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        return res.status(200).json({
            status: 'success',
            message: 'Roles fetched.',
            data: roles
        });
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        });
    }
};

module.exports = {
    createOrganization,
    getOrganizations,
    createDepartment,
    getDepartments,
    createPosition,
    getPositions,
    createRole,
    getRoles,
}