const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Organization = require('./models/Organization');

const createBolorTravel = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');

        // Check if bolortravel already exists
        const existingUser = await User.findOne({ email: 'bolortravel@gmail.com' });
        if (existingUser) {
            console.log('Bolor Travel already exists!');
            await mongoose.disconnect();
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash('bolortravel123', 10);

        // Create User
        const user = new User({
            email: 'bolortravel@gmail.com',
            password: hashedPassword,
            role: 'organization',
        });

        await user.save();
        console.log('Bolor Travel user created');

        // Create Organization Profile
        const organization = new Organization({
            userId: user._id,
            name: 'Bolor Travel',
            email: 'bolortravel@gmail.com',
            description: 'Leading travel agency in Mongolia specializing in cultural tours and adventure programs',
            phone: '+976 7011-1234',
            address: 'Ulaanbaatar, Mongolia',
            status: 'active',
        });

        await organization.save();
        console.log('Bolor Travel organization profile created');

        console.log('\n✅ Bolor Travel created successfully!');
        console.log('Email: bolortravel@gmail.com');
        console.log('Password: bolortravel123\n');

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        await mongoose.disconnect();
    }
};

createBolorTravel();
