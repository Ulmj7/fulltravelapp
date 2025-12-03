const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const {
    createOrder,
    completePayment,
    getUserOrders,
    getOrderById,
    cancelOrder,
} = require('../controllers/orderController');

// All order routes require authentication
router.use(authenticateToken);

// Create new order
router.post('/create', createOrder);

// Complete payment for an order
router.post('/:orderId/complete-payment', completePayment);

// Get all orders for the authenticated user
router.get('/my-orders', getUserOrders);

// Get specific order details
router.get('/:orderId', getOrderById);

// Cancel order
router.post('/:orderId/cancel', cancelOrder);

module.exports = router;
