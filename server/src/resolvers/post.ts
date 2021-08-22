import {
  Resolver,
  Query,
  Arg,
  Mutation,
  UseMiddleware,
  Ctx,
} from "type-graphql";
import { DeleteResult } from "typeorm";
import { isAuth } from "../entity/middleware/isAuth";
import { Post } from "../entity/Post";
import { MyContext } from "../types";
@Resolver()
export class PostResolver {
  @Query(() => [Post]) //return array of posts.
  async posts(): Promise<Post[]> {
    return await Post.find(Post);
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
