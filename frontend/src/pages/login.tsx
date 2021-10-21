import React from "react";
import LoginForm from "../components/LoginForm";
import NavBar from "../components/NavBar";
import withApollo from "../utils/apolloServer";

const Login = () => {
  return (
    <>
      <NavBar />
      <LoginForm />
    </>
  );
};
export default withApollo({ ssr: false })(Login);
