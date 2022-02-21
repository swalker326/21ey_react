import React, { useState, useEffect, CSSProperties } from "react";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { Button, Container } from "react-bootstrap";
import { createBlog } from "./graphql/mutations";
import { listBlogs } from "./graphql/queries";

import awsExports from "./aws-exports";
import { ListBlogsQuery } from "./API";
import { useThemeMode } from "./useTheme";

Amplify.configure(awsExports);
const initialState = { name: "", body: "" };
interface StylesObject {
  [key: string]: CSSProperties;
}

const App = () => {
  const theme = useThemeMode();
  const [formState, setFormState] = useState(initialState);
  const [blogs, setBlogs] = useState<ListBlogsQuery>();

  useEffect(() => {
    fetchPosts();
  }, []);

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
  const toggleThemeMode = () => {
    theme.setMode(theme.mode === "dark" ? "light" : "dark");
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

  return (
    <Container
      fluid
      className={
        theme.mode === "dark" ? "bg-dark text-light" : "bg-light text-dark"
      }
    >
      <div id="wrapper" style={styles.container}>
        <h2 className="text-3xl font-bold underline">Amplify Todos</h2>

        <Button
          variant={theme.mode === "dark" ? "light" : "dark"}
          style={{ margin: "6px" }}
          onClick={toggleThemeMode}
        >
          {theme.mode === "dark" ? "Swith to Light" : "Switch to Dark"}
        </Button>
        <input
          onChange={handleInputChange}
          name="name"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={formState.name}
          placeholder="Name"
        />
        <input
          onChange={handleInputChange}
          name="body"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={formState.body}
          placeholder="Type your blog..."
        />
        <Button
          variant={theme.mode === "dark" ? "light" : "dark"}
          style={{ margin: "6px" }}
          onClick={addBlog}
        >
          Create Blog
        </Button>
        {blogs &&
          blogs?.listBlogs?.items?.map((blog, index) => {
            return (
              <div key={blog?.id || index} style={styles.todo}>
                <p style={styles.todoName}>{blog?.name}</p>
                <p style={styles.todoDescription}>{blog?.body}</p>
              </div>
            );
          })}
      </div>
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
