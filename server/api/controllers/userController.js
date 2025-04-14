import User from '../../models/User.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import generateToken from '../../utils/generateToken.js';

// @desc   Register new user
// @route  POST /api/users/register
const registerUser = asyncHandler(async (req, res) => {
    const { Firstname,Lastname,sexe, email, password, phone_number, address } = req.body;

    // Check if user already exists by email or phone number
    const existingUser = await User.findOne({ $or: [{ email }, { phone_number }] });
    if (existingUser) {
        res.status(400).json({ message: 'User with this email or phone number already exists' });
        return; 
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
        Firstname,
        Lastname,
        sexe,
        email,
        password: hashedPassword,
        phone_number,
        address,
        role: 'client'
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            Firstname: user.Firstname,
            Lastname: user.Lastname,
            email: user.email,
            phone_number: user.phone_number,
            address: user.address,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
});

//----------------------------------------------------------------------------------------//

// @desc   Login user
// @route  POST /api/users/login
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            Firstname: user.Firstname,
            Lastname: user.Lastname,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

//---------------------------------------------------------------------------------------------------------------------//

// @desc   Get user profile
// @route  GET /api/users/profile
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');

    if (user) {
        res.json({
            _id: user.id,
            Firstname: user.Firstname,
            Lastname: user.Lastname,
            email: user.email,
            phone_number: user.phone_number,
            address: user.address,
            role: user.role
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

//---------------------------------------------------------------------------------------------------------------------//


// @desc   Update user profile
// @route  PUT /api/users/profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Check email uniqueness if changed
    if (req.body.email && req.body.email !== user.email) {
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) {
            res.status(400);
            throw new Error('Email already in use');
        }
    }

    // Check phone number uniqueness if changed
    if (req.body.phone_number && req.body.phone_number !== user.phone_number) {
        const phoneExists = await User.findOne({ phone_number: req.body.phone_number });
        if (phoneExists) {
            res.status(400);
            throw new Error('Phone number already in use');
        }
    }

    // Update fields - note the fix for name/Firstname/Lastname
    user.Firstname = req.body.Firstname || user.Firstname;
    user.Lastname = req.body.Lastname || user.Lastname;
    user.email = req.body.email || user.email;
    user.phone_number = req.body.phone_number || user.phone_number;
    user.address = req.body.address || user.address;

    // Update password if provided
    if (req.body.password) {
        user.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await user.save();
    res.json({
        _id: updatedUser.id,
        Firstname: updatedUser.Firstname,
        Lastname: updatedUser.Lastname,
        email: updatedUser.email,
        phone_number: updatedUser.phone_number,
        address: updatedUser.address,
        role: updatedUser.role,
        token: generateToken(updatedUser._id)
    });
});

//---------------------------------------------------------------------------------------------------------------------//

// @desc   Get all users (Admin Only)
// @route  GET /api/users
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
});

//---------------------------------------------------------------------------------------------------------------------//


// @desc   Delete user (Admin Only)
// @route  DELETE /api/users/:id
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});




//---------------------------------------------------------------------------------------------------------------------//


// @desc   Get user by ID (Admin Only)
// @route  GET /api/users/:id
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

//---------------------------------------------------------------------------------------------------------------------//


// @desc   Update user by ID (Admin Only)
// @route  PUT /api/users/:id
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Email uniqueness check
    if (req.body.email && req.body.email !== user.email) {
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) {
            res.status(400);
            throw new Error('Email already in use');
        }
    }

    // Phone number uniqueness check
    if (req.body.phone_number && req.body.phone_number !== user.phone_number) {
        const phoneExists = await User.findOne({ phone_number: req.body.phone_number });
        if (phoneExists) {
            res.status(400);
            throw new Error('Phone number already in use');
        }
    }

    // Update fields
    user.Firstname = req.body.Firstname || user.Firstname;
    user.Lastname = req.body.Lastname || user.Lastname;
    user.email = req.body.email || user.email;
    user.phone_number = req.body.phone_number || user.phone_number;
    user.address = req.body.address || user.address;
    user.role = req.body.role || user.role;

    const updatedUser = await user.save();
    res.json(updatedUser);
});

//---------------------------------------------------------------------------------------------------------------------//

// @desc    Promote user to admin
// @route   PUT /api/users/:id/promote
// @access  Private/Admin
const promoteToAdmin = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    
    if (user) {
        user.role = 'admin';
        const updatedUser = await user.save();
        
        res.json({
            _id: updatedUser._id,
            Firstname: updatedUser.Firstname,
            Lastname: updatedUser.Lastname,
            email: updatedUser.email,
            role: updatedUser.role
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

export {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
    promoteToAdmin
};