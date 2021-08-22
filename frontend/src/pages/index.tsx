import React from "react";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
  const { data, loading } = usePostsQuery();

  return (
    <div>
      {!data ? (
        <p>loading...</p>
      ) : (
        data.posts.map((p) => (
          <div key={p.id}>
            <h1>{p.title}</h1>
            <p>{p.text}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Index;
