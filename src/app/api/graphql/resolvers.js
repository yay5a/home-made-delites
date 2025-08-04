import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import Recipe from '@/models/Recipe';
import { GraphQLError } from 'graphql';

// Helper function to generate JWT token
const generateToken = (userId) => {
	return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Helper function to require authentication
const requireAuth = (user) => {
	if (!user) {
		throw new GraphQLError('Authentication required', {
			extensions: { code: 'UNAUTHENTICATED' },
		});
	}
	return user;
};

export const resolvers = {
	Query: {
		me: async (_, __, { user }) => {
			requireAuth(user);
			return user;
		},

		recipes: async (_, { limit = 10, cursor = null, forward = true, category }) => {
			// Import the searchRecipes function
			const { searchRecipes } = await import('@/lib/recipeDb.server');

			// Use the criteria to filter by category if needed
			const criteria = category ? { category } : {};

			// Call our cursor-based pagination function
			const result = await searchRecipes(criteria, limit, cursor, forward);

			// Populate author information for each recipe
			if (result.recipes && result.recipes.length > 0) {
				const User = (await import('@/models/User')).default;

				// Get all author IDs
				const authorIds = result.recipes.map((recipe) => recipe.createdBy).filter(Boolean);

				// Fetch all authors in one query
				const authors = await User.find({ _id: { $in: authorIds } });
				const authorsMap = new Map(authors.map((author) => [author._id.toString(), author]));

				// Map authors to recipes
				result.recipes = result.recipes.map((recipe) => {
					if (recipe.createdBy) {
						const authorId = recipe.createdBy.toString();
						const author = authorsMap.get(authorId);
						if (author) {
							return { ...recipe, author };
						}
					}
					return recipe;
				});
			}

			return {
				recipes: result.recipes,
				pageInfo: {
					hasMore: result.pagination.hasMore,
					nextCursor: result.pagination.nextCursor,
					prevCursor: result.pagination.prevCursor,
					totalResults: result.pagination.totalResults,
				},
			};
		},

		recipe: async (_, { id }) => {
			const recipe = await Recipe.findById(id).populate('author');
			if (!recipe) {
				throw new GraphQLError('Recipe not found', {
					extensions: { code: 'NOT_FOUND' },
				});
			}
			return recipe;
		},

		searchRecipes: async (_, { query, limit = 10, cursor = null, forward = true }) => {
			// Import the searchRecipes function
			const { searchRecipes } = await import('@/lib/recipeDb.server');

			// Use $text search for efficient full-text queries
			const criteria = { query, useTextSearch: true };

			// Call our cursor-based pagination function
			const result = await searchRecipes(criteria, limit, cursor, forward);

			// Populate author information for each recipe
			if (result.recipes && result.recipes.length > 0) {
				const User = (await import('@/models/User')).default;

				// Get all author IDs
				const authorIds = result.recipes.map((recipe) => recipe.createdBy).filter(Boolean);

				// Fetch all authors in one query
				const authors = await User.find({ _id: { $in: authorIds } });
				const authorsMap = new Map(authors.map((author) => [author._id.toString(), author]));

				// Map authors to recipes
				result.recipes = result.recipes.map((recipe) => {
					if (recipe.createdBy) {
						const authorId = recipe.createdBy.toString();
						const author = authorsMap.get(authorId);
						if (author) {
							return { ...recipe, author };
						}
					}
					return recipe;
				});
			}

			return {
				recipes: result.recipes,
				pageInfo: {
					hasMore: result.pagination.hasMore,
					nextCursor: result.pagination.nextCursor,
					prevCursor: result.pagination.prevCursor,
					totalResults: result.pagination.totalResults,
				},
			};
		},

		userRecipes: async (
			_,
			{ userId, type = 'created', limit = 10, cursor = null, forward = true }
		) => {
			// Import the getUserRecipes function
			const { getUserRecipes } = await import('@/lib/recipeDb.server');

			// Call our cursor-based pagination function
			const result = await getUserRecipes(userId, type, limit, cursor, forward);

			// Populate author information for each recipe
			if (result.recipes && result.recipes.length > 0) {
				const User = (await import('@/models/User')).default;

				// Get all author IDs
				const authorIds = result.recipes.map((recipe) => recipe.createdBy).filter(Boolean);

				// Fetch all authors in one query
				const authors = await User.find({ _id: { $in: authorIds } });
				const authorsMap = new Map(authors.map((author) => [author._id.toString(), author]));

				// Map authors to recipes
				result.recipes = result.recipes.map((recipe) => {
					if (recipe.createdBy) {
						const authorId = recipe.createdBy.toString();
						const author = authorsMap.get(authorId);
						if (author) {
							return { ...recipe, author };
						}
					}
					return recipe;
				});
			}

			return {
				recipes: result.recipes,
				pageInfo: {
					hasMore: result.pagination.hasMore,
					nextCursor: result.pagination.nextCursor,
					prevCursor: result.pagination.prevCursor,
					totalResults: result.pagination.totalResults,
				},
			};
		},
	},

	Mutation: {
		register: async (_, { input }) => {
			const { name, email, password, avatar, bio } = input;

			// Check if user already exists
			const existingUser = await User.findOne({ email });
			if (existingUser) {
				throw new GraphQLError('User with this email already exists', {
					extensions: { code: 'USER_EXISTS' },
				});
			}

			// Hash password
			const hashedPassword = await bcrypt.hash(password, 12);

			// Create user
			const user = new User({
				name,
				email,
				password: hashedPassword,
				avatar,
				bio,
			});

			await user.save();

			// Generate token
			const token = generateToken(user._id);

			return {
				token,
				user,
			};
		},

		login: async (_, { email, password }) => {
			// Find user
			const user = await User.findOne({ email });
			if (!user) {
				throw new GraphQLError('Invalid email or password', {
					extensions: { code: 'INVALID_CREDENTIALS' },
				});
			}

			// Check password
			const isValidPassword = await bcrypt.compare(password, user.password);
			if (!isValidPassword) {
				throw new GraphQLError('Invalid email or password', {
					extensions: { code: 'INVALID_CREDENTIALS' },
				});
			}

			// Generate token
			const token = generateToken(user._id);

			return {
				token,
				user,
			};
		},

		createRecipe: async (_, { input }, { user }) => {
			requireAuth(user);

			const recipe = new Recipe({
				...input,
				author: user._id,
			});

			await recipe.save();
			await recipe.populate('author');

			return recipe;
		},

		updateRecipe: async (_, { id, input }, { user }) => {
			requireAuth(user);

			const recipe = await Recipe.findById(id);
			if (!recipe) {
				throw new GraphQLError('Recipe not found', {
					extensions: { code: 'NOT_FOUND' },
				});
			}

			// Check if user owns the recipe
			if (recipe.author.toString() !== user._id.toString()) {
				throw new GraphQLError('You can only update your own recipes', {
					extensions: { code: 'FORBIDDEN' },
				});
			}

			Object.assign(recipe, input);
			await recipe.save();
			await recipe.populate('author');

			return recipe;
		},

		deleteRecipe: async (_, { id }, { user }) => {
			requireAuth(user);

			const recipe = await Recipe.findById(id);
			if (!recipe) {
				throw new GraphQLError('Recipe not found', {
					extensions: { code: 'NOT_FOUND' },
				});
			}

			// Check if user owns the recipe
			if (recipe.author.toString() !== user._id.toString()) {
				throw new GraphQLError('You can only delete your own recipes', {
					extensions: { code: 'FORBIDDEN' },
				});
			}

			await Recipe.findByIdAndDelete(id);

			return {
				success: true,
				message: 'Recipe deleted successfully',
			};
		},
	},
};
