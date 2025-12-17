const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    organizationName: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    fullDescription: {
        type: String,
        required: true,
    },
    highlights: [{
        type: String,
    }],
    activities: [{
        type: String,
    }],
    duration: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    priceDescription: {
        type: String,
        default: 'Үнэ нь бүлгийн хэмжээнээс хамаарна',
    },
    image: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ['easy', 'moderate', 'challenging'],
        default: 'moderate',
    },
    bestTime: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'active',
    },
}, { timestamps: true });

module.exports = mongoose.model('Program', programSchema);
