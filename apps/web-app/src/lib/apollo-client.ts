import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getIdToken } from './firebase';

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333/graphql',
  credentials: 'include',
});

// Auth link to add Firebase ID token to headers
const authLink = setContext(async (_, { headers }) => {
  const token = await getIdToken();

  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
