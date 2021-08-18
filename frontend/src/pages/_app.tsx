import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import theme from "../theme";
import React from "react";
import { NavBar } from "../components/NavBar";

const client = new ApolloClient({
  //ssrMode: true,
  link: createHttpLink({
    credentials: "include",
    uri: "http://localhost:4000/graphql",
  }),
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }: any) {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <NavBar />
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
