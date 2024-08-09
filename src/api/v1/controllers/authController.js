const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { isPasswordStrong } = require('../../../helpers/authHelper');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { companyName, email, phone, phoneCountry, password, userType, industrySector } = req.body;

        // Validate password strength
        if (!isPasswordStrong(password)) {
            return res.status(400).send({ error: 'Password must be at least 8 characters long, including uppercase, lowercase, numbers, and special characters.' });
        }

        // Check if user with the same email or companyName already exists
        const existingUser = await User.findOne({ $or: [{ email }, { companyName }] });
        if (existingUser) {
            return res.status(400).send({ error: 'User with the same email or company name already exists.' });
        }

        // Create new user
        const newUser = new User({
            companyName,
            email,
            phone,
            phoneCountry,
            password: await bcrypt.hash(password, 10),
            userType,
            industrySector,
        });

        const token = jwt.sign(
            { userId: newUser._id, userType: newUser.userType },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        const refreshToken = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );
        newUser.refreshToken = refreshToken;
        // Save user to database
        await newUser.save();

        // Generate JWT token


        res.status(201).send({
            message: 'User registered successfully',
            token,
            refreshToken
        });
    } catch (error) {
        console.error('Registration error:', error); // More detailed error logging
        res.status(500).send({ error: 'Registration failed' });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate request
        if (!email || !password) {
            return res.status(400).send({ error: 'Email and password are required.' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ error: 'Wrong password' });
        }

        // Generate JWT access token
        const accessToken = jwt.sign(
            { userId: user._id, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Generate JWT refresh token
        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' } // Longer expiration time for refresh tokens
        );

        // Save refresh token in the user document
        user.refreshToken = refreshToken;
        await user.save();

        // Send response with tokens and user details
        res.send({
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                companyName: user.companyName,
                userType: user.userType,
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send({ error: 'Login failed' });
    }
};
// Logout user
exports.logout = (req, res) => {
    // Invalidate the token or handle logout on the client side
    res.send({ message: 'User logged out successfully' });
};
exports.validateToken = (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).send({ error: 'Token is required.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: 'Invalid token.', isValid: false });
        }

        res.send({
            message: 'Token is valid',
            isValid: true,
            decoded
        });
    });
};
// Refresh JWT token
exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        // Check if the refresh token is provided
        if (!refreshToken) {
            return res.status(400).send({ error: 'Refresh token is required' });
        }

        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        if (!decoded || !decoded.userId) {
            return res.status(400).send({ error: 'Invalid refresh token' });
        }

        // Find the user by ID
        const user = await User.findById(decoded.userId);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(400).send({ error: 'Invalid refresh token' });
        }

        // Generate a new access token
        const newAccessToken = jwt.sign(
            { userId: user._id, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.send({
            message: 'Token refreshed successfully',
            accessToken: newAccessToken
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).send({ error: 'Token refresh failed' });
    }
};
exports.test = (req, res) => {
    res.send({ message: 'hello world' });
};