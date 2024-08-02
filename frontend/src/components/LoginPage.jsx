import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Google } from "react-bootstrap-icons"; // You can use any other Google icon you like
import "../assets/styles/LoginPage.css"; // Import styles for the login page
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../auth/auth"; // Import from auth.js

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
    <Container
      className="login-container my-5 p-4 rounded shadow-lg"
      style={{ maxWidth: "400px" }}
    >
      <h2 className="text-center mb-4">Login</h2>
      {error && <p className="text-danger text-center">{error}</p>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            required
            className="custom-input"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
            required
            className="custom-input"
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="w-100 mb-3"
          id="custom-btn"
        >
          Sign In
        </Button>

        <Button
          variant="outline-danger"
          className="w-100 d-flex align-items-center justify-content-center"
          id="custom-google-btn"
          onClick={handleGoogleSignIn}
        >
          <Google className="me-2" />
          Sign In with Google
        </Button>
      </Form>
    </Container>
  );
};

export default LoginPage;
