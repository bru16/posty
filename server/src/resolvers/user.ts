import {
  Resolver,
  Query,
  Ctx,
  Arg,
  Mutation,
  ObjectType,
  Field,
  FieldResolver,
  Root,
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
@Resolver(User)
export class UserResolver {
  // current user can only see his/her email.
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    if (req.session.userId === user.id) return user.email;
    return "";
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) return null;
    return await User.findOne(req.session.userId);
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: RegisterInputFields,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const exists = await User.findOne({
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
    const user = User.create({
      email: options.email.toLowerCase(),
      username: options.username.toLowerCase(),
      password: hashedPassword,
    });
    await User.save(user);

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(
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

  @Mutation(() => UserResponse) // user logs in after successfully changed password.
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis, req }: MyContext
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

    const user = await User.findOne({ id: parseInt(userId) });
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
    await User.save(user);

    //login
    await redis.del(key); // deletes token, so its no valid anymore
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOne({ email });
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
