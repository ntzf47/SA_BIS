const ManpowerPlan = require('../models/ManpowerPlan');
const ManpowerRequest = require('../models/ManpowerRequest');
const Employee = require('../models/Employee')
const Approval = require('../models/Approval');
const Department = require('../models/Department');
const Position = require('../models/Position')

const createApproval = async ({
    requestId,
    approver,
    status,
    comment,
    level = 1,
    approvedHeadcount = 0 
}) => {
    await new Approval({
        request: requestId,
        approver,
        status,
        comment,
        level,
        approvalDate: new Date()
    }).save();


    if (status === 'Approved') {
 
        return await ManpowerRequest.findByIdAndUpdate(
            requestId, {
                status: 'Approved',
                approvedHeadcount
            }, {
                new: true
            }
        );
    } else if (status === 'Rejected') {

        return await ManpowerRequest.findByIdAndUpdate(
            requestId, {
                status: 'Rejected'
            }, {
                new: true
            }
        );
    }

    return await ManpowerRequest.findById(requestId);
};


const getAllRequests = async (req, res) => {
    try {
        const requests = await ManpowerRequest.find()
            .populate('organization', 'name') 
            .populate({
                path: 'department',
                select: 'name',
                populate: {
                    path: 'organization',
                    select: 'name'
                }
            })
            .populate('position', 'title')
            .populate({
                path: 'createdBy',
                select: 'username _id',
                populate: {
                    path: 'employee',
                    select: 'fullName'
                }
            }); 

        return res.status(200).json({
            status: 'success',
            message: 'Requests fetched.',
            data: requests
        });
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        });
    }
};
const getRequestById = async (req, res) => {
    try {
        const requestNo = req.params.requestNo; 
        const request = await ManpowerRequest.findOne({ requestNo })
            .populate('organization', 'name')
            .populate({
                path: 'department',
                select: 'name maxHeadcount currentHeadcount',
                populate: {
                    path: 'organization',
                    select: 'name'
                }
            })
            .populate('position', 'title description')
            .populate({
                path: 'createdBy',
                select: 'username _id',
                populate: {
                    path: 'employee',
                    select: 'fullName'
                }
            });

        if (!request) return res.status(404).json({
            status: 'fail',
            message: `Request No. ${requestNo} not found.`
        });
        
        return res.status(200).json({
            status: 'success',
            message: 'Request fetched.',
            data: request
        });
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        });
    }
};


const createRequest = async (req, res) => {

    const { department, position, requestedHeadcount, ...restBody } = req.body;


    if (!department || !position || !requestedHeadcount || requestedHeadcount < 1) {
        return res.status(400).json({
            status: 'error',
            message: 'Department, Position, and a valid Requested Headcount (>= 1) are required fields.'
        });
    }

    try {

        const foundDepartment = await Department.findById(department);
        if (!foundDepartment) {
            return res.status(404).json({
                status: 'error',
                message: `Department ID ${department} not found in the system.`
            });
        }

        const foundPosition = await Position.findById(position);
        if (!foundPosition) {
            return res.status(404).json({
                status: 'error',
                message: `Position ID ${position} not found in the system.`
            });
        }
        
        if (foundPosition.department.toString() !== department) {
             return res.status(400).json({
                status: 'error',
                message: `Position '${foundPosition.title}' does not belong to the selected Department.`
            });
        }

        const requestData = {
            ...restBody,
            department, 
            position, 
            requestedHeadcount,
            requestNo: `MR-${Date.now().toString().slice(-6)}`,
            createdBy: req.user._id, 
            status: 'WaitingApproval'
        };

        const newRequest = await new ManpowerRequest(requestData).save();
        
        return res.status(201).json({
            status: 'success',
            message: 'Manpower Request submitted for approval.',
            data: newRequest
        });

    } catch (e) {
        console.error("Error creating manpower request:", e); 
        return res.status(500).json({
            status: 'error',
            message: e.message || 'Internal Server Error.'
        });
    }
};
const createPlan = async (req, res) => {
    try {
        const newPlan = await new ManpowerPlan(req.body).save();
        return res.status(201).json({
            status: 'success',
            message: 'Manpower Plan created.',
            data: newPlan
        });
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        });
    }
};

const approveRequest = async (req, res) => {
    try {
        const approv = 'Approve Success!';
        const requestNo = req.params.requestNo; 
        

        const manpowerRequest = await ManpowerRequest.findOne({ requestNo });
        
        if (!manpowerRequest) {
            return res.status(404).json({
                status: 'fail',
                message: `Request No. ${requestNo} not found!`
            });
        }
        
        if (manpowerRequest.status !== 'WaitingApproval') {
            return res.status(400).json({
                status: 'fail',
                message: 'Cannot be approved! The request status is not WaitingApproval.'
            });
        }
        
        const approvedAmount = manpowerRequest.requestedHeadcount;
        const departmentId = manpowerRequest.department;
  
        const foundDepartment = await Department.findById(departmentId);
        if (!foundDepartment) {
             console.error(`ERROR: Department ID ${departmentId} not found.`);
             return res.status(500).json({ status: 'error', message: "Target department data is missing." });
        }
        
        const newTotalHeadcount = foundDepartment.currentHeadcount + approvedAmount;
        if (newTotalHeadcount > foundDepartment.maxHeadcount) {
             return res.status(409).json({ 
                status: 'error',
                message: `Approval failed. Department '${foundDepartment.name}' would exceed its Max Headcount. (Max: ${foundDepartment.maxHeadcount}, Current: ${foundDepartment.currentHeadcount}, Approved: ${approvedAmount})`
            });
        }
        
        const updatedRequest = await createApproval({
            requestId: manpowerRequest._id, 
            approver: req.user._id, 
            status: 'Approved',
            comment: approv,
            level: 1,
            approvedHeadcount: approvedAmount 
        });

        return res.status(200).json({
            status: 'success',
            message: 'Request approved.',
            data: updatedRequest
        });

    } catch (e) {
        console.error(e.message);
        return res.status(500).json({
            status: 'error',
            message: e.message
        });
    }
};


const rejectRequest = async (req, res) => {
    try {
        const requestNo = req.params.requestNo; 
        const manpowerRequest = await ManpowerRequest.findOne({ requestNo });
        
        if (!manpowerRequest) {
            return res.status(404).json({
                status: 'fail',
                message: `Request No. ${requestNo} not found!`
            });
        }
        
        if (manpowerRequest.status !== 'WaitingApproval') {
            return res.status(400).json({
                status: 'fail',
                message: 'Cannot be rejected! The request status is not WaitingApproval.'
            });
        }
        
        const updatedRequest = await createApproval({
            requestId: manpowerRequest._id, 
            approver: req.user._id, 
            status: 'Rejected',
            comment: req.body.comment,
            level: 99 
        });
        
        return res.status(200).json({
            status: 'success',
            message: 'Request rejected.',
            data: updatedRequest
        });
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        });
    }
};
const getDeficitPlans = async (req, res) => {
    try {
        const deficits = await ManpowerPlan.find({
            $expr: {
                $gt: ["$plannedHeadcount", "$currentHeadcount"]
            }
        }).populate('department', 'name').populate('position', 'title');

        return res.status(200).json({
            status: 'success',
            message: 'Deficit plans fetched.',
            data: deficits
        });
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        });
    }
};

module.exports = {
    createPlan,
    getDeficitPlans,
    createRequest,
    getRequestById,
    approveRequest,
    rejectRequest,
    getAllRequests
};
