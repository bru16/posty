import { Box, Flex, Heading, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { PostTypeFragment, useMeQuery } from "../generated/graphql";
import { EditDeleteButtons } from "./EditDeleteButtons";
import { VotePost } from "./VotePost";

interface PostProps {
  post: PostTypeFragment;
}

export const Post: React.FC<PostProps> = ({ post }) => {
  const { data: meData } = useMeQuery();
  return (
    <>
      <Flex mr={2} align="center" justifyContent="center" direction="column">
        <VotePost
          id={post.id}
          voteStatus={post.voteStatus}
          points={post.points}
        />
      </Flex>
      <Box flex={1}>
        <NextLink href="/post/[id]" as={`/post/${post.id}`}>
          <Link>
            <Heading fontSize="xl">{post.title}</Heading>
          </Link>
        </NextLink>
        <Text color="gray">{post.creator.username}</Text>
        <Flex align="center">
          <Text mt={4}>{post.textShortened}</Text>
          {meData?.me?.id === post.creatorId && (
            <Box ml="auto">
              <EditDeleteButtons id={post.id} />
            </Box>
          )}
        </Flex>
      </Box>
    </>
  );
};
