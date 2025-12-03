const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'The user already exists. Please login' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user (Tourist only)
        const user = new User({
            email,
            password: hashedPassword,
            role: 'tourist',
        });

        await user.save();

        // Generate token
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({ message: 'Account created successfully. Welcome!', token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            // Check if it's the hardcoded admin
            if (email === process.env.ADMIN_EMAIL) {
                // Admin check logic below
            } else {
                return res.status(400).json({ message: 'Please sign up first.' });
            }
        }

        // Admin Login Logic
        if (email === process.env.ADMIN_EMAIL) {
            if (password !== process.env.ADMIN_PASSWORD) {
                return res.status(401).json({ message: 'Unauthorized attempt.' });
            }
            const token = jwt.sign({ userId: 'admin', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
            return res.json({ message: 'Login successful', token, role: 'admin' });
        }

        // Regular User Login (Tourist | Organization)
        if (!user) {
            return res.status(400).json({ message: 'Please sign up first.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password.' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ message: 'Login successful', token, role: user.role });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { signup, login };
