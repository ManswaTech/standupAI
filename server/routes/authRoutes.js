const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');
const { sendEmail, verifyEmailValid } = require('../utils/sendEmail');

// Register Route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Reject immediately if email is invalid or domain cannot receive mail
        const isValid = await verifyEmailValid(email);
        if (!isValid) {
            return res.status(400).json({
                message: 'Invalid email address. Registration not approved.',
            });
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // 3. Hash password and approve registration in MongoDB
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'employee'
        });

        await newUser.save();

        // 4. Send confirmation email to the verified address
        try {
            await sendEmail({
                to: newUser.email,
                subject: 'Welcome to SmartTeam — Registration Approved',
                html: `
                    <h2>Welcome to SmartTeam, ${newUser.name}!</h2>
                    <p>Your registration for <strong>${newUser.email}</strong> has been approved.</p>
                    <p>Your default role is <strong>${newUser.role}</strong>.</p>
                    <br />
                    <p>— SmartTeam</p>
                `,
            });
        } catch (emailErr) {
            // Roll back user creation if SMTP rejects the address
            await User.findByIdAndDelete(newUser._id);
            return res.status(400).json({
                message: 'Could not deliver confirmation email. Registration not approved.',
            });
        }

        res.status(201).json({
            message: 'Registration approved! Confirmation email sent.',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password.' });

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '7d' }
        );

        res.json({
            token,
            role: user.role,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

// GET all users (Admin only - excluding currently logged-in admin)
router.get('/users', authMiddleware, verifyRole(['admin']), async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user.id } }, '-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch users.' });
    }
});

// PUT update user role (Admin only)
router.put('/users/:id/role', authMiddleware, verifyRole(['admin']), async (req, res) => {
    try {
        const { role } = req.body;
        if (!['admin', 'manager', 'employee'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role.' });
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, select: '-password' }
        );
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update role.' });
    }
});

// GET team members activity (Manager & Admin)
router.get('/team-activity', authMiddleware, verifyRole(['admin', 'manager']), async (req, res) => {
    try {
        const teamMembers = await User.find({ role: { $ne: 'admin' } }, 'name email githubUsername jiraDomain isActive');
        res.json(teamMembers);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch team activity.' });
    }
});

// DELETE user (Admin only)
router.delete('/users/:id', authMiddleware, verifyRole(['admin']), async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete user.' });
    }
});

// PUT update own profile (Any logged-in user)
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { name, email } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { new: true, select: '-password' }
        );
        res.json({ message: 'Profile updated successfully.', user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update profile.' });
    }
});

// PUT update any user details/role by Admin (Admin only)
router.put('/users/:id', authMiddleware, verifyRole(['admin']), async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role },
            { new: true, select: '-password' }
        );
        res.json({ message: 'User updated successfully.', user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update user.' });
    }
});

// GET current logged-in user's profile
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Failed to load profile.' });
    }
});

module.exports = router;