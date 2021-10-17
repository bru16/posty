import { DeleteIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { useDeletePostMutation } from "../generated/graphql";

export const DeleteButton = ({ id }: { id: number }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [deletePost] = useDeletePostMutation();
  const toast = useToast();
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef() as any;

  const handleDelete = async () => {
    onClose();
    await deletePost({
      variables: { id },
      update: (cache) => {
        cache.evict({ id: "Post:" + id });
      },
    });
    toast({
      title: "Reddit",
      description: "Your post have been deleted.",
      isClosable: true,
      position: "bottom-left",
    });
  };

  return (
    <>
      <IconButton
        icon={<DeleteIcon />}
        aria-label="Delete Post"
        onClick={() => setIsOpen(true)}
        size="sm"
      />
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent background="white">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Post
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
