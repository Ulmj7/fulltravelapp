const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const {
    createProgram,
    getAllPrograms,
    getOrganizationPrograms,
    updateProgram,
    deleteProgram,
} = require('../controllers/programController');

// Public route - Get all active programs
router.get('/all', getAllPrograms);

// Protected routes - require authentication
router.post('/create', authenticateToken, createProgram);
router.get('/my-programs', authenticateToken, getOrganizationPrograms);
router.put('/:programId', authenticateToken, updateProgram);
router.delete('/:programId', authenticateToken, deleteProgram);

module.exports = router;
