// Authentication service using Mongoose models
import User from '../models/User';
import dbConnect from '../lib/mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here';
const JWT_EXPIRES_IN = '7d';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<{user: Object, token: string}>} - User object and JWT token
 */
export async function registerUser(userData) {
	await dbConnect();

	// Check if user with email already exists
	const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
	if (existingUser) {
		throw new Error('Email already in use');
	}

	// Check if username is taken
	if (userData.username) {
		const existingUsername = await User.findOne({ username: userData.username });
		if (existingUsername) {
			throw new Error('Username already taken');
		}
	}

	// Create new user
	const user = new User({
		...userData,
		email: userData.email.toLowerCase(),
	});

	// Save to database (password hashing happens in pre-save hook)
	await user.save();

	// Generate JWT token
	const token = generateToken(user);

	// Return user and token (exclude password)
	const userObj = user.toObject();
	delete userObj.password;

	return { user: userObj, token };
}

/**
 * Login user with email/password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{user: Object, token: string}>} - User object and JWT token
 */
export async function loginUser(email, password) {
	await dbConnect();

	// Find user by email
	const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

	if (!user) {
		throw new Error('Invalid email or password');
	}

	// Check password
	const isMatch = await user.comparePassword(password);
	if (!isMatch) {
		throw new Error('Invalid email or password');
	}

	// Generate JWT token
	const token = generateToken(user);

	// Return user and token (exclude password)
	const userObj = user.toObject();
	delete userObj.password;

	return { user: userObj, token };
}

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - User object
 */
export async function getUserById(userId) {
	await dbConnect();

	const user = await User.findById(userId);
	if (!user) {
		throw new Error('User not found');
	}

	return user;
}

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} - Updated user object
 */
export async function updateUserProfile(userId, userData) {
	await dbConnect();

	// Don't allow email or role updates here
	const { email, role, password, ...updateData } = userData;

	const user = await User.findByIdAndUpdate(
		userId,
		{ $set: updateData },
		{ new: true, runValidators: true }
	);

	if (!user) {
		throw new Error('User not found');
	}

	return user;
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} - Updated user object
 */
export async function changePassword(userId, currentPassword, newPassword) {
	await dbConnect();

	// Find user with password field
	const user = await User.findById(userId).select('+password');
	if (!user) {
		throw new Error('User not found');
	}

	// Verify current password
	const isMatch = await user.comparePassword(currentPassword);
	if (!isMatch) {
		throw new Error('Current password is incorrect');
	}

	// Update password
	user.password = newPassword;
	await user.save();

	// Return user without password
	const userObj = user.toObject();
	delete userObj.password;

	return userObj;
}

/**
 * Generate JWT token for user
 * @param {Object} user - User object
 * @returns {string} - JWT token
 */
function generateToken(user) {
	return jwt.sign(
		{
			id: user._id,
			email: user.email,
			username: user.username,
			role: user.role,
		},
		JWT_SECRET,
		{
			expiresIn: JWT_EXPIRES_IN,
		}
	);
}

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object} - Decoded token payload
 */
export function verifyToken(token) {
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch (error) {
		throw new Error('Invalid or expired token');
	}
}
