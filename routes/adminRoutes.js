const express = require('express');
const router = express.Router();
const {
    createOrganization,
    getAllOrganizations,
    getStatistics,
    deleteOrganization,
} = require('../controllers/adminController');
const { authenticateToken, verifyAdmin } = require('../middleware/authMiddleware');

// All admin routes require authentication and admin verification
router.use(authenticateToken);
router.use(verifyAdmin);

router.post('/create-organization', createOrganization);
router.get('/organizations', getAllOrganizations);
router.get('/statistics', getStatistics);
router.delete('/organizations/:organizationId', deleteOrganization);

module.exports = router;
