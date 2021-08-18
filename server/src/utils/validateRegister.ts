import { RegisterInputFields } from "../resolvers/RegisterInputFields";

export const validateRegister = (values: RegisterInputFields) => {
  if (!values.email) {
    return [
      {
        field: "email",
        message: "email not provided",
      },
    ];
  }

  if (!values.username) {
    return [
      {
        field: "username",
        message: "username not provided",
      },
    ];
  }

  if (values.username.length <= 3) {
    return [
      {
        field: "username",
        message: "username length must be greater than 3",
      },
    ];
  }

  if (values.password.length <= 3) {
    return [
      {
        field: "password",
        message: "password length must be greater than 3",
      },
    ];
  }

  return null;
};
