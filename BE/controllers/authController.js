const UserAccount = require('../models/UserAccount');
const Employee = require('../models/Employee');
const roleId = '68d92d3d5a93fc4e7204db27'
const Role = require('../models/Role');
const jwt = require('jsonwebtoken');
const pattern = /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]+$/;
const tab = /\s/
const ezpass = require('../utils/ezpass')
const blaclist = new Set();
const timeout = 3600000
const {
    hashpass,
    comparepass
} = require('../utils/hashandcompare')

const register = async (req, res) => {
    try {
        const {
            username,
            password,
            employeeId
        } = req.body;

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({
                message: 'Employee not found.'
            });
        }
        const existingUser = await UserAccount.findOne({ username });
        if (existingUser) {
            return res.status(409).json({
                message: 'Username already taken.'
            });
        }
        const existingLink = await UserAccount.findOne({ employee: employeeId });
        if (existingLink) {
            return res.status(409).json({
                message: 'This employee already has a registered account.'
            });
        }
        if (username.length < 6) {
            return res.status(400).json({
                message: 'Username must more than 6 character'
            })
        }
        if (password.length < 6 && password.length > 32) {
            return res.status(400).json({
                message: 'newpassword must more than 6 character and less than 32 character!'
            })
        }
        if (!pattern.test(username)) {
            return res.status(400).json({
                message: 'Username must have letter and number!'
            })
        }
        if (tab.test(username)) {
            return res.status(400).json({
                message: 'Username must not have any Spaces!'
            })
        }
        if (username === password) {
            return res.status(400).json({
                message: 'Password and User name must not equal!'
            })
        }
        if (tab.test(password)) {
            return res.status(400).json({
                message: 'Password must not have any spaces!'
            })
        }
        if (!pattern.test(password)) {
            return res.status(400).json({
                message: 'Password must have Charracter and number!'
            })
        }
        if (ezpass.includes(password)) {
            return res.status(400).json({
                message: 'Password so weak!'
            })
        }
        roleName = 'Employee'
        const role = await Role.findOne({
            name: roleName
        });
        if (!role) return res.status(400).json({
            status: 'fail',
            message: 'Invalid role specified.'
        });
        const hashedPassword = await hashpass(password)
        const newUser = await new UserAccount({
            username,
            password: hashedPassword,
            role: role._id, 
            employee: employeeId
        }).save();
        return res.status(201).json({
            status: 'success',
            message: 'User registered successfully.',
            data: {
                username: newUser.username,
                role: newUser.role
            }
        });
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        });
    }
};

const login = async (req, res) => {
    try {
        const {
            username,
            password
        } = req.body;
        const user = await UserAccount.findOne({
            username
        }).populate('role', 'name').populate({
            path: 'employee',
            populate: [
                { path: 'department', select: 'name' },
                { path: 'position', select: 'title' }
            ]
        });

        if (!user) {
            return res.status(401).json({
                status: 'fail',
                message: 'User not found'
            });
        }
        const check = await comparepass(password, user.password)
        if (!check) {
            return res.status(422).json({
                status: 'fail',
                message: 'Password Incorrect'
            })
        }
        const payload = {
            id: user.id,
            username: user.username
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })
        return res.status(200).json({
            status: 'success',
            message: 'Login successful.',
            token: token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role.name,
                fullName: user.employee?.fullName,
                department: user.employee?.department?.name,
                position: user.employee?.position?.title
            }
        });
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await UserAccount.findById(req.user.id)
            .select('-password')
            .populate('role', 'name')
            .populate({ 
                path: 'employee',
                populate: [
                    { path: 'department', select: 'name organization' }, 
                    { path: 'position', select: 'title' }
                ]
            });

        if (!user) return res.status(404).json({
            status: 'fail',
            message: 'User not found.'
        });

        return res.status(200).json({
            status: 'success',
            message: 'Profile fetched successfully.',
            data: user
        });
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        });
    }
};
const logout = async (req, res) => {
    try {
        const auth = req.headers.authorization
        const token = auth.split(' ')[1]
        if (blaclist.has(token)) {
            return res.status(401).json({
                status: 'error',
                message: 'token has been log out!'
            })
        }
        blaclist.add(token)
        setTimeout(() => blaclist.delete(token), timeout)
        return res.status(201).json({
            status: 'Success!',
            message: 'Log out success!'
        })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}
const changeUser = async (req, res) => {
    try {
        const {
            username
        } = req.params
        const {
            newusername
        } = req.body
        console.log(req.params)
        const update = await UserAccount.findOneAndUpdate({
            username: username
        }, {
            $set: {
                username: newusername
            }
        }, {
            new: true,
            runValidators: true
        })
        if (!update) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'user not found'
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'update success'

        })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const {
            username,
            password,
            newpassword
        } = req.body
        if (newpassword.length < 6 && newpassword.length > 32) {
            return res.status(400).json({
                message: 'newpassword must more than 6 character and less than 32 character!'
            })
        }
        if (username === newpassword) {
            return res.status(400).json({
                message: 'Password and User name must not equal!'
            })
        }
        if (tab.test(newpassword)) {
            return res.status(400).json({
                message: 'Password must not have any spaces!'
            })
        }
        if (!pattern.test(newpassword)) {
            return res.status(400).json({
                message: 'Password must have Charracter and number!'
            })
        }
        if (ezpass.includes(newpassword)) {
            return res.status(400).json({
                message: 'Password so weak!'
            })
        }
        const hashnewpassword = await hashpass(newpassword)
        let getoldpass = await UserAccount.findOne({
            username: username
        })
        if (getoldpass) {
            let compare = await comparepass(password, getoldpass.password)
            if (compare) {
                let update = await UserAccount.findOneAndUpdate({
                    username: username
                }, {
                    $set: {
                        password: hashnewpassword

                    }
                }, {
                    new: true,
                    runValidators: true
                })
                return res.status(200).json({
                    status: 'success',
                    message: 'update success'
                })
            } else {
                return res.status(400).json({
                    message: 'Oldpassword wrong'
                })
            }
        } else {
            return res.status(400).json({
                message: 'Username wrong'
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const changeAllPassword = async (req, res) => {
    try {
        const { username, oldPassword, newpassword } = req.body;
        if (newpassword.length < 6 || newpassword.length > 32) {
            return res.status(400).json({
                message: 'newpassword must more than 6 character and less than 32 character!'
            });
        }
        if (username === newpassword) {
            return res.status(400).json({
                message: 'Password and User name must not equal!'
            });
        }
        if (tab.test(newpassword)) {
            return res.status(400).json({
                message: 'Password must not have any spaces!'
            });
        }
        if (!pattern.test(newpassword)) {
            return res.status(400).json({
                message: 'Password must have Charracter and number!'
            });
        }
        if (ezpass.includes(newpassword)) {
            return res.status(400).json({
                message: 'Password so weak!'
            });
        }

        let user = await UserAccount.findOne({ username: username });
        if (user) {
            const isMatch = await comparepass(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    message: 'Incorrect old password'
                });
            }

            const hashnewpassword = await hashpass(newpassword);
            let update = await UserAccount.findOneAndUpdate(
                { username: username },
                { $set: { password: hashnewpassword } },
                { new: true, runValidators: true }
            );
            return res.status(200).json({
                status: 'success',
                message: 'update success'
            });
        } else {
            return res.status(400).json({
                message: 'Username wrong'
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    logout,
    changeUser,
    changePassword,
    changeAllPassword
};
