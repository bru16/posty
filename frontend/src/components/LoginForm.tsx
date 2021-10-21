import { Box, Button, Container, Flex, Link } from "@chakra-ui/react";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/dist/client/router";
import NextLink from "next/link";
import React, { useState } from "react";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { InputField } from "./InputField";
import { LoadingSpinner } from "./LoadingSpinner";

const LoginForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [login] = useLoginMutation();
  const router = useRouter();

  const handleGuest = async () => {
    setLoading(true);
    await login({
      variables: { usernameOrEmail: "guest", password: "guest" },
      update: (cache, { data }) => {
        cache.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            __typename: "Query",
            me: data?.login.user,
          },
        });
        cache.evict({ fieldName: "posts" });
      },
    });
    router.push("/");
  };

  const handleSubmit = async (
    values: { usernameOrEmail: string; password: string },
    actions: FormikHelpers<{ usernameOrEmail: string; password: string }>
  ) => {
    const response = await login({
      variables: values,
      update: (cache, { data }) => {
        cache.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            __typename: "Query",
            me: data?.login.user,
          },
        });
        cache.evict({ fieldName: "posts" });
      },
    });
    const errors = response.data?.login.errors;
    if (errors) return actions.setErrors(toErrorMap(errors)); // display error message to user.
    if (typeof router.query.next === "string")
      return router.push(router.query.next);
    router.push("/");
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container mt={20} maxW="400">
      <Box textAlign="center">
        <h1>LOGIN</h1>
      </Box>
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={(values, actions) => handleSubmit(values, actions)}
      >
        {(props) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              placeholder="username / email"
              label="Username or Email"
            />
            <InputField
              name="password"
              placeholder="password"
              label="Password"
              type="password"
            />
            <Flex mt={3} justifyContent="space-between" align="center">
              <Button p={1} onClick={() => handleGuest()}>
                <Link>login as a guest</Link>
              </Button>
              <NextLink href="/forgot-password">
                <Link>forgot password?</Link>
              </NextLink>
            </Flex>
            <Button
              mt={5}
              colorScheme="linkedin"
              isLoading={props.isSubmitting}
              type="submit"
              size="md"
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default LoginForm;
