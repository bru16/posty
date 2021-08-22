import { Box, Button, Container } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { InputField } from "../components/InputField";
import { useCreatePostMutation } from "../generated/graphql";
import { useIsAuth } from "../utils/useIsAuth";

export const CreatePost: React.FC<{}> = ({}) => {
  const [createPost] = useCreatePostMutation();
  const router = useRouter();
  console.log("ESTOY EN CREATE");
  const { loading } = useIsAuth();
  if (loading) return <div>loading...</div>;

  return (
    <Container mt={20} maxW="400">
      <Box textAlign="center">
        <h1>Create a new Post!</h1>
      </Box>
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values, actions) => {
          try {
            await createPost({
              variables: {
                title: values.title,
                text: values.text,
              },
            });
            router.push("/");
          } catch (error) {
            router.push("/login");
          }
        }}
      >
        {(props) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <InputField
              name="text"
              placeholder="text"
              label="Text"
              type="text"
              textarea
            />
            <Button
              mt={5}
              colorScheme="linkedin"
              isLoading={props.isSubmitting}
              type="submit"
              size="md"
            >
              Create
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default CreatePost;
