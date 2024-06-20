// lib/apolloClient.js
import { ApolloClient, InMemoryCache, HttpLink, from, Observable, DefaultOptions } from '@apollo/client';
// import { setContext } from '@apollo/client/link/context';
// import { onError } from '@apollo/client/link/error';
const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_URL_SERVER}graphql`,
  fetchOptions: { cache: "no-store" }
});

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
  },
  query: {
    fetchPolicy: 'no-cache',
  },
}
const clientWithoutAuth = new ApolloClient({
  link: from([(httpLink)]),
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

export default clientWithoutAuth;