import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  Flex,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import React, { useState } from "react";
import { InputField } from "../../components/InputField";
import { useChangePasswordMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";

const ChangePassword: NextPage<{ token: string }> = () => {
  const router = useRouter();
  const [changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");

  return (
    <Flex mt={10} justifyContent="center">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, actions) => {
          const response = await changePassword({
            variables: {
              token:
                typeof router.query.token === "string"
                  ? router.query.token
                  : "",
              newPassword: values.newPassword,
            },
          });
          const errors = response.data?.changePassword.errors;
          if (errors) {
            const errorsMapped = toErrorMap(errors);
            if ("token" in errorsMapped) setTokenError(errorsMapped.token);
            return actions.setErrors(errorsMapped);
          }
          router.push("/");
        }}
      >
        {(props) => (
          <Form>
            {tokenError && (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle mr={10}>Token has expired!</AlertTitle>
                <CloseButton
                  onClick={() => setTokenError("")}
                  position="absolute"
                  right="8px"
                  top="8px"
                />
              </Alert>
            )}
            <InputField
              name="newPassword"
              placeholder="new password"
              label="New Password"
              type="password"
            />
            <Button
              mt={5}
              colorScheme="teal"
              isLoading={props.isSubmitting}
              type="submit"
              size="sm"
            >
              Change password
            </Button>
          </Form>
        )}
      </Formik>
    </Flex>
  );
};

export default ChangePassword;
