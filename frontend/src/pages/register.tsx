import React from "react";
import { Formik, Form } from "formik";
import { Button, Container } from "@chakra-ui/react";
import { InputField } from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/dist/client/router";

interface registerProps {}

export const Register: React.FC<registerProps> = ({}) => {
  const [register, { data, error, loading }] = useRegisterMutation();
  const router = useRouter();
  return (
    <Container mt={20} maxW="400">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, actions) => {
          const response = await register({
            variables: values,
          });
          const errors = response.data.register?.errors;
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
export default Register;
