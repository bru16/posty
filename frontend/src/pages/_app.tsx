import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import WithApollo from "../utils/apolloServer";
import React from "react";
import { NavBar } from "../components/NavBar";
import theme from "../theme";

function MyApp({ Component, pageProps }: any) {
  return (
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
  );
}

export default WithApollo({ ssr: false })(MyApp);
