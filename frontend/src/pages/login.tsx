import { Container, Button, Box } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { InputField } from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  const [login, { data, error, loading }] = useLoginMutation();
  const router = useRouter();
  return (
    <Container mt={20} maxW="400">
      <Box textAlign="center">
        <h1>LOGIN</h1>
      </Box>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, actions) => {
          const response = await login({
            variables: values,
          });
          const errors = response.data?.login.errors;
          if (errors) return actions.setErrors(toErrorMap(errors)); // display error message to user.
          router.push("/");
        }}
      >
        {(props) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />
            <InputField
              name="password"
              placeholder="password"
              label="Password"
              type="password"
            />
            <Button
              mt={5}
              colorScheme="teal"
              isLoading={props.isSubmitting}
              type="submit"
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default Login;
