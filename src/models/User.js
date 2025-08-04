// User model
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, 'Username is required'],
			unique: true,
			trim: true,
			minlength: [3, 'Username must be at least 3 characters'],
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
			match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			minlength: [8, 'Password must be at least 8 characters'],
			select: false, // Don't include password in query results by default
		},
		name: {
			type: String,
			trim: true,
		},
		profileImage: {
			type: String,
			default: '/images/default-profile.png',
		},
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user',
		},
		bio: {
			type: String,
			maxlength: [500, 'Bio cannot be more than 500 characters'],
		},
		favoriteRecipes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Recipe',
			},
		],
		savedRecipes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Recipe',
			},
		],
	},
	{
		timestamps: true,
	}
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		return next();
	}

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

// Method to check password
UserSchema.methods.comparePassword = async function (candidatePassword) {
	try {
		return await bcrypt.compare(candidatePassword, this.password);
	} catch (error) {
		throw error;
	}
};

// Check if model exists before creating to prevent overwrite during hot reloading
const User = (mongoose.models && mongoose.models.User) || mongoose.model('User', UserSchema);

export default User;
