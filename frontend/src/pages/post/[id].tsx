import { Container, Heading } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { NavBar } from "../../components/NavBar";
import { usePostQuery } from "../../generated/graphql";
import withApollo from "../../utils/apolloServer";
import { useGetIntId } from "../../utils/useGetIntId";

const Post = () => {
  const id = useGetIntId();
  const { data, loading } = usePostQuery({
    skip: id === -1,
    variables: {
      id,
    },
  });

  if (loading) return <Spinner />;

  if (!data?.post) {
    return <div>Something went wrong</div>;
  }

  return (
    <>
      <NavBar />
      <Container>
        <Heading>{data.post.title}</Heading>
        <div>{data.post.text}</div>
      </Container>
    </>
  );
};

export default withApollo({ ssr: true })(Post);
