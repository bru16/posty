import {
  Button,
  Container,
  Flex,
  Heading,
  Link,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { Post } from "../components/Post";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
  const { data, loading } = usePostsQuery({
    variables: { limit: 10 },
  });

  if (!loading && !data) return <div>something went wrong</div>;

  return (
    <Container justifyContent="center" mt={10}>
      <Flex mb={3} p={3} align="center">
        <Heading>Reddit</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">Create Post!</Link>
        </NextLink>
      </Flex>
      {loading && !data ? (
        <Flex h={400} align="center" justifyContent="center">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Stack spacing={8}>
          {data!.posts.map((p) => (
            <Flex p={3} shadow="md" borderWidth="1px" key={p.id}>
              <Post post={p} />
            </Flex>
          ))}
        </Stack>
      )}
      {data && (
        <Flex justifyContent="center" p={4}>
          <Button>Load more...</Button>
        </Flex>
      )}
    </Container>
  );
};

export default Index;
