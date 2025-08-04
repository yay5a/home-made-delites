import { gql } from '@apollo/client';
import { RECIPE_FRAGMENT, USER_FRAGMENT } from './fragments';

export const LOGIN_MUTATION = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
			user {
				...UserFragment
			}
		}
	}
	${USER_FRAGMENT}
`;

export const REGISTER_MUTATION = gql`
	mutation Register($input: RegisterInput!) {
		register(input: $input) {
			token
			user {
				...UserFragment
			}
		}
	}
	${USER_FRAGMENT}
`;

export const CREATE_RECIPE = gql`
	mutation CreateRecipe($input: RecipeInput!) {
		createRecipe(input: $input) {
			...RecipeFragment
		}
	}
	${RECIPE_FRAGMENT}
`;

export const UPDATE_RECIPE = gql`
	mutation UpdateRecipe($id: ID!, $input: RecipeInput!) {
		updateRecipe(id: $id, input: $input) {
			...RecipeFragment
		}
	}
	${RECIPE_FRAGMENT}
`;

export const DELETE_RECIPE = gql`
	mutation DeleteRecipe($id: ID!) {
		deleteRecipe(id: $id) {
			success
			message
		}
	}
`;

export const UPDATE_USER_PROFILE = gql`
	mutation UpdateUserProfile($input: UserInput!) {
		updateUserProfile(input: $input) {
			...UserFragment
		}
	}
	${USER_FRAGMENT}
`;
