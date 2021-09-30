import { IconButton } from "@chakra-ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import gql from "graphql-tag";
import router from "next/dist/client/router";
import React, { useState } from "react";
import { useVoteMutation } from "../generated/graphql";
import { useIsAuth } from "../utils/useIsAuth";

interface VotePostProps {
  id: number;
  voteStatus: number | undefined | null;
  points: number;
}

export const VotePost: React.FC<VotePostProps> = ({
  id,
  points,
  voteStatus,
}) => {
  const { isAuth } = useIsAuth();
  const [vote] = useVoteMutation();

  const [loadingState, setLoadingState] = useState<
    "upvote-loading" | "downvote-loading" | "no-loading"
  >("no-loading");

  const handleVote = async (value: number) => {
    if (!isAuth) return router.push("/login");

    setLoadingState(value === 1 ? "upvote-loading" : "downvote-loading");
    await vote({
      variables: {
        postId: id,
        value,
      },
      update: (cache) => {
        const data = cache.readFragment<{
          id: number;
          points: number;
          voteStatus: number | null;
        }>({
          id: "Post:" + id,
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
            id: "Post:" + id,
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
      <IconButton
        color={voteStatus === 1 ? "green" : undefined}
        variant="solid"
        colorScheme="black"
        aria-label="UpVote"
        icon={<ChevronUpIcon />}
        onClick={() => handleVote(1)}
        isLoading={loadingState === "upvote-loading"}
        disabled={loadingState !== "no-loading"}
      />
      {points}
      <IconButton
        color={voteStatus === -1 ? "red" : undefined}
        variant="solid"
        colorScheme="black"
        aria-label="DownVote"
        icon={<ChevronDownIcon />}
        onClick={() => handleVote(-1)}
        isLoading={loadingState === "downvote-loading"}
        disabled={loadingState !== "no-loading"}
      />
    </>
  );
};
