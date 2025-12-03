const validateSignup = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !email.endsWith('@gmail.com')) {
        return res.status(400).json({ message: 'Invalid email format. Email must end with @gmail.com' });
    }

    if (!password || password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    next();
};

module.exports = { validateSignup, validateLogin };
