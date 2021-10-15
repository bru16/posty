import { Container, Flex, Heading } from "@chakra-ui/layout";
import { Stack, Text } from "@chakra-ui/react";
import React from "react";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { NavBar } from "../../components/NavBar";
import { VotePost } from "../../components/VotePost";
import { usePostQuery } from "../../generated/graphql";
import withApollo from "../../utils/apolloServer";
import { useGetIntId } from "../../utils/useGetIntId";

const Post = () => {
  const id = useGetIntId();
  const { data, loading, error } = usePostQuery({
    skip: id === -1,
    variables: {
      id,
    },
  });

  if (loading) return <LoadingSpinner />;

  if (!data?.post) {
    return <div>d{error?.message}</div>;
  }

  const secondsDifference =
    (new Date().getTime() - +data.post.created_at) / 1000; // seconds of difference between when the post was created and current date.

  let timeAgo = secondsDifference.toString();
  if (secondsDifference < 60) {
    timeAgo = Math.round(+timeAgo) + " seconds ago";
  } else if (secondsDifference < 3600) {
    timeAgo = Math.round(+timeAgo / 60) + " minutes ago"; // 1 hour
  } else if (secondsDifference < 86400) {
    timeAgo = Math.round(+timeAgo / 3600) + " hours ago";
  } else timeAgo = Math.round(+timeAgo / 86400) + " days ago";

  return (
    <>
      <NavBar />
      <Container maxWidth="800px" borderWidth="2px" mt="10">
        <Stack mt="10" spacing={8} mb={10}>
          <Flex>
            <Flex direction="column" align="center">
              <VotePost
                id={data.post.id}
                voteStatus={data.post.voteStatus}
                points={data.post.points}
              />
            </Flex>
            <Heading>{data.post.title}</Heading>
          </Flex>
          <Flex justifyContent="space-between">
            <Text color="gray">posted by: {data.post.creator.username}</Text>
            <Text color="gray">{timeAgo}</Text>
          </Flex>
          <Text>{data.post.text}</Text>
        </Stack>
      </Container>
    </>
  );
};

export default withApollo({ ssr: true })(Post);
