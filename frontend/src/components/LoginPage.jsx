// src/components/LoginPage.jsx
import React, { useState } from "react";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../auth/auth"; // Import from auth.js
import "./LoginPage.css"; // Import styles for the login page

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await doSignInWithEmailAndPassword(email, password);
      onLoginSuccess(); // Call the callback function on successful login
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await doSignInWithGoogle();
      onLoginSuccess(); // Call the callback function on successful Google login
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
      <button onClick={handleGoogleSignIn}>Sign In with Google</button>
    </div>
  );
};

export default LoginPage;
