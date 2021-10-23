import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { createConnection } from "typeorm";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import express from "express";
import cors from "cors";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core/dist/plugin/landingPage/graphqlPlayground";
import { COOKIE_NAME } from "./constants";

async function bootstrap() {
  try {
    await createConnection();
    //await connection.runMigrations();
    const app = express();
    app.use(
      cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
      })
    );

    const RedisStore = connectRedis(session);
    const redis = new Redis(process.env.REDIS_URL);

    app.set("proxy", 1);
    app.use(
      session({
        name: COOKIE_NAME,
        store: new RedisStore({ client: redis, disableTouch: true }),
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET!,
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
        req,
        res,
        redis,
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
