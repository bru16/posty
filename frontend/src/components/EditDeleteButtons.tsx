import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { IconButton, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useDeletePostMutation } from "../generated/graphql";

interface EditDeleteButtonsProps {
  id: number;
}

export const EditDeleteButtons: React.FC<EditDeleteButtonsProps> = ({ id }) => {
  const [deletePost] = useDeletePostMutation();
  const handleDelete = () => {
    deletePost({
      variables: { id },
      update: (cache) => {
        cache.evict({ id: "Post:" + id });
      },
    });
  };
  return (
    <>
      <IconButton
        icon={<DeleteIcon />}
        aria-label="Delete Post"
        onClick={handleDelete}
        size="sm"
      />
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton
          as={Link}
          icon={<EditIcon />}
          aria-label="Edit Post"
          size="sm"
        />
      </NextLink>
    </>
  );
};
