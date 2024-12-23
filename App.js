import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";

const API_URL = "https://jsonplaceholder.typicode.com/todos";

const TaskInput = ({ onAddTask }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (taskTitle.trim() && description.trim()) {
      await onAddTask(taskTitle, description);
      setTaskTitle("");
      setDescription("");
      toast.success("Task added successfully!");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        placeholder="Task Title"
        style={{ padding: "10px", width: "40%", marginRight: "10px" }}
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        style={{ padding: "10px", width: "40%", marginRight: "10px" }}
      />
      <button type="submit" style={{ padding: "10px" }}>Add Task</button>
    </form>
  );
};

const TaskList = ({ tasks, onComplete, onEdit, onDelete }) => {
  return (
    <div>
      {tasks.map((task) => (
        <div
          key={task.id}
          style={{
            display: "flex",
            flexDirection: "column",
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <div><strong>Title:</strong> {task.title}</div>
          <div><strong>Description:</strong> {task.description}</div>
          <div><strong>Created:</strong> {task.createdAt}</div>
          <div><strong>Updated:</strong> {task.updatedAt}</div>
          <div><strong>Status:</strong> {task.status}</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => onComplete(task.id)} style={{ backgroundColor: "green", color: "#fff" }}>✔</button>
            <button onClick={() => onEdit(task)} style={{ backgroundColor: "blue", color: "#fff" }}>✎</button>
            <button onClick={() => onDelete(task.id)} style={{ backgroundColor: "red", color: "#fff" }}>🗑</button>
            <Link to={`/task/${task.id}`} style={{ backgroundColor: "purple", color: "#fff", padding: "5px 10px", textDecoration: "none" }}>View Details</Link>
          </div>
        </div>
      ))}
    </div>
  );
};

const TaskDetails = ({ tasks }) => {
  const { id } = useParams();
  const task = tasks.find((t) => t.id === parseInt(id));

  if (!task) {
    return <div style={{ textAlign: "center", color: "red" }}>Task not found</div>;
  }

  return (
    <div>
      <h2>Task Details</h2>
      <div><strong>Title:</strong> {task.title}</div>
      <div><strong>Description:</strong> {task.description}</div>
      <div><strong>Created:</strong> {task.createdAt}</div>
      <div><strong>Updated:</strong> {task.updatedAt}</div>
      <div><strong>Status:</strong> {task.status}</div>
    </div>
  );
};

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API_URL}?_limit=20`);
        const data = await response.json();
        const formattedTasks = data.map((task) => ({
          ...task,
          description: "Sample Description",
          createdAt: new Date().toLocaleString(),
          updatedAt: new Date().toLocaleString(),
          status: "To Do",
        }));
        setTasks(formattedTasks);
      } catch (error) {
        toast.error("Failed to fetch tasks");
      }
    };

    fetchTasks();
  }, []);

  const addTask = async (title, description) => {
    const currentTime = new Date().toLocaleString();
    const newTask = {
      id: Date.now(),
      title,
      description,
      createdAt: currentTime,
      updatedAt: currentTime,
      status: "To Do",
    };
    setTasks((prevTasks) =>
      [newTask, ...prevTasks].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  };

  const completeTask = async (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: "Completed" } : task
      )
    );
    toast.success("Task marked as complete!");
  };

  const deleteTask = async (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    toast.success("Task deleted successfully!");
  };

  const editTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const updateTask = async (id, newTitle, newDescription) => {
    const currentTime = new Date().toLocaleString();
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            title: newTitle,
            description: newDescription,
            updatedAt: currentTime,
          }
        : task
    );
    const updatedTask = updatedTasks.find((task) => task.id === id);
    const sortedTasks = [updatedTask, ...updatedTasks.filter((t) => t.id !== id)];
    setTasks(sortedTasks);
    setIsModalOpen(false); 
    setEditingTask(null); 
    toast.success("Task updated successfully!");
  };

  return (
    <Router>
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center" }}>To-Do App</h1>
        
        <Routes>
          <Route
            path="/"
            element={
              <>
                <TaskInput onAddTask={addTask} />
                <TaskList
                  tasks={tasks}
                  onComplete={completeTask}
                  onEdit={editTask}
                  onDelete={deleteTask}
                />
              </>
            }
          />
          <Route path="/task/:id" element={<TaskDetails tasks={tasks} />} />
        </Routes>

        {isModalOpen && editingTask && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#fff",
              padding: "20px",
              border: "1px solid #ccc",
              zIndex: 1000,
              width: "300px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3>Edit Task</h3>
            <input
              type="text"
              value={editingTask.title}
              onChange={(e) =>
                setEditingTask({ ...editingTask, title: e.target.value })
              }
              style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
            />
            <input
              type="text"
              value={editingTask.description}
              onChange={(e) =>
                setEditingTask({ ...editingTask, description: e.target.value })
              }
              style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
            />
            <button
              onClick={() =>
                updateTask(
                  editingTask.id,
                  editingTask.title,
                  editingTask.description
                )
              }
              style={{
                marginTop: "10px",
                padding: "10px",
                width: "100%",
                backgroundColor: "blue",
                color: "#fff",
                border: "none",
              }}
            >
              Save
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                marginTop: "10px",
                padding: "10px",
                width: "100%",
                backgroundColor: "gray",
                color: "#fff",
                border: "none",
              }}
            >
              Cancel
            </button>
          </div>
        )}
        <Toaster />
      </div>
    </Router>
  );
};

export default App;
