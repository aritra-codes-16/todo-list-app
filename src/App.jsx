
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("todoTasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [taskInput, setTaskInput] = useState("");
  const [filter, setFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);

  // Save tasks whenever the task list changes
  useEffect(() => {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = (e) => {
    e.preventDefault();

    if (!taskInput.trim()) return;

    if (editingId !== null) {
      setTasks(
        tasks.map((task) =>
          task.id === editingId
            ? { ...task, text: taskInput.trim() }
            : task
        )
      );
      setEditingId(null);
    } else {
      const newTask = {
        id: Date.now(),
        text: taskInput.trim(),
        completed: false,
      };

      setTasks([...tasks, newTask]);
    }

    setTaskInput("");
  };

  // Mark task as completed or pending
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));

    if (editingId === id) {
      setEditingId(null);
      setTaskInput("");
    }
  };

  // Edit a task
  const editTask = (task) => {
    setTaskInput(task.text);
    setEditingId(task.id);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "Pending") return !task.completed;
    if (filter === "Completed") return task.completed;
    return true;
  });

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  return (
    <div className="app">
      <div className="todo-container">
        <h1>My To-Do List</h1>
        <p className="subtitle">
          Organize your day, one task at a time.
        </p>

        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            placeholder="Enter your task..."
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
          />

          <button type="submit">
            {editingId !== null ? "Update" : "Add Task"}
          </button>
        </form>

        <div className="task-summary">
          <span>Total: {tasks.length}</span>
          <span>Completed: {completedCount}</span>
          <span>Pending: {tasks.length - completedCount}</span>
        </div>

        <div className="filters">
          {["All", "Pending", "Completed"].map((item) => (
            <button
              key={item}
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <p className="empty-message">
              No tasks found. Add a new task!
            </p>
          ) : (
            filteredTasks.map((task) => (
              <div className="task-item" key={task.id}>
                <div className="task-info">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />

                  <span
                    className={
                      task.completed ? "completed" : ""
                    }
                  >
                    {task.text}
                  </span>
                </div>

                <div className="task-actions">
                  <button
                    className="edit-btn"
                    onClick={() => editTask(task)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
