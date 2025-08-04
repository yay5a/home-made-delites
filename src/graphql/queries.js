import { gql } from '@apollo/client';
import { RECIPE_FRAGMENT, USER_FRAGMENT } from './fragments';

export const GET_RECIPES = gql`
	query GetRecipes($limit: Int, $cursor: String, $forward: Boolean, $category: String) {
		recipes(limit: $limit, cursor: $cursor, forward: $forward, category: $category) {
			recipes {
				...RecipeFragment
			}
			pageInfo {
				hasMore
				nextCursor
				prevCursor
				totalResults
			}
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
	query SearchRecipes($query: String!, $limit: Int, $cursor: String, $forward: Boolean) {
		searchRecipes(query: $query, limit: $limit, cursor: $cursor, forward: $forward) {
			recipes {
				...RecipeFragment
			}
			pageInfo {
				hasMore
				nextCursor
				prevCursor
				totalResults
			}
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
	query GetUserRecipes($userId: ID!, $type: String, $limit: Int, $cursor: String, $forward: Boolean) {
		userRecipes(userId: $userId, type: $type, limit: $limit, cursor: $cursor, forward: $forward) {
			recipes {
				...RecipeFragment
			}
			pageInfo {
				hasMore
				nextCursor
				prevCursor
				totalResults
			}
		}
	}
	${RECIPE_FRAGMENT}
`;
