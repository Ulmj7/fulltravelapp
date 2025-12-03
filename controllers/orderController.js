const Order = require('../models/Order');

// Create a new order (requires authentication)
const createOrder = async (req, res) => {
    try {
        const {
            type,
            itemId,
            itemName,
            itemImage,
            price,
            paymentMethod,
            details,
            totalAmount,
            serviceFee,
            discount,
        } = req.body;

        // Validate required fields
        if (!type || !itemId || !itemName || !price || !paymentMethod || !totalAmount) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
            });
        }

        // Validate order type
        if (!['program', 'hotel', 'transport'].includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order type',
            });
        }

        // Validate payment method
        if (!['card', 'qpay', 'socialpay'].includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment method',
            });
        }

        // Create order linked to authenticated user
        const order = new Order({
            userId: req.user.userId, // From JWT token
            type,
            itemId,
            itemName,
            itemImage,
            price,
            paymentMethod,
            details,
            totalAmount,
            serviceFee: serviceFee || 0,
            discount: discount || 0,
            status: 'pending',
            paymentStatus: 'pending',
        });

        await order.save();

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order: {
                id: order._id,
                type: order.type,
                itemName: order.itemName,
                totalAmount: order.totalAmount,
                status: order.status,
                paymentStatus: order.paymentStatus,
                createdAt: order.createdAt,
            },
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: error.message,
        });
    }
};

// Complete payment for an order (requires authentication)
const completePayment = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find order and verify it belongs to the authenticated user
        const order = await Order.findOne({
            _id: orderId,
            userId: req.user.userId,
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found or unauthorized',
            });
        }

        // Check if payment is already completed
        if (order.paymentStatus === 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Payment already completed',
            });
        }

        // Update payment status
        order.paymentStatus = 'completed';
        order.status = 'confirmed';
        order.paymentDate = new Date();

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Payment completed successfully',
            order: {
                id: order._id,
                status: order.status,
                paymentStatus: order.paymentStatus,
                paymentDate: order.paymentDate,
            },
        });
    } catch (error) {
        console.error('Complete payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to complete payment',
            error: error.message,
        });
    }
};

// Get all orders for authenticated user
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.userId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders: orders.map(order => ({
                id: order._id,
                type: order.type,
                itemId: order.itemId,
                itemName: order.itemName,
                itemImage: order.itemImage,
                price: order.price,
                totalAmount: order.totalAmount,
                status: order.status,
                paymentStatus: order.paymentStatus,
                paymentMethod: order.paymentMethod,
                details: order.details,
                createdAt: order.createdAt,
                paymentDate: order.paymentDate,
            })),
        });
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message,
        });
    }
};

// Get single order details (requires authentication and ownership)
const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findOne({
            _id: orderId,
            userId: req.user.userId,
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found or unauthorized',
            });
        }

        res.status(200).json({
            success: true,
            order: {
                id: order._id,
                type: order.type,
                itemId: order.itemId,
                itemName: order.itemName,
                itemImage: order.itemImage,
                price: order.price,
                totalAmount: order.totalAmount,
                serviceFee: order.serviceFee,
                discount: order.discount,
                status: order.status,
                paymentStatus: order.paymentStatus,
                paymentMethod: order.paymentMethod,
                details: order.details,
                createdAt: order.createdAt,
                paymentDate: order.paymentDate,
            },
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order',
            error: error.message,
        });
    }
};

// Cancel order (requires authentication and ownership)
const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findOne({
            _id: orderId,
            userId: req.user.userId,
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found or unauthorized',
            });
        }

        // Only allow cancellation of pending or confirmed orders
        if (order.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Order is already cancelled',
            });
        }

        order.status = 'cancelled';
        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            order: {
                id: order._id,
                status: order.status,
            },
        });
    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel order',
            error: error.message,
        });
    }
};

module.exports = {
    createOrder,
    completePayment,
    getUserOrders,
    getOrderById,
    cancelOrder,
};
