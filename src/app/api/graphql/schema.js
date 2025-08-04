import { gql } from 'graphql-tag';

export const typeDefs = gql`
	type User {
		id: ID!
		name: String!
		email: String!
		avatar: String
		bio: String
		createdAt: String!
		updatedAt: String!
	}

	type Nutrition {
		calories: Float
		protein: Float
		carbs: Float
		fat: Float
		fiber: Float
		sugar: Float
		sodium: Float
	}

	type Recipe {
		id: ID!
		title: String!
		description: String
		image: String
		prepTime: Int
		cookTime: Int
		servings: Int
		difficulty: String
		category: String
		ingredients: [String!]!
		instructions: [String!]!
		nutrition: Nutrition
		author: User!
		createdAt: String!
		updatedAt: String!
	}

	type AuthPayload {
		token: String!
		user: User!
	}

	type DeleteResponse {
		success: Boolean!
		message: String
	}

	input RegisterInput {
		name: String!
		email: String!
		password: String!
		avatar: String
		bio: String
	}

	input RecipeInput {
		title: String!
		description: String
		image: String
		prepTime: Int
		cookTime: Int
		servings: Int
		difficulty: String
		category: String
		ingredients: [String!]!
		instructions: [String!]!
		nutrition: NutritionInput
	}

	input NutritionInput {
		calories: Float
		protein: Float
		carbs: Float
		fat: Float
		fiber: Float
		sugar: Float
		sodium: Float
	}

	type Query {
		me: User
		recipes(limit: Int, offset: Int, category: String): [Recipe!]!
		recipe(id: ID!): Recipe
		searchRecipes(query: String!, limit: Int, offset: Int): [Recipe!]!
		userRecipes(userId: ID!): [Recipe!]!
	}

	type Mutation {
		register(input: RegisterInput!): AuthPayload!
		login(email: String!, password: String!): AuthPayload!
		createRecipe(input: RecipeInput!): Recipe!
		updateRecipe(id: ID!, input: RecipeInput!): Recipe!
		deleteRecipe(id: ID!): DeleteResponse!
	}
`;
