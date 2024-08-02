// src/App.jsx

import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import TodoList from "./components/Todolist";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<AuthSwitch />} />
            {/* Add more routes here if needed */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

const AuthSwitch = () => {
  const { userLoggedIn } = useAuth();
  console.log(userLoggedIn + "Harry");
  return userLoggedIn ? <TodoList /> : <LoginPage />;
};

export default App;
