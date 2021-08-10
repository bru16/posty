import { Box, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const { data, loading, error } = useMeQuery();

  if (loading) return null;

  return (
    <Flex justifyContent="flex-end" bg="aliceblue" p={4}>
      <Box>
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
          <h1>Welcome!</h1>
        )}
      </Box>
    </Flex>
  );
};
