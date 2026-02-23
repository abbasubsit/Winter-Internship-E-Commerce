import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        // Password strength validation
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
            return res.status(400).json({ message: 'Password must contain both letters and numbers' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'customer',
            isVerified: role === 'seller' ? false : true // Sellers need approval
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            token: generateToken(user._id, user.role),
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && await bcrypt.compare(password, user.password)) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot password - send reset email
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'No account found with that email' });
        }

        // Generate random reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash the token and save to DB
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
        await user.save();

        // Build reset URL (pointing to frontend)
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        // Email HTML content
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #1a1a1a;">Password Reset Request</h2>
                <p>Hi <strong>${user.name}</strong>,</p>
                <p>You requested a password reset. Click the button below to set a new password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="background-color: #1a1a1a; color: white; padding: 12px 30px; 
                              text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Reset Password
                    </a>
                </div>
                <p style="color: #666;">This link will expire in <strong>30 minutes</strong>.</p>
                <p style="color: #666;">If you didn't request this, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="color: #999; font-size: 12px;">E-Commerce Store</p>
            </div>
        `;

        await sendEmail({
            to: user.email,
            subject: 'Password Reset - E-Commerce Store',
            html,
        });

        res.json({ message: 'Password reset email sent! Check your inbox.' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset password using token
// @route   PUT /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
    try {
        // Hash the token from URL to match with DB
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        // Find user with valid (not expired) token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Hash new password and save
        const { password } = req.body;

        // Password strength validation
        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
            return res.status(400).json({ message: 'Password must contain both letters and numbers' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Clear reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ message: 'Password reset successful! You can now login.' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

