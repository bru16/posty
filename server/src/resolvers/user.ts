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
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { validateRegister } from "../utils/validateRegister";
import { RegisterInputFields } from "./RegisterInputFields";
import { v4 } from "uuid";
import { sendEmail } from "../utils/sendEmail";
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
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, manager }: MyContext) {
    if (!req.session.userId) return null;

    const user = await manager.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: RegisterInputFields,
    @Ctx() { manager, req }: MyContext
  ): Promise<UserResponse> {
    const exists = await manager.findOne(User, {
      username: options.username.toLowerCase(),
    });
    //check email already exists too, because its unique.
    if (exists) {
      return {
        errors: [
          {
            field: "username",
            message: "username is already taken",
          },
        ],
      };
    }
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(options.password);
    const user = manager.create(User, {
      email: options.email.toLowerCase(),
      username: options.username.toLowerCase(),
      password: hashedPassword,
    });
    await manager.save(user);

    req.session.userId = user.id;

    console.log(req.session.userId);
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { manager, req }: MyContext
  ): Promise<UserResponse> {
    const user = await manager.findOne(
      User,
      usernameOrEmail.includes("@")
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail }
    );

    if (!user)
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "username or email does not exist",
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

    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    try {
      req.session.destroy((res) => console.log(res)); //remove redis connection
      res.clearCookie(COOKIE_NAME);
      return true;
    } catch (error) {
      return false;
    }
  }

  @Mutation(() => UserResponse) // user logs in user after successfully changed password.
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis, req, manager }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 3) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "new password must be greater than 3",
          },
        ],
      };
    }
    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }
    const user = await manager.findOne(User, { id: parseInt(userId) });
    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }
    user.password = await argon2.hash(newPassword);
    await manager.save(User, user);

    //login
    await redis.del(key); // deletes token, so its no valid anymore
    req.session.userId = user.id;
    return { user: user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { manager, redis }: MyContext
  ) {
    const user = await manager.findOne(User, { email });
    if (!user) {
      //email doesnt exist
      return true;
    }
    const token = v4();
    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3 //3 days
    );

    await sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
    );
    return true;
  }
}
