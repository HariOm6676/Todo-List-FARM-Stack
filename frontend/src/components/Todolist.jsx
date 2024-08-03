import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../assets/styles/TodoList.css"; // Separate CSS file for TodoList styles
import { auth } from "../firebase/firebase"; // Adjust the path if necessary

const VideoBackground = () => (
  <video
    autoPlay
    loop
    muted
    className="position-fixed w-100 h-100"
    style={{ objectFit: "cover", zIndex: -1 }}
  >
    <source
      src="https://videos.pexels.com/video-files/5717426/5717426-hd_1920_1080_25fps.mp4"
      type="video/mp4"
    />
    Your browser does not support the video tag.
  </video>
);

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [newDate, setNewDate] = useState(new Date());
  const [newTime, setNewTime] = useState("");
  const [quote, setQuote] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken().then((idToken) => {
          setToken(idToken);
          fetchTodos(idToken);
        });
      }
    });

    fetchRandomQuote();

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, []);

  const fetchTodos = (idToken) => {
    axios
      .get("https://todo-list-farm-stack.onrender.com/todos", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      })
      .then((response) => setTodos(response.data))
      .catch((error) => console.error("Error fetching todos:", error));
  };

  const fetchRandomQuote = () => {
    axios
      .get("https://api.quotable.io/random")
      .then((response) => setQuote(response.data.content))
      .catch((error) => console.error("Error fetching quote:", error));
  };

  const addTodo = () => {
    if (!newTodo) {
      alert("Todo cannot be empty");
      return;
    }
    const formattedDate = newDate.toISOString().split("T")[0];
    axios
      .post(
        "https://todo-list-farm-stack.onrender.com/todos",
        {
          text: newTodo,
          completed: false,
          date: formattedDate,
          time: newTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setTodos([...todos, response.data]);
        setNewTodo("");
        setNewDate(new Date());
        setNewTime("");
      })
      .catch((error) => console.error("Error adding todo:", error));
  };

  const toggleComplete = (id, completed) => {
    axios
      .put(
        `https://todo-list-farm-stack.onrender.com/todos/${id}`,
        { completed: !completed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
      })
      .catch((error) => console.error("Error updating todo:", error));
  };

  const deleteTodo = (id) => {
    axios
      .delete(`https://todo-list-farm-stack.onrender.com/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setTodos(todos.filter((todo) => todo._id !== id));
      })
      .catch((error) => console.error("Error deleting todo:", error));
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <VideoBackground />
      <div
        className="container position-relative p-5 rounded"
        style={{ background: "transparent", boxShadow: "none" }}
      >
        <div
          className="mb-4 p-4 rounded border border-dark shadow"
          style={{
            background: "rgba(255, 255, 255, 0.65)",
          }}
        >
          <blockquote className="blockquote mb-0">
            <p className="mb-0 text-center" style={{ fontStyle: "italic" }}>
              "{quote}"
            </p>
          </blockquote>
        </div>
        <div
          className="content-wrapper"
          style={{
            maxHeight: "70vh",
            overflowY: "auto",
            background: "transparent",
            padding: "1rem",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h1
            className="text-center mb-4"
            style={{
              color: "black",
              fontFamily: "'Cursive', sans-serif",
              fontWeight: "bold",
              fontSize: "2.5rem",
            }}
          >
            Todo List
          </h1>
          <form className="mb-4" style={{ width: "100%" }}>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Add new todo"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                className="form-control custom-input"
              />
            </div>
            <div className="mb-3 row gx-2">
              <div className="col">
                <DatePicker
                  selected={newDate}
                  onChange={(date) => setNewDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="form-control custom-input"
                  minDate={new Date()} // Prevent selecting dates before today
                />
              </div>

              <div className="col">
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="form-control custom-input"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={addTodo}
              className="btn btn-dark w-100"
            >
              Add Todo
            </button>
          </form>
          <ul className="list-group">
            {todos.map((todo) => (
              <li
                key={todo._id}
                className="list-group-item d-flex justify-content-between align-items-center"
                style={{
                  background: "rgba(255, 255, 255, 0.4)",
                  borderRadius: "0.5rem",
                }}
              >
                <div>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => deleteTodo(todo._id, todo.completed)}
                    className="mr-2"
                  />
                  <span
                    className={todo.completed ? "completed" : ""}
                    style={{
                      fontFamily: "FancyFont",
                      marginLeft: "10px",
                      color: "black",
                      fontSize: "1.2em",
                    }}
                  >
                    {todo.text}
                  </span>
                  <div
                    style={{
                      fontSize: "1.0em",
                      color: "black",
                      fontFamily: "FancyFont",
                    }}
                  >
                    {todo.date} {todo.time}
                  </div>
                </div>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteTodo(todo._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
