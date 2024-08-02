import {
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword
} from "firebase/auth";

import { auth } from "../firebase/firebase";

export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result;
};

export const doSignOut = () => {
  return signOut(auth);
};

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordUpdate = (password) => {
  return updatePassword(auth.currentUser, password);
};

export const doUserUpdate = (user, updates) => {
  return user.updateProfile(updates);
};

export const doUserDelete = (user) => {
  return user.delete();
};

export const doUserUpdateEmail = (user, email) => {
  return user.updateEmail(email);
};

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`, // Use backticks for template literals
  });
};
