import React, { useState, useEffect } from "react";
import { FormInputState, FormState } from "./@types";
import { Auth } from "aws-amplify";
import { Container } from "react-bootstrap";
import { SignUpForm } from "./SignUpForm";
import { ConfirmSignUpForm } from "./ConfirmSignUpForm";
import { SignInForm } from "./SignInForm";

export const Register: React.FC = ({ children }) => {
  const initialFormValues: FormInputState = {
    password: "",
    email: "",
    verificationCode: "",
  };
  const isAuthtenicated = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      return currentUser;
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    isAuthtenicated().then((user) => {
      console.log(user);
      if (user) {
        setFormState("signedIn");
      } else {
        setFormState("signIn");
      }
    });
  });

  const [formState, setFormState] = useState<FormState>("signIn");
  const [formInputState, setFormInputState] =
    useState<FormInputState>(initialFormValues);

  const signup = async () => {
    console.log(formInputState);
    try {
      await Auth.signUp({
        username: formInputState.email,
        password: formInputState.password,
        attributes: {
          email: formInputState.email,
        },
      });
      /* Once the user successfully signs up, update form state to show the confirm sign up form for MFA */
      setFormState("confirmSignUp");
    } catch (err) {
      console.log({ err });
    }
  };
  const confirmSignUp = async () => {
    try {
      await Auth.confirmSignUp(
        formInputState.email,
        formInputState.verificationCode,
      );
      /* Once the user successfully confirms their account, update form state to show the sign in form*/
      setFormState("signIn");
    } catch (err) {
      console.log({ err });
    }
  };

  const signin = async () => {
    try {
      await Auth.signIn(formInputState.email, formInputState.password);
      setFormState("signedIn");
    } catch (err) {
      console.log({ err });
    }
  };

  if (formState === "signUp")
    return (
      <SignUpForm
        formInputState={formInputState}
        setFormInputState={setFormInputState}
        formSubmit={signup}
      />
    );
  if (formState === "signIn")
    return (
      <SignInForm
        formInputState={formInputState}
        setFormInputState={setFormInputState}
        formSubmit={signin}
      />
    );
  if (formState === "confirmSignUp")
    return (
      <ConfirmSignUpForm
        formInputState={formInputState}
        setFormInputState={setFormInputState}
        formSubmit={confirmSignUp}
      />
    );
  return <Container fluid>{children}</Container>;
};
