import { Box, Container } from "@chakra-ui/react";
import React from "react";
import CreatePostForm from "../components/CreatePostForm";
import NavBar from "../components/NavBar";
import withApollo from "../utils/apolloServer";

const CreatePost = () => {
  return (
    <>
      <NavBar />
      <Container mt={20} maxW="400">
        <Box textAlign="center">
          <h1>Create a new Post!</h1>
        </Box>
        <CreatePostForm />
      </Container>
    </>
  );
};

export default withApollo({ ssr: false })(CreatePost);
