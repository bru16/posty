import { Box, Button, Container } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { InputField } from "../../../components/InputField";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { NavBar } from "../../../components/NavBar";
import {
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import WithApollo from "../../../utils/apolloServer";
import { useGetIntId } from "../../../utils/useGetIntId";

interface EditPostProps {}

const EditPost: React.FC<EditPostProps> = ({}) => {
  const id = useGetIntId();
  const router = useRouter();
  const { data, loading } = usePostQuery({
    skip: id === -1,
    variables: {
      id,
    },
  });
  const [updatePost] = useUpdatePostMutation();
  if (loading) return <LoadingSpinner />;

  if (!data?.post) {
    return <div>Something went wrong</div>;
  }

  return (
    <>
      <NavBar />
      <Container mt={20} maxW="400">
        <Box textAlign="center">
          <h1>Edit your post</h1>
        </Box>
        <Formik
          initialValues={{ title: data.post.title, text: data.post.text }}
          onSubmit={async (values, actions) => {
            await updatePost({ variables: { id, ...values } });
            router.push("/");
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
                Edit
              </Button>
            </Form>
          )}
        </Formik>
      </Container>
    </>
  );
};

export default WithApollo({ ssr: false })(EditPost);
