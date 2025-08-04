'use client';

import { ApolloProvider } from '@apollo/client';
import { AuthProvider } from '@/context/AuthContext';
import client from '@/graphql/client';

export default function Providers({ children }) {
	return (
		<ApolloProvider client={client}>
			<AuthProvider>{children}</AuthProvider>
		</ApolloProvider>
	);
}
