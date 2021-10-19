import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  CloseButton,
  Flex,
} from "@chakra-ui/react";
import { Form, Formik, FormikHelpers } from "formik";
import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import React, { useState } from "react";
import { InputField } from "../../components/InputField";
import NavBar from "../../components/NavBar";
import {
  MeDocument,
  MeQuery,
  useChangePasswordMutation,
} from "../../generated/graphql";
import WithApollo from "../../utils/apolloServer";
import { toErrorMap } from "../../utils/toErrorMap";

const ChangePassword: NextPage<{ token: string }> = () => {
  const router = useRouter();
  const [changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");

  const handleSubmit = async (
    values: any,
    actions: FormikHelpers<{
      newPassword: string;
    }>
  ) => {
    const response = await changePassword({
      variables: {
        token: typeof router.query.token === "string" ? router.query.token : "",
        newPassword: values.newPassword,
      },
      update: (cache, { data }) => {
        cache.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            __typename: "Query",
            me: data?.changePassword.user,
          },
        });
        cache.evict({ fieldName: "posts" });
      },
    });

    const errors = response.data?.changePassword.errors;
    if (errors) {
      const errorsMapped = toErrorMap(errors);
      if ("token" in errorsMapped) setTokenError(errorsMapped.token);
      return actions.setErrors(errorsMapped);
    }
    router.push("/");
  };

  return (
    <>
      <NavBar />
      <Flex mt={10} justifyContent="center">
        <Formik initialValues={{ newPassword: "" }} onSubmit={handleSubmit}>
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
    </>
  );
};

export default WithApollo({ ssr: false })(ChangePassword);
