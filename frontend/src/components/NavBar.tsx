import { useApolloClient } from "@apollo/client";
import { Button, Flex, Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

const NavBar = () => {
  const { data, loading } = useMeQuery();
  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const handleLogout = async () => {
    await logout();
    await apolloClient.resetStore(); // reset cache
  };

  if (loading) return null;

  return (
    <Flex
      justifyContent="flex-end"
      bg="aliceblue"
      p={4}
      align="center"
      position="sticky"
      top={0}
      zIndex={1}
    >
      <Flex mr="auto">
        <NextLink href="/">
          <Link>
            <Heading>Posty</Heading>
          </Link>
        </NextLink>
      </Flex>
      {!data?.me ? (
        <>
          <NextLink href="/register">
            <Link mr="3">Sign Up</Link>
          </NextLink>
          <NextLink href="/login">
            <Link>Log In</Link>
          </NextLink>
        </>
      ) : (
        <>
          <h2>Welcome {data.me.username}!</h2>
          <Button
            onClick={handleLogout}
            isLoading={logoutLoading}
            variant="link"
            color="green"
            ml="2"
          >
            Logout
          </Button>
        </>
      )}
    </Flex>
  );
};

export default NavBar;
