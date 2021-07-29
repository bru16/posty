import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { createConnection } from "typeorm";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import express from "express";
import cors from "cors";

async function bootstrap() {
  try {
    const connection = await createConnection();
    await connection.runMigrations();
    const app = express();
    app.use(cors());
    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [PostResolver, UserResolver],
      }),
      context: () => ({ manager: connection.manager }),
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: false }); // --- /graphql endpoint
    const PORT = process.env.PORT || 4000;
    app.listen(4000, () => console.log(`Listening on PORT: ${PORT}`));
  } catch (error) {
    console.error(error);
  }
}

bootstrap(); // actually run the async function
