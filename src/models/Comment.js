// Comment model for recipe discussions
import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: [true, 'Comment text is required'],
			trim: true,
			maxlength: [1000, 'Comment cannot be more than 1000 characters'],
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'User is required'],
		},
		recipe: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Recipe',
			required: [true, 'Recipe is required'],
		},
		parentComment: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment',
			default: null,
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Virtual field for child comments (replies)
CommentSchema.virtual('replies', {
	ref: 'Comment',
	localField: '_id',
	foreignField: 'parentComment',
	justOne: false,
});

// Check if model exists before creating to prevent overwrite during hot reloading
const Comment = (mongoose.models && mongoose.models.Comment) || mongoose.model('Comment', CommentSchema);

export default Comment;
