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
import { ACCESS_TOKEN, USER } from "../../constants";
import { useRouter } from "next/navigation";
import axios from "axios";
import { restApiBase } from "@libs/restApi";

const baseUrl = process.env.NEXT_PUBLIC_URL_SERVER;

const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_URL_SERVER}graphql`,
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
const refreshToken = async() => {
  await axios({
    baseURL: `${baseUrl}api/auth/refresh-access`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    withCredentials: true,
  })
    .then(async (rs) => {
      const { accessToken } = rs.data;
      localStorage.setItem(ACCESS_TOKEN, accessToken);
    })
    .catch((err) => {
      console.log("error", err);
      throw err;
    });
};

const handleLogoutApi = async () => {
  try {
    const result = await restApiBase({}, "api/auth/logout");
    if (!result) {
      throw new Error();
    }
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(USER);
  } catch (error) {
    console.log(error);
  }
};

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
              await refreshToken();
              const subscriber = {
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              };
              forward(operation).subscribe(subscriber);
            } catch (error) {
              observer.error(error);
              await handleLogoutApi();
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
