import React from "react";
import { FaTrash, FaEdit, FaCheck } from "react-icons/fa";

function ToDoList({ tasks, onToggle, onDelete, onEdit }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className="task-item">
          <div className="task-content">
            <span className={`status-badge ${task.status.toLowerCase().replace(" ", "-")}`}>{task.status}</span>
            <span
              className="task-title"
              style={{ textDecoration: task.completed ? "line-through" : "none" }}
            >
              {task.text}
            </span>
            <p className="task-description">{task.description}</p>
          </div>
          <div className="task-meta">
            <small>Created: {task.createdAt.toLocaleString()}</small>
            {task.updatedAt && <small>Updated: {task.updatedAt.toLocaleString()}</small>}
          </div>
          <div className="action-buttons">
            <button onClick={() => onToggle(task.id)} className="action-btn" title="Mark as Complete">
              <FaCheck />
            </button>
            <button onClick={() => onEdit(task)} className="action-btn" title="Edit Task">
              <FaEdit />
            </button>
            <button onClick={() => onDelete(task.id)} className="action-btn" title="Delete Task">
              <FaTrash />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ToDoList;
