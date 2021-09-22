import { withApollo as createApollo } from "next-apollo";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { PaginatedPosts } from "../generated/graphql";

export const client = new ApolloClient({
  link: createHttpLink({
    credentials: "include",
    uri: "http://localhost:4000/graphql",
  }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            keyArgs: false,
            merge(
              existing: PaginatedPosts | undefined,
              incoming: PaginatedPosts
            ): PaginatedPosts {
              return {
                __typename: "PaginatedPosts",
                hasMore: incoming.hasMore,
                posts: [...(existing?.posts || []), ...incoming.posts],
              };
            },
          },
        },
      },
    },
  }),
});

export const withApollo = createApollo(client);
