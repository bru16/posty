import withApollo from "../../utils/apolloServer";
import { useRouter } from "next/dist/client/router";
import { usePostQuery } from "../../generated/graphql";
import React from "react";
import { Spinner } from "@chakra-ui/spinner";
import { NavBar } from "../../components/NavBar";
import { Container, Heading } from "@chakra-ui/layout";

const Post = () => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;

  const { data, loading } = usePostQuery({
    skip: intId === -1,
    variables: {
      id: intId,
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
