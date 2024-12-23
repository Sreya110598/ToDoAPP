import React, { useState, useEffect } from "react";

function Form({ onSubmit, editTask }) {
  const [task, setTask] = useState({ text: "", description: "" });

  useEffect(() => {
    if (editTask) setTask({ text: editTask.text, description: editTask.description });
  }, [editTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(task);
    setTask({ text: "", description: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        name="text"
        placeholder="Task Name"
        value={task.text}
        onChange={handleChange}
        required
        className="task-input"
      />
      <textarea
        name="description"
        placeholder="Task Description"
        value={task.description}
        onChange={handleChange}
        className="task-description"
      />
      <button type="submit" className="submit-btn">
        {editTask ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
}

export default Form;
