import { Box, Button, Container } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import EmailSend from "../components/EmailSend";
import { InputField } from "../components/InputField";
import NavBar from "../components/NavBar";
import { useForgotPasswordMutation } from "../generated/graphql";
import withApollo from "../utils/apolloServer";

const forgotPassword = () => {
  const [forgotPassword] = useForgotPasswordMutation();
  const [emailWasSent, setEmailWasSent] = useState<boolean>(false);

  if (emailWasSent) {
    return <EmailSend />;
  }

  return (
    <>
      <NavBar />
      <Container mt={20} maxW="400">
        <Box textAlign="center">
          <h1>Forgot Password</h1>
        </Box>
        <Formik
          initialValues={{ email: "" }}
          onSubmit={async (values) => {
            await forgotPassword({
              variables: { email: values.email },
            });
            setEmailWasSent(true);
          }}
        >
          {(props) => (
            <Form>
              <InputField name="email" placeholder="email" label="Email" />
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
    </>
  );
};

export default withApollo({ ssr: false })(forgotPassword);
