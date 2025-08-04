import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
	uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || '/api/graphql',
});

const authLink = setContext((_, { headers }) => {
	// Get the authentication token from local storage if it exists
	const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

	// Return the headers to the context so httpLink can read them
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : '',
		},
	};
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
	defaultOptions: {
		watchQuery: {
			errorPolicy: 'all',
		},
		query: {
			errorPolicy: 'all',
		},
	},
});

export default client;
