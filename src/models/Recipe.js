// Recipe model
import mongoose from 'mongoose';

// Schema for nutritional data with label, quantity, and unit
const NutrientSchema = new mongoose.Schema(
	{
		label: {
			type: String,
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
		},
		unit: {
			type: String,
			required: true,
		},
	},
	{ _id: false }
);

// Schema for detailed ingredients
const IngredientDetailSchema = new mongoose.Schema(
	{
		text: String,
		quantity: Number,
		measure: String,
		food: String,
		weight: Number,
		foodCategory: String,
	},
	{ _id: false }
);

// Schema for nutritional digest items
const DigestSchema = new mongoose.Schema(
	{
		label: String,
		tag: String,
		schemaOrgTag: String,
		total: Number,
		hasRDI: Boolean,
		daily: Number,
		unit: String,
		sub: {
			type: Map,
			of: NutrientSchema,
		},
	},
	{ _id: false }
);

const RecipeSchema = new mongoose.Schema(
	{
		// Core recipe details
		title: {
			type: String,
			required: [true, 'Recipe title is required'],
			trim: true,
			index: true,
		},
		description: {
			type: String,
			trim: true,
		},
		image: {
			type: String,
		},
		images: {
			type: Map,
			of: String,
		},
		prepTime: {
			type: String,
			default: 'N/A',
		},
		cookTime: {
			type: String,
			default: 'N/A',
		},
		servings: {
			type: String,
			default: 'N/A',
		},

		// Ingredients and instructions
		ingredients: {
			type: [String],
			required: [true, 'Recipe ingredients are required'],
		},
		ingredientsDetailed: {
			type: [IngredientDetailSchema],
		},
		instructions: {
			type: [String],
			default: ['Visit the source website for detailed instructions'],
		},

		// Source information
		source: String,
		sourceUrl: String,
		shareUrl: String,
		externalId: String,

		// Nutritional information
		calories: {
			type: Number,
			required: [true, 'Calorie information is required'],
			default: 0,
		},
		totalWeight: {
			type: Number,
			default: 0,
		},
		nutrients: {
			type: Map,
			of: NutrientSchema,
		},
		totalDaily: {
			type: Map,
			of: NutrientSchema,
		},
		digest: {
			type: [DigestSchema],
		},

		// Classification and tags
		dietLabels: {
			type: [String],
			index: true,
		},
		healthLabels: {
			type: [String],
			index: true,
		},
		cautions: [String],
		cuisineType: {
			type: [String],
			index: true,
		},
		mealType: {
			type: [String],
			index: true,
		},
		dishType: {
			type: [String],
			index: true,
		},
		tags: {
			type: [String],
			index: true,
		},

		// Environmental and health metrics
		glycemicIndex: Number,
		inflammatoryIndex: Number,
		totalCO2Emissions: Number,
		co2EmissionsClass: {
			type: String,
			enum: ['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'],
		},

		// User relationship
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		isEdamamRecipe: {
			type: Boolean,
			default: false,
		},
		likedBy: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		savedBy: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
	},
	{
		timestamps: true,
	}
);

// Text search indexes
RecipeSchema.index({
	title: 'text',
	description: 'text',
	ingredients: 'text',
	tags: 'text',
	cuisineType: 'text',
	dishType: 'text',
});

// Check if model exists before creating to prevent overwrite during hot reloading
const Recipe = (mongoose.models && mongoose.models.Recipe) || mongoose.model('Recipe', RecipeSchema);

export default Recipe;
