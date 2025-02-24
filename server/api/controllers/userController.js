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
        return; // Stop further execution
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
            name: user.name,
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
            name: user.name,
            email: user.email,
            phone_number: user.phone_number,
            address: user.address,
            role: user.role
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

//---------------------------------------------------------------------------------------------------------------------//


// @desc   Update user profile
// @route  PUT /api/users/profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        // Check email uniqueness
        if (req.body.email && req.body.email !== user.email) {
            const emailExists = await User.findOne({ email: req.body.email });
            if (emailExists) {
                res.status(400).json({ message: 'Email already in use' });
                return;
            }
        }

        // Check phone number uniqueness
        if (req.body.phone_number && req.body.phone_number !== user.phone_number) {
            const phoneExists = await User.findOne({ phone_number: req.body.phone_number });
            if (phoneExists) {
                res.status(400).json({ message: 'Phone number already in use' });
                return;
            }
        }

        // Update fields
        user.name = req.body.name || user.name;
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
            name: updatedUser.name,
            email: updatedUser.email,
            phone_number: updatedUser.phone_number,
            address: updatedUser.address,
            role: updatedUser.role,
            token: generateToken(updatedUser._id)
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
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

    if (user) {
        // Check email uniqueness
        if (req.body.email && req.body.email !== user.email) {
            const emailExists = await User.findOne({ email: req.body.email });
            if (emailExists) {
                res.status(400).json({ message: 'Email already in use' });
                return;
            }
        }

        // Check phone number uniqueness
        if (req.body.phone_number && req.body.phone_number !== user.phone_number) {
            const phoneExists = await User.findOne({ phone_number: req.body.phone_number });
            if (phoneExists) {
                res.status(400).json({ message: 'Phone number already in use' });
                return;
            }
        }

        // Update fields
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone_number = req.body.phone_number || user.phone_number;
        user.address = req.body.address || user.address;
        user.role = req.body.role || user.role;

        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

//---------------------------------------------------------------------------------------------------------------------//


export {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
};