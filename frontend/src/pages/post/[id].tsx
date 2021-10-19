import { Container, Flex, Heading } from "@chakra-ui/layout";
import { Stack, Text } from "@chakra-ui/react";
import React from "react";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import NavBar from "../../components/NavBar";
import { VotePost } from "../../components/VotePost";
import { usePostQuery } from "../../generated/graphql";
import withApollo from "../../utils/apolloServer";
import { calculateTime } from "../../utils/timeAgo";
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
    return <Container>something went wrong</Container>;
  }

  const timeAgo = calculateTime(data.post.created_at);

  return (
    <>
      <NavBar />
      <Container
        maxWidth="800px"
        borderWidth="2px"
        mt="10"
        wordBreak="break-all"
      >
        <Stack mt="10" spacing={8} mb={10}>
          <Flex align="center">
            <Flex direction="column" align="center">
              <VotePost
                id={data.post.id}
                voteStatus={data.post.voteStatus}
                points={data.post.points}
              />
            </Flex>
            <Heading ml="20px">{data.post.title}</Heading>
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
