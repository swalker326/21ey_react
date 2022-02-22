import React, { ChangeEvent } from "react";
import { Container } from "react-bootstrap";
import { RegisterFormProps } from "./@types";
import { Formik, Form, Field } from "formik";
import { object, string } from "yup";
import { ModeButton } from "../../components/ModeButton";

export const ConfirmSignUpForm = ({
  formInputState,
  setFormInputState,
  formSubmit,
}: RegisterFormProps) => {
  const ConfirmationFormSchema = object().shape({
    verificationCode: string().min(6).max(6),
  });
  const onChangeStateUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    setFormInputState({ ...formInputState, [e.target.name]: e.target.value });
  };
  return (
    <Container>
      <h2>Confirm Signup Here</h2>
      <Formik
        enableReinitialize
        initialValues={{
          verificationCode: formInputState.verificationCode,
        }}
        validationSchema={ConfirmationFormSchema}
        onSubmit={async (values, { setSubmitting }) => {
          console.log("values :", values);
          formSubmit();
          setSubmitting(false);
        }}
      >
        {({ handleChange }) => {
          return (
            <Container fluid>
              <Form>
                <Container
                  className="form-group"
                  style={{
                    width: "50%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Field
                    id="verificationCode"
                    type="text"
                    name="verificationCode"
                    value={formInputState.verificationCode}
                    placeholder="Verification Code"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(event);
                      onChangeStateUpdate(event);
                    }}
                    style={{ margin: "6px 0" }}
                  />
                </Container>
                <ModeButton type="submit" className="btn btn-primary btnblock mt-4">
                  Sumbit
                </ModeButton>
              </Form>
            </Container>
          );
        }}
      </Formik>
    </Container>
  );
};
