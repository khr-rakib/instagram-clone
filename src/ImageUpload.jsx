import { Button, IconButton, Input, makeStyles } from "@material-ui/core";
import firebase from "firebase";
import { storage } from "./firebase";
import React, { useState } from "react";
import { db } from "./firebase";
import "./ImageUpload.css";
import { PhotoCamera } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
}));

const ImageUpload = ({ username }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const classes = useStyles();

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = (e) => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function ...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // error functionality ...
        console.log(error);
        alert(error.message);
      },
      () => {
        // complete function ...
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            // post image inside db
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });

            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };

  return (
    <div className="imageUpload">
      <div className="imageUpload__container">
        <div className="imageUpload__left">
          <Input
            className="imageUpload__input"
            type="text"
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Enter a caption..."
            value={caption}
          />
        </div>

        <div className="imageUpload__right">
          <label htmlFor="contained-button-file">
            <label htmlFor="icon-button-file">
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <PhotoCamera variant="contained" />
              </IconButton>
            </label>
          </label>
          <input
            accept="image/*"
            className={classes.input}
            id="icon-button-file"
            type="file"
            onChange={handleChange}
          />
        </div>
      </div>

      <progress
        style={{ display: `${progress > 0 ? "block" : ""}` }}
        className="imageUpload__progress"
        value={progress}
        max="100"
      ></progress>

      <Button
        color="primary"
        variant="contained"
        style={{ width: "100%", marginTop: "10px" }}
        onClick={handleUpload}
      >
        Upload
      </Button>
    </div>
  );
};

export default ImageUpload;
