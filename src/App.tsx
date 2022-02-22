import React, { useState, useEffect, CSSProperties } from "react";
import "@aws-amplify/ui-react/styles.css";
import Amplify, { API, graphqlOperation, Auth } from "aws-amplify";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import { createBlog } from "./graphql/mutations";
import { listBlogs } from "./graphql/queries";

import awsExports from "./aws-exports";
import { ListBlogsQuery } from "./API";
import { useThemeMode } from "./useTheme";
import {
  CognitoAttributes,
  CognitoUserAmplify,
} from "@aws-amplify/ui-react/node_modules/@aws-amplify/ui";
import { Register } from "./features/register/Register";
import { ModeButton } from "./components/ModeButton";

Amplify.configure(awsExports);
const initialState = { name: "", body: "" };
interface StylesObject {
  [key: string]: CSSProperties;
}

const App = () => {
  const theme = useThemeMode();
  const [formState, setFormState] = useState(initialState);
  const [blogs, setBlogs] = useState<ListBlogsQuery>();
  const [userEmail, setUserEmail] = useState<string>();

  useEffect(() => {
    fetchPosts();
    getUserEmail();
  }, []);
  const getUserEmail = () => {
    Auth.currentAuthenticatedUser({
      bypassCache: false,
    })
      .then((user: CognitoUserAmplify) => setUserEmail(user?.attributes?.email))
      .catch((err) => console.log(err));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [event.target.name]: event.target.value });
  };

  const fetchPosts = async () => {
    try {
      const blogData = (await API.graphql(graphqlOperation(listBlogs))) as {
        data: ListBlogsQuery;
      };
      setBlogs(blogData.data);
    } catch (err) {
      console.log("Error fetching blogs" + err);
    }
  };
  const addBlog = async () => {
    try {
      if (!formState.name || !formState.body) return;
      const blog = { ...formState };
      if (blogs) {
        await API.graphql(graphqlOperation(createBlog, { input: blog }));
        await fetchPosts();
        setFormState(initialState);
      }
    } catch (err) {
      console.log("error creating blog: ", err);
    }
  };
  const handleSwitchChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    theme.setMode(evt.target.checked ? "light" : "dark");
  };

  return (
    <Container
      fluid
      className={
        theme.mode === "dark" ? "bg-dark text-light" : "bg-light text-dark"
      }
    >
      <Form.Check
        onChange={handleSwitchChange}
        className="darkmode-switch"
        type="switch"
        checked={theme.mode === "dark" ? false : true}
        id="custom-switch"
        label={theme.mode === "dark" ? "Light Mode" : "Dark Mode"}
      />
      <Register>
        <div id="wrapper">
          <Container style={{ maxWidth: "720px" }}>
            <h2>Amplify Blogs</h2>
            <h4>{userEmail}</h4>
            <Row>
              <Col>
                <div className="m-0 d-flex align-items-center">
                  <ModeButton
                    style={{ margin: "6px" }}
                    // #TODO Add logic to sign out
                    // onClick={signOut}
                  >
                    Sign Out
                  </ModeButton>
                </div>
                <Form.Control
                  onChange={handleInputChange}
                  name="name"
                  style={{ margin: "6px" }}
                  value={formState.name}
                  placeholder="Name"
                />
                <Form.Control
                  onChange={handleInputChange}
                  style={{ margin: "6px" }}
                  name="body"
                  value={formState.body}
                  placeholder="Type your blog..."
                />
                <ModeButton
                  style={{ margin: "6px" }}
                  onClick={addBlog}
                >
                  Create Blog
                </ModeButton>
              </Col>
            </Row>
            <Row>
              {blogs &&
                blogs?.listBlogs?.items?.map((blog, index) => {
                  return (
                    <Container key={blog?.id || index}>
                      <p>{blog?.name}</p>
                      <p>{blog?.body}</p>
                    </Container>
                  );
                })}
            </Row>
          </Container>
        </div>
      </Register>
    </Container>
  );
};
const styles: StylesObject = {
  container: {
    width: 400,
    margin: "0 auto",
    display: "flex",
    //real weird issue: https://github.com/cssinjs/jss/issues/1344
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
  },
  todo: { marginBottom: 15 },
  input: {
    border: "none",
    backgroundColor: "#ddd",
    marginBottom: 10,
    padding: 8,
    fontSize: 18,
  },
  todoName: { fontSize: 20, fontWeight: "bold" },
  todoDescription: { marginBottom: 0 },
  button: {
    backgroundColor: "black",
    color: "white",
    outline: "none",
    fontSize: 18,
    padding: "12px 0px",
  },
};

export default App;
