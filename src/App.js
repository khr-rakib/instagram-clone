import { Button, Input, makeStyles, Modal } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./App.css";
import { auth, db } from "./firebase";
import ImageUpload from "./ImageUpload";
import Post from "./Post";
import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [signUpUser, setSignUpUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {
          // don't update username
        } else {
          return authUser.updateProfile({
            // if we just created someone
            displayName: signUpUser.username,
          });
        }
      } else {
        // user has logged out
        setUser(null);
      }
    });

    return () => {
      // perform some cleanup actions
      unsubscribe();
    };
  }, [user, signUpUser.username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const handleInputChange = (e) => {
    setSignUpUser({
      ...signUpUser,
      [e.target.name]: e.target.value,
    });
  };

  const signUp = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(signUpUser.email, signUpUser.password)
      .then()
      .catch((err) => alert(err.message));
  };

  const signIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(signUpUser.email, signUpUser.password)
      .catch((err) => alert(err.message));

    setOpenSignIn(false);
  };

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <form onSubmit={signUp}>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              />
              <Input
                type="text"
                placeholder="username"
                value={signUpUser.username}
                onChange={handleInputChange}
                name="username"
                className="signup__input"
              />
              <Input
                type="email"
                placeholder="email address"
                value={signUpUser.email}
                onChange={handleInputChange}
                name="email"
                className="signup__input"
              />
              <Input
                type="password"
                placeholder="password"
                value={signUpUser.password}
                onChange={handleInputChange}
                name="password"
                className="signup__input"
              />
              <Button variant="contained" color="primary" type="submit">
                Sign Up
              </Button>
            </form>
          </center>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <form onSubmit={signIn}>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                width="90"
              />
              <Input
                type="email"
                placeholder="email address"
                value={signUpUser.email}
                onChange={handleInputChange}
                name="email"
                className="signup__input"
              />
              <Input
                type="password"
                placeholder="password"
                value={signUpUser.password}
                onChange={handleInputChange}
                name="password"
                className="signup__input"
              />
              <Button variant="contained" color="primary" type="submit">
                Sign In
              </Button>
            </form>
          </center>
        </div>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          width="90"
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Log Out</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry! you need to login to upload.</h3>
      )}

      <div className="app__posts">
        <div className="app__postsLeft">
          {posts.map(({ post, id }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>

        <div className="app__postRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/CDbyFXahXnN/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
          <InstagramEmbed
            url="https://www.instagram.com/p/CEwB0f-ng1K"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
