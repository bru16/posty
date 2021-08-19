import { Button, Flex } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import router from "next/dist/client/router";
import React, { useState } from "react";
import { InputField } from "../../components/InputField";
import { useChangePasswordMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const [changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");
  return (
    <Flex mt={10} justifyContent="center">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, actions) => {
          const response = await changePassword({
            variables: {
              token,
              newPassword: values.newPassword,
            },
          });
          const errors = response.data?.changePassword.errors;
          if (errors) {
            const errorsMapped = toErrorMap(errors);
            if (token in errorsMapped) setTokenError(errorsMapped.token);
            return actions.setErrors(errorsMapped);
          }
          router.push("/");
        }}
      >
        {(props) => (
          <Form>
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
            {tokenError && <h1>{tokenError}</h1>}
          </Form>
        )}
      </Formik>
    </Flex>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default ChangePassword;
