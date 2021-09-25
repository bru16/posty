import { Box, Button, Container, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/dist/client/router";
import NextLink from "next/link";
import React from "react";
import { InputField } from "../components/InputField";
import { NavBar } from "../components/NavBar";
import { useLoginMutation } from "../generated/graphql";
import withApollo from "../utils/apolloServer";
import { toErrorMap } from "../utils/toErrorMap";

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  const [login] = useLoginMutation();
  const router = useRouter();
  return (
    <>
      <NavBar />
      <Container mt={20} maxW="400">
        <Box textAlign="center">
          <h1>LOGIN</h1>
        </Box>
        <Formik
          initialValues={{ usernameOrEmail: "", password: "" }}
          onSubmit={async (values, actions) => {
            const response = await login({
              variables: values,
            });
            const errors = response.data?.login.errors;
            if (errors) return actions.setErrors(toErrorMap(errors)); // display error message to user.
            console.log(router.query.next);
            if (typeof router.query.next === "string")
              return router.push(router.query.next);
            router.push("/");
          }}
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
              <Flex mt={3}>
                <NextLink href="/forgot-password">
                  <Link ml="auto">forgot password?</Link>
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
    </>
  );
};

export default withApollo({ ssr: false })(Login);
