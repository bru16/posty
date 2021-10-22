import { Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { useCreatePostMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { InputField } from "./InputField";

const CreatePostForm = () => {
  const router = useRouter();
  const [createPost] = useCreatePostMutation();
  return (
    <Formik
      initialValues={{ title: "", text: "" }}
      onSubmit={async (values, actions) => {
        try {
          const response = await createPost({
            variables: {
              title: values.title,
              text: values.text,
            },
            update: (cache) => {
              cache.evict({ fieldName: "posts" });
            },
          });
          const errors = response.data?.createPost.errors;
          if (errors) return actions.setErrors(toErrorMap(errors));

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
  );
};
export default CreatePostForm;
