import React, { useState, useEffect, CSSProperties } from "react";
import "@aws-amplify/ui-react/styles.css";
import Amplify, { API, graphqlOperation, Auth } from "aws-amplify";
import { Container, Form, Row, Col } from "react-bootstrap";
import { createBlog } from "./graphql/mutations";
import { listBlogs } from "./graphql/queries";

import awsExports from "./aws-exports";
import { ListBlogsQuery } from "./API";
import { useThemeMode } from "./useTheme";
import { CognitoUserAmplify } from "@aws-amplify/ui-react/node_modules/@aws-amplify/ui";
import { Register } from "./features/register/Register";
import { ModeButton } from "./components/ModeButton";

Amplify.configure(awsExports);
const initialState = { name: "", body: "" };

const App = () => {
  const theme = useThemeMode();
  const [formState, setFormState] = useState(initialState);
  const [blogs, setBlogs] = useState<ListBlogsQuery>();
  const [userEmail, setUserEmail] = useState<string>();

  useEffect(() => {
    fetchPosts();
    getUserEmail();
  }, []);

  const signOut = async () => {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log("error signing out: ", error);
    }
  };
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
                <ModeButton style={{ margin: "6px" }} onClick={signOut}>
                  Sign Out
                </ModeButton>
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
                <ModeButton style={{ margin: "6px" }} onClick={addBlog}>
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

export default App;
