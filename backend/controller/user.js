import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Register User
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Debugging log
        console.log('Register Request Body:', req.body);

        // Validation: Ensure all fields are provided
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed Password:', hashedPassword);

        // Create a new user
        const user = new User({ firstName, lastName, email, password: hashedPassword });
        await user.save();

        // JWT secret check
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ message: 'JWT_SECRET is not defined in the environment variables' });
        }

        // Generate token
        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1d' });
        console.log('Generated Token:', token);

        // Set cookie with the token
        res.cookie('auth_token', token, {
            httpOnly: true,
            maxAge: 86400000, 
            sameSite: 'Strict',
        });

        return res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

// Login User
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide both email and password' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }
        console.log('User from DB:', user);  // Log the entire user object
        console.log('Entered Password:', password);
        console.log('Stored Hashed Password:', user.password);

        // Compare entered password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password Match:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Set cookie with the token
        res.cookie('auth_token', token, {
            httpOnly: true,
            maxAge: 86400000, // 1 day
            sameSite: 'Strict',
        });

        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const validateToken = (req, res) => {
    console.log('Validating Token for User:', req.userId);

    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json({ userId: req.userId });
};

const logout = (req, res) => {
    console.log('Logging out user');
    res.cookie("auth_token", "", {
        expires: new Date(0), // Corrected to use `expires`
        httpOnly: true,
        sameSite: 'lax',
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

export { registerUser, login, validateToken, logout };
