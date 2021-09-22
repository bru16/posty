import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Box, Heading, Text } from "@chakra-ui/react";
import gql from "graphql-tag";
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
      update: (cache) => {
        const data = cache.readFragment<{
          id: number;
          points: number;
          voteStatus: number | null;
        }>({
          id: "Post:" + post.id,
          fragment: gql`
            fragment _ on Post {
              id
              points
              voteStatus
            }
          `,
        });

        if (data) {
          if (data.voteStatus === value) return; // to not upvote or downvote again

          const newPoints = data.points + (!data.voteStatus ? 1 : 2) * value;
          cache.writeFragment({
            id: "Post:" + post.id,
            fragment: gql`
              fragment __ on Post {
                points
                voteStatus
              }
            `,
            data: { points: newPoints, voteStatus: value },
          });
        }
      },
    });
    setLoadingState("no-loading");
  };

  return (
    <>
      <Flex mr={2} align="center" justifyContent="center" direction="column">
        <IconButton
          color={post.voteStatus === 1 ? "green" : undefined}
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
          color={post.voteStatus === -1 ? "red" : undefined}
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
