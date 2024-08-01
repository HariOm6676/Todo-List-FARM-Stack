import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

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

  useEffect(() => {
    axios
      .get("http://localhost:8000/todos")
      .then((response) => setTodos(response.data))
      .catch((error) => console.error("Error fetching todos:", error));

    fetchRandomQuote();
  }, []);

  const fetchRandomQuote = () => {
    axios
      .get("https://api.quotable.io/random")
      .then((response) => setQuote(response.data.content))
      .catch((error) => console.error("Error fetching quote:", error));
  };

  const addTodo = () => {
    const formattedDate = newDate.toISOString().split("T")[0];
    axios
      .post("http://localhost:8000/todos", {
        text: newTodo,
        completed: false,
        date: formattedDate,
        time: newTime,
      })
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
      .put(`http://localhost:8000/todos/${id}`, { completed: !completed })
      .then((response) => {
        setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
      })
      .catch((error) => console.error("Error updating todo:", error));
  };

  const deleteTodo = (id) => {
    axios
      .delete(`http://localhost:8000/todos/${id}`)
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
        <div className="form-container">
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
            <button type="button" onClick={addTodo} className="btn btn-dark w-100">
              Add Todo
            </button>
          </form>
        </div>
        <ul className="list-group">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className={`list-group-item d-flex justify-content-between align-items-center ${
                todo.completed ? "list-group-item-success" : "list-group-item-danger"
              }`}
              style={{ background: "rgba(0, 0, 0, 0.5)", color: "white" }}
            >
              <span
                className={`flex-fill ${
                  todo.completed ? "text-decoration-line-through" : ""
                }`}
                onClick={() => toggleComplete(todo._id, todo.completed)}
                role="button"
              >
                {todo.text} - {todo.date} {todo.time}
              </span>
              <button onClick={() => deleteTodo(todo._id)} className="btn btn-danger btn-sm">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
