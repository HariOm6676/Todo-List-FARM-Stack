// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCBnSxV-HHtHsoXzAyo6TXC3Xq2G5MFWy8",
  authDomain: "todo-list-af537.firebaseapp.com",
  projectId: "todo-list-af537",
  storageBucket: "todo-list-af537.appspot.com",
  messagingSenderId: "386358035267",
  appId: "1:386358035267:web:b509193d34b73f5665a5f6",
  measurementId: "G-9K829H1CQW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth };

