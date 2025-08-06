import mongoose from 'mongoose';

const ImageInfoSchema = new mongoose.Schema(
	{
		url: { type: String },
		width: { type: Number },
		height: { type: Number }
	},
	{ _id: false }
);

const ImagesSchema = new mongoose.Schema(
	{
		THUMBNAIL: ImageInfoSchema,
		SMALL: ImageInfoSchema,
		REGULAR: ImageInfoSchema,
		LARGE: ImageInfoSchema
	},
	{ _id: false }
);

const RecipeSchema = new mongoose.Schema(
	{
		uri: { type: String },
		label: { type: String },
		image: { type: String },
		images: ImagesSchema,
		source: { type: String },
		url: { type: String },
		dietLabels: [{ type: String }],
		calories: { type: Number },
		cuisineType: [{ type: String }],
		mealType: [{ type: String }],
		tags: [{ type: String }],
		externalId: { type: String }
	},
	{ timestamps: true }
);

export default mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);
