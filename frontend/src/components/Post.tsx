import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Box, Heading, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostTypeFragment, useVoteMutation } from "../generated/graphql";

interface PostProps {
  post: PostTypeFragment;
}

export const Post: React.FC<PostProps> = ({ post }) => {
  const [vote] = useVoteMutation();
  const [loadingState, setLoadingState] = useState<
    "upvote-loading" | "downvote-loading" | "no-loading"
  >("no-loading");
  const handleVote = async (value: number) => {
    setLoadingState(value === 1 ? "upvote-loading" : "downvote-loading");
    await vote({
      variables: {
        postId: post.id,
        value,
      },
    });
    setLoadingState("no-loading");
  };

  return (
    <>
      <Flex mr={2} align="center" justifyContent="center" direction="column">
        <IconButton
          variant="solid"
          colorScheme="black"
          aria-label="UpVote"
          icon={<ChevronUpIcon />}
          onClick={() => handleVote(1)}
          isLoading={loadingState === "upvote-loading"}
          disabled={loadingState !== "no-loading"}
        />
        {post.points}
        <IconButton
          variant="solid"
          colorScheme="black"
          aria-label="DownVote"
          icon={<ChevronDownIcon />}
          onClick={() => handleVote(-1)}
          isLoading={loadingState === "downvote-loading"}
          disabled={loadingState !== "no-loading"}
        />
      </Flex>
      <Box>
        <Heading fontSize="xl">{post.title}</Heading>
        <Text color="gray">{post.creator.username}</Text>
        <Text mt={4}>{post.textShortened}</Text>
      </Box>
    </>
  );
};
