import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { createConnection } from "typeorm";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import express from "express";
import cors from "cors";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core/dist/plugin/landingPage/graphqlPlayground";

async function bootstrap() {
  try {
    const connection = await createConnection();
    await connection.runMigrations();
    const app = express();

    app.use(cors());

    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();

    app.use(
      session({
        name: "qid",
        store: new RedisStore({ client: redisClient, disableTouch: true }),
        saveUninitialized: false,
        secret: "sdad32qd2rd333u73bm7",
        resave: false,
        cookie: {
          httpOnly: true,
          sameSite: "lax",
          maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        },
      })
    );
    const apolloServer = new ApolloServer({
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
      schema: await buildSchema({
        resolvers: [PostResolver, UserResolver],
      }),
      context: ({ req, res }): MyContext => ({
        manager: connection.manager,
        req,
        res,
      }),
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({
      app,
      cors: false,
    }); // --- /graphql endpoint
    const PORT = process.env.PORT || 4000;
    app.listen(4000, () => console.log(`Listening on PORT: ${PORT}`));
  } catch (error) {
    console.error(error);
  }
}

bootstrap(); // actually run the async function
