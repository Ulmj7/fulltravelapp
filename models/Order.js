const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['program', 'hotel', 'transport'],
        required: true,
    },
    itemId: {
        type: String,
        required: true,
    },
    itemName: {
        type: String,
        required: true,
    },
    itemImage: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending',
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'qpay', 'socialpay'],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
    },
    details: {
        // For programs
        duration: String,
        // For hotels
        checkIn: Date,
        checkOut: Date,
        guests: Number,
        roomType: String,
        // For transport
        date: Date,
        passengers: Number,
        // Common
        email: String,
        phone: String,
        firstName: String,
        lastName: String,
        registrationNumber: String,
        passportId: String,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    serviceFee: {
        type: Number,
        default: 0,
    },
    discount: {
        type: Number,
        default: 0,
    },
    paymentDate: {
        type: Date,
    },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
