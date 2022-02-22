import React, { ChangeEvent } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ModeButton } from "../../components/ModeButton";
import { RegisterFormProps } from "./@types";
import { Formik, Form, Field } from "formik";
import { object, string } from "yup";

export const SignInForm = ({
  setFormInputState,
  formSubmit,
  formInputState,
}: RegisterFormProps) => {
  const SignUpFormSchema = object().shape({
    email: string().email("Invalid email address format").required("Required"),
    password: string(),
  });
  const onChangeStateUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    setFormInputState({ ...formInputState, [e.target.name]: e.target.value });
  };
  return (
    <Container>
      <Row>
        <Col lg>
          <Row>
            <Col lg>
              <h1 className="mt-5">Sign In Form</h1>
            </Col>
          </Row>
          <Formik
            enableReinitialize
            initialValues={{
              email: "",
              password: "",
              status: "idle",
            }}
            validationSchema={SignUpFormSchema}
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
                        type="email"
                        id="email"
                        name="email"
                        value={formInputState.email}
                        placeholder="Enter email"
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                          handleChange(event);
                          onChangeStateUpdate(event);
                        }}
                        style={{ margin: "6px 0" }}
                      />

                      <Field
                        id="password"
                        type="password"
                        name="password"
                        value={formInputState.password}
                        placeholder="Enter password"
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                          handleChange(event);
                          onChangeStateUpdate(event);
                        }}
                        style={{ margin: "6px 0" }}
                      />
                    </Container>
                    <ModeButton
                      type="submit"
                      className="btn btn-primary btnblock mt-4"
                    >
                      Sumbit
                    </ModeButton>
                  </Form>
                </Container>
              );
            }}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};
