const User = require('../models/User');
const Organization = require('../models/Organization');
const Program = require('../models/Program');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs');

const createOrganization = async (req, res) => {
    try {
        const { email, password, name, description, phone, address } = req.body;

        // Validate input
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Email, password, and name are required' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create Organization User
        const user = new User({
            email,
            password: hashedPassword,
            role: 'organization',
        });

        await user.save();

        // Create Organization Profile
        const organization = new Organization({
            userId: user._id,
            name,
            email,
            description: description || '',
            phone: phone || '',
            address: address || '',
            status: 'active',
        });

        await organization.save();

        res.status(201).json({
            success: true,
            message: 'Organization account created successfully',
            organization: {
                id: user._id,
                email: user.email,
                name: organization.name,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all organizations
const getAllOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.find()
            .populate('userId', 'email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            organizations: organizations.map(org => ({
                id: org._id,
                userId: org.userId._id,
                email: org.email,
                name: org.name,
                description: org.description,
                phone: org.phone,
                address: org.address,
                totalPrograms: org.totalPrograms,
                rating: org.rating,
                status: org.status,
                createdAt: org.createdAt,
            })),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get statistics for admin dashboard
const getStatistics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'tourist' });
        const totalOrganizations = await Organization.countDocuments();
        const totalPrograms = await Program.countDocuments();
        const totalOrders = await Order.countDocuments();
        const completedOrders = await Order.countDocuments({ status: 'confirmed' });
        const pendingOrders = await Order.countDocuments({ status: 'pending' });

        // Calculate total revenue
        const revenueData = await Order.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

        // Recent orders
        const recentOrders = await Order.find()
            .populate('userId', 'email')
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({
            success: true,
            statistics: {
                totalUsers,
                totalOrganizations,
                totalPrograms,
                totalOrders,
                completedOrders,
                pendingOrders,
                totalRevenue,
            },
            recentOrders: recentOrders.map(order => ({
                id: order._id,
                userEmail: order.userId.email,
                type: order.type,
                itemName: order.itemName,
                totalAmount: order.totalAmount,
                status: order.status,
                paymentStatus: order.paymentStatus,
                createdAt: order.createdAt,
            })),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete organization
const deleteOrganization = async (req, res) => {
    try {
        const { organizationId } = req.params;

        const organization = await Organization.findById(organizationId);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        // Delete all programs by this organization
        await Program.deleteMany({ organizationId: organization.userId });

        // Delete organization profile
        await Organization.deleteOne({ _id: organizationId });

        // Delete user account
        await User.deleteOne({ _id: organization.userId });

        res.status(200).json({
            success: true,
            message: 'Organization deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createOrganization,
    getAllOrganizations,
    getStatistics,
    deleteOrganization,
};
