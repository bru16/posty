import { Resolver, Query, Ctx, Arg, Mutation } from "type-graphql";
import { DeleteResult } from "typeorm";
import { Post } from "../entity/Post";
import { MyContext } from "../types";

@Resolver()
export class PostResolver {
  @Query(() => [Post]) //return array of posts.
  async posts(@Ctx() { manager }: MyContext): Promise<Post[]> {
    return await manager.find(Post);
  }

  @Query(() => Post, { nullable: true })
  async post(
    @Arg("id") id: number,
    @Ctx() { manager }: MyContext
  ): Promise<Post | undefined> {
    return await manager.findOne(Post, id);
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
    @Ctx() { manager }: MyContext
  ): Promise<Post> {
    const post = manager.create(Post, { title });
    await manager.save(post);
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title") title: string,
    @Ctx() { manager }: MyContext
  ): Promise<Post | null> {
    const post = await manager.findOne(Post, id);
    if (!post) {
      return null;
    }
    post.title = title;
    return await manager.save(post);
  }

  @Mutation(() => Post, { nullable: true })
  async deletePost(
    @Arg("id") id: number,
    @Ctx() { manager }: MyContext
  ): Promise<DeleteResult> {
    return await manager.delete(Post, id);
  }
}
