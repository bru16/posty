import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { ApolloProvider } from "@apollo/client";
import theme from "../theme";
import React from "react";
import { NavBar } from "../components/NavBar";
import { client } from "../utils/apolloServer";

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
