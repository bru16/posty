import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Flex,
  Stack,
  Tag,
  TagLeftIcon,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { NavBar } from "../components/NavBar";
import { Post } from "../components/Post";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import withApollo from "../utils/apolloServer";

const Index = () => {
  const { data, loading, fetchMore, variables } = usePostsQuery({
    variables: { limit: 10, cursor: null },
    notifyOnNetworkStatusChange: true,
  });

  const { data: meData } = useMeQuery();
  const href = meData?.me ? "/create-post" : "/login";

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        limit: variables?.limit,
        cursor: data?.posts.posts[data.posts.posts.length - 1].created_at, // last post as a reference to paginate more posts.
      },
    });
  };

  if (!loading && !data) return <div>something went wrong</div>;
  if (loading && !data) return <LoadingSpinner />;

  return (
    <>
      <NavBar />
      <Container justifyContent="center" mt={10} maxWidth="650px">
        <Flex mb={3} p={3} align="center" justifyContent="center">
          <NextLink href={href}>
            <Box cursor="pointer">
              <Tag colorScheme="teal">
                <TagLeftIcon boxSize="13px" as={AddIcon} />
                Create Post!
              </Tag>
            </Box>
          </NextLink>
        </Flex>
        <Stack spacing={8} mb={10}>
          {data!.posts.posts.map((p) => (
            <Flex
              p={4}
              shadow="md"
              borderWidth="1px"
              key={p.id}
              wordBreak="break-all"
            >
              <Post post={p} />
            </Flex>
          ))}
        </Stack>
        {data && data.posts.hasMore && (
          <Flex justifyContent="center" p={4}>
            <Button onClick={handleFetchMore}>Load more...</Button>
          </Flex>
        )}
      </Container>
    </>
  );
};

export default withApollo({ ssr: true })(Index);
