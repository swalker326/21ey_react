export interface RegisterFormProps {
  formInputState: {
    password: string;
    email: string;
    verificationCode: string;
  };
  setFormInputState: Dispatch<
    SetStateAction<FormInputState>
  >;
  formSubmit: () => void
}

export interface FormInputState {
  email: string,
  password: string,
  verificationCode: string
}

export type FormState = 'signUp' | 'confirmSignUp' | 'signIn' | 'signedIn'