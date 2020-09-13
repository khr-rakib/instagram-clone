import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAgqd4xxMVJdRAL7-rUAukqHkM4r0KxbC0",
  authDomain: "instagram-clone-633b8.firebaseapp.com",
  databaseURL: "https://instagram-clone-633b8.firebaseio.com",
  projectId: "instagram-clone-633b8",
  storageBucket: "instagram-clone-633b8.appspot.com",
  messagingSenderId: "259512213535",
  appId: "1:259512213535:web:df6eb42ca59350f354f52a",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
