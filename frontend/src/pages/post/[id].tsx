import { Container, Heading } from "@chakra-ui/layout";
import React from "react";
import { LoadingSpinner } from "../../components/LoadingSpinner";
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

  if (loading) return <LoadingSpinner />;

  if (!data?.post) {
    return <div>Something went wrong</div>;
  }

  return (
    <Container>
      <Heading>{data.post.title}</Heading>
      <div>{data.post.text}</div>
    </Container>
  );
};

export default withApollo({ ssr: true })(Post);
