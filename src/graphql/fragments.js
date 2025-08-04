import { gql } from '@apollo/client';

export const RECIPE_FRAGMENT = gql`
	fragment RecipeFragment on Recipe {
		id
		title
		description
		image
		prepTime
		cookTime
		servings
		difficulty
		category
		ingredients
		instructions
		nutrition {
			calories
			protein
			carbs
			fat
		}
		author {
			id
			name
			email
		}
		createdAt
		updatedAt
	}
`;

export const USER_FRAGMENT = gql`
	fragment UserFragment on User {
		id
		name
		email
		avatar
		bio
		createdAt
		updatedAt
	}
`;

export const NUTRITION_FRAGMENT = gql`
	fragment NutritionFragment on Nutrition {
		calories
		protein
		carbs
		fat
		fiber
		sugar
		sodium
	}
`;
