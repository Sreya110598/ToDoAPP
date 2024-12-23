import React from "react";

function ToDoItem({ task, toggleTask, deleteTask }) {
  return (
    <li>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={toggleTask}
      />
      <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
        {task.text}
      </span>
      <button onClick={deleteTask}>Delete</button>
    </li>
  );
}

export default ToDoItem;