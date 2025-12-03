const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    logo: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        default: '',
    },
    address: {
        type: String,
        default: '',
    },
    website: {
        type: String,
        default: '',
    },
    rating: {
        type: Number,
        default: 0,
    },
    totalPrograms: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'active',
    },
}, { timestamps: true });

module.exports = mongoose.model('Organization', organizationSchema);
