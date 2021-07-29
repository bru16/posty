import {
  Resolver,
  Query,
  Ctx,
  Arg,
  Mutation,
  ObjectType,
  Field,
} from "type-graphql";
import { User } from "../entity/User";
import { MyContext } from "../types";
import * as argon2 from "argon2";

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}
Resolver();
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { manager }: MyContext
  ) {
    const hashedPassword = await argon2.hash(password);
    const user = manager.create(User, {
      username: username.toLowerCase(),
      password: hashedPassword,
    });
    await manager.save(user);
    return user;
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { manager }: MyContext
  ): Promise<UserResponse> {
    const user = await manager.findOne(User, {
      username: username.toLowerCase(),
    });

    if (!user)
      return {
        errors: [
          {
            field: "username",
            message: "username does not exist",
          },
        ],
      };
    const passwordMatches = await argon2.verify(user.password, password);
    if (!passwordMatches)
      return {
        errors: [
          {
            field: "password",
            message: "password does not match.",
          },
        ],
      };
    return { user };
  }
}
