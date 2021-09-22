import {
  Resolver,
  Query,
  Arg,
  Mutation,
  UseMiddleware,
  Ctx,
  Int,
  FieldResolver,
  Root,
  Field,
  ObjectType,
} from "type-graphql";
import { DeleteResult, getConnection, getManager } from "typeorm";
import { isAuth } from "../entity/middleware/isAuth";
import { Post } from "../entity/Post";
import { Vote } from "../entity/Vote";
import { MyContext } from "../types";

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];

  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textShortened(@Root() root: Post) {
    return root.text.slice(0, 50);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ): Promise<Boolean> {
    const { userId } = req.session;

    const vote = await Vote.findOne({ postId, userId });
    const isUpvote = value !== -1;
    const realValue = isUpvote ? 1 : -1;

    //transactions
    // change opinion, wants to upvote/downvote instead.
    if (vote && realValue !== vote.value) {
      await getManager().transaction(async (transactionalEntityManager) => {
        transactionalEntityManager.query(
          `
          update vote
          set value = $1
          where "postId" = $2 AND "userId" = $3
          `,
          [realValue, postId, userId]
        );

        transactionalEntityManager
          .createQueryBuilder()
          .update(Post)
          .set({ points: () => `points+${2 * realValue}` })
          .where("id = :id", { id: postId })
          .execute();
      });
    } else if (!vote) {
      await getManager().transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.insert(Vote, {
          userId,
          postId,
          value: realValue,
        });
        await transactionalEntityManager
          .createQueryBuilder()
          .update(Post)
          .set({ points: () => `points+${realValue}` })
          .where("id = :id", { id: postId })
          .execute();
      });
    }
    return true;
  }

  @Query(() => PaginatedPosts) //return array of posts.
  async posts(
    // pagination, orderded by new.
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Ctx() { req }: MyContext
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);

    const replacements: any[] = [realLimit + 1];

    if (req.session.userId) {
      replacements.push(req.session.userId);
    }
    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const posts = await getConnection().query(
      `
    select p.*,
    json_build_object(
      'id', u.id,
      'username', u.username,
      'email', u.email,
      'created_at', u.created_at,
      'updated_at', u.updated_at
    ) creator,
    ${
      req.session.userId
        ? '(select value from vote where "userId" = $2 and "postId" = p.id) "voteStatus"'
        : 'null as "voteStatus"'
    }
    from post p
    inner join public.user u on u.id = p."creatorId"
    ${cursor ? `where p."created_at" < $3` : ""}
    order by p."created_at" DESC
    limit $1
    `,
      replacements
    );

    /* const queryBuilder = getConnection()
      .getRepository(Post)
      .createQueryBuilder("post")
      .innerJoinAndSelect("post.creator", "creator")
      .orderBy("post.created_at", "DESC")
      .take(realLimit + 1); // take 1 more post to see if there's more posts to fetch. */

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimit + 1,
    };
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg("id") id: number): Promise<Post | undefined> {
    return await Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("title") title: string,
    @Arg("text") text: string,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({
      title,
      text,
      creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title") title: string
  ): Promise<Post | null> {
    const post = await Post.findOne(id);
    if (!post) {
      return null;
    }
    post.title = title;
    return await Post.save(post);
  }

  @Mutation(() => Post, { nullable: true })
  async deletePost(@Arg("id") id: number): Promise<DeleteResult> {
    return await Post.delete(id);
  }
}
