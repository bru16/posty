import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Container,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { NavBar } from "../components/NavBar";
import { useForgotPasswordMutation } from "../generated/graphql";
import withApollo from "../utils/apolloServer";

export const forgotPassword: React.FC<{}> = ({}) => {
  const [forgotPassword] = useForgotPasswordMutation();
  const [emailWasSent, setEmailWasSent] = useState(false);

  if (emailWasSent) {
    return (
      <Box w="100%" h="100%" position="fixed">
        <Alert
          status="success"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="100%"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Email was sent!
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            check your inbox to proceed
          </AlertDescription>
        </Alert>
      </Box>
    );
  }

  return (
    <Container mt={20} maxW="400">
      <Box textAlign="center">
        <h1>Forgot Password</h1>
      </Box>
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values, actions) => {
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
  );
};

export default withApollo({ ssr: false })(forgotPassword);
