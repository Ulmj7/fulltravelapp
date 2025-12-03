const Program = require('../models/Program');
const Organization = require('../models/Organization');

// Create a new program (Organization only)
const createProgram = async (req, res) => {
    try {
        const {
            title,
            subtitle,
            description,
            fullDescription,
            highlights,
            activities,
            duration,
            price,
            image,
            difficulty,
            bestTime,
        } = req.body;

        // Verify user is organization
        if (req.user.role !== 'organization') {
            return res.status(403).json({
                success: false,
                message: 'Only organizations can create programs',
            });
        }

        // Get organization details
        console.log('DEBUG: req.user =', req.user);
        console.log('DEBUG: Searching for organization with userId:', req.user.userId);
        const organization = await Organization.findOne({ userId: req.user.userId });
        console.log('DEBUG: Organization found =', organization);
        if (!organization) {
            return res.status(404).json({
                success: false,
                message: 'Organization profile not found. Please complete your profile first.',
            });
        }

        // Create program
        const program = new Program({
            organizationId: req.user.userId,
            organizationName: organization.name,
            title,
            subtitle,
            description,
            fullDescription,
            highlights: highlights || [],
            activities: activities || [],
            duration,
            price,
            image,
            difficulty: difficulty || 'moderate',
            bestTime,
            status: 'active',
        });

        await program.save();

        // Update organization's total programs count
        organization.totalPrograms += 1;
        await organization.save();

        res.status(201).json({
            success: true,
            message: 'Program created successfully',
            program: {
                id: program._id,
                title: program.title,
                price: program.price,
                status: program.status,
            },
        });
    } catch (error) {
        console.error('Create program error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create program',
            error: error.message,
        });
    }
};

// Get all programs (public)
const getAllPrograms = async (req, res) => {
    try {
        const programs = await Program.find({ status: 'active' })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            programs: programs.map(program => ({
                id: program._id,
                title: program.title,
                subtitle: program.subtitle,
                description: program.description,
                fullDescription: program.fullDescription,
                highlights: program.highlights,
                activities: program.activities,
                duration: program.duration,
                price: program.price,
                image: program.image,
                difficulty: program.difficulty,
                bestTime: program.bestTime,
                agency: program.organizationName,
                agencyId: program.organizationId,
                createdAt: program.createdAt,
            })),
        });
    } catch (error) {
        console.error('Get programs error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch programs',
            error: error.message,
        });
    }
};

// Get programs for specific organization
const getOrganizationPrograms = async (req, res) => {
    try {
        const programs = await Program.find({ organizationId: req.user.userId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            programs: programs.map(program => ({
                id: program._id,
                title: program.title,
                subtitle: program.subtitle,
                description: program.description,
                fullDescription: program.fullDescription,
                highlights: program.highlights,
                activities: program.activities,
                duration: program.duration,
                price: program.price,
                image: program.image,
                difficulty: program.difficulty,
                bestTime: program.bestTime,
                status: program.status,
                createdAt: program.createdAt,
            })),
        });
    } catch (error) {
        console.error('Get organization programs error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch programs',
            error: error.message,
        });
    }
};

// Update program (Organization only, own programs)
const updateProgram = async (req, res) => {
    try {
        const { programId } = req.params;
        const program = await Program.findOne({
            _id: programId,
            organizationId: req.user.userId,
        });

        if (!program) {
            return res.status(404).json({
                success: false,
                message: 'Program not found or unauthorized',
            });
        }

        // Update fields
        const allowedUpdates = [
            'title', 'subtitle', 'description', 'fullDescription',
            'highlights', 'activities', 'duration', 'price',
            'image', 'difficulty', 'bestTime', 'status'
        ];

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                program[field] = req.body[field];
            }
        });

        await program.save();

        res.status(200).json({
            success: true,
            message: 'Program updated successfully',
            program: {
                id: program._id,
                title: program.title,
                status: program.status,
            },
        });
    } catch (error) {
        console.error('Update program error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update program',
            error: error.message,
        });
    }
};

// Delete program (Organization only, own programs)
const deleteProgram = async (req, res) => {
    try {
        const { programId } = req.params;
        const program = await Program.findOne({
            _id: programId,
            organizationId: req.user.userId,
        });

        if (!program) {
            return res.status(404).json({
                success: false,
                message: 'Program not found or unauthorized',
            });
        }

        await Program.deleteOne({ _id: programId });

        // Update organization's total programs count
        const organization = await Organization.findOne({ userId: req.user.userId });
        if (organization && organization.totalPrograms > 0) {
            organization.totalPrograms -= 1;
            await organization.save();
        }

        res.status(200).json({
            success: true,
            message: 'Program deleted successfully',
        });
    } catch (error) {
        console.error('Delete program error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete program',
            error: error.message,
        });
    }
};

module.exports = {
    createProgram,
    getAllPrograms,
    getOrganizationPrograms,
    updateProgram,
    deleteProgram,
};
