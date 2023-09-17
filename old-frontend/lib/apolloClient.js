import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { apiDomain } from '../utilities/constants';
import { setContext } from '@apollo/client/link/context';
import { withApollo } from "next-apollo";
import {getCookie} from "./helpers";

const httpLink = createHttpLink({
  uri: `${apiDomain}/graphql`, // Server URL (must be absolute)
  credentials: "same-origin"
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = getCookie('csrftoken');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      // 'Custom-Header': document.cookie,
      'X-CSRFToken': token,
    }
  }
});

export const apolloClient = new ApolloClient({
  ssrMode: typeof window === "undefined",
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default withApollo(apolloClient);