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

		recipes: async (_, { limit = 10, offset = 0, category }) => {
			const query = category ? { category } : {};
			return await Recipe.find(query)
				.populate('author')
				.sort({ createdAt: -1 })
				.skip(offset)
				.limit(limit);
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

		searchRecipes: async (_, { query, limit = 10, offset = 0 }) => {
			const searchQuery = {
				$or: [
					{ title: { $regex: query, $options: 'i' } },
					{ description: { $regex: query, $options: 'i' } },
					{ ingredients: { $regex: query, $options: 'i' } },
					{ category: { $regex: query, $options: 'i' } },
				],
			};

			return await Recipe.find(searchQuery)
				.populate('author')
				.sort({ createdAt: -1 })
				.skip(offset)
				.limit(limit);
		},

		userRecipes: async (_, { userId }) => {
			return await Recipe.find({ author: userId }).populate('author').sort({ createdAt: -1 });
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
