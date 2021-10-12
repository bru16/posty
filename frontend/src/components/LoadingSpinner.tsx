import { Flex, Spinner } from "@chakra-ui/react";
import React from "react";

interface props {
  noCenter?: boolean;
}

export const LoadingSpinner = ({ noCenter }: props) => {
  if (noCenter) return <Spinner size="xl" />;
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      position="fixed"
      top={0}
      width="100%"
      height="100%"
    >
      <Spinner size="xl" />
    </Flex>
  );
};
