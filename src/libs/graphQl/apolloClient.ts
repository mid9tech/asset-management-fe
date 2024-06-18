// lib/apolloClient.js
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  Observable,
  DefaultOptions,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_URL_SERVER,
  fetchOptions: { cache: "no-store" },
});

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
  },
  query: {
    fetchPolicy: "no-cache",
  },
};
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("accessToken");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
export const onErrorCustom = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    console.log(graphQLErrors);
    //   if (graphQLErrors) {

    //   }

    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  }
);

const client = new ApolloClient({
  link: from([onErrorCustom, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

export default client;
