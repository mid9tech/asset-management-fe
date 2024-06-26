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
import { ACCESS_TOKEN } from "../../constants";
import { logout, refreshToken } from "@services/auth";

const httpLink = new HttpLink({
  uri: `/graphql`,
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
  const token = localStorage.getItem(ACCESS_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const onErrorCustom = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      if (graphQLErrors[0].message === "Forbidden resource") {
        location.href = "/error"
      }
      if (graphQLErrors[0].message === "Unauthorized") {
        return new Observable(observer => {
          (async () => {
            try {
              const result = await refreshToken();
              const subscriber = {
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              };
              forward(operation).subscribe(subscriber);
            } catch (error) {
              observer.error(error);
              console.log(error);
              await logout();
              location.href = "/login"
            }
          })();
        });
      }
    }

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
