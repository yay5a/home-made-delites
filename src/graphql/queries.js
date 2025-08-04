import { gql } from '@apollo/client';
import { RECIPE_FRAGMENT, USER_FRAGMENT } from './fragments';

export const GET_RECIPES = gql`
	query GetRecipes($limit: Int, $offset: Int, $category: String) {
		recipes(limit: $limit, offset: $offset, category: $category) {
			...RecipeFragment
		}
	}
	${RECIPE_FRAGMENT}
`;

export const GET_RECIPE_BY_ID = gql`
	query GetRecipeById($id: ID!) {
		recipe(id: $id) {
			...RecipeFragment
		}
	}
	${RECIPE_FRAGMENT}
`;

export const SEARCH_RECIPES = gql`
	query SearchRecipes($query: String!, $limit: Int, $offset: Int) {
		searchRecipes(query: $query, limit: $limit, offset: $offset) {
			...RecipeFragment
		}
	}
	${RECIPE_FRAGMENT}
`;

export const GET_USER_PROFILE = gql`
	query GetUserProfile {
		me {
			...UserFragment
		}
	}
	${USER_FRAGMENT}
`;

export const GET_USER_RECIPES = gql`
	query GetUserRecipes($userId: ID!) {
		userRecipes(userId: $userId) {
			...RecipeFragment
		}
	}
	${RECIPE_FRAGMENT}
`;
