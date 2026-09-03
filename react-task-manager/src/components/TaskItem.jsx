import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTask, editTask, toggleTask } from '../redux/tasksSlice';

const PRIORITIES = ['High', 'Medium', 'Low'];

export default function TaskItem({ task }) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState(task.priority);

  const saveEdit = (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    dispatch(editTask({ id: task.id, title, priority }));
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setTitle(task.title);
    setPriority(task.priority);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className="task-card editing">
        <form className="edit-form" onSubmit={saveEdit}>
          <input
            aria-label="Edit task title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            autoFocus
          />
          <select
            aria-label="Edit priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            {PRIORITIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <div className="task-actions">
            <button className="text-button save" type="submit" disabled={!title.trim()}>
              Save
            </button>
            <button className="text-button" type="button" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className={task.completed ? 'task-card completed' : 'task-card'}>
      <button
        className="completion-toggle"
        type="button"
        onClick={() => dispatch(toggleTask(task.id))}
        aria-label={task.completed ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`}
        aria-pressed={task.completed}
      >
        {task.completed ? '✓' : ''}
      </button>

      <div className="task-content">
        <div className="task-title-row">
          <h3>{task.title}</h3>
          <span className={`priority-badge ${task.priority.toLowerCase()}`}>{task.priority}</span>
        </div>
        <p>{task.completed ? 'Completed' : 'In progress'}</p>
      </div>

      <div className="task-actions">
        <button className="text-button" type="button" onClick={() => setIsEditing(true)}>
          Edit
        </button>
        <button className="text-button danger" type="button" onClick={() => dispatch(deleteTask(task.id))}>
          Delete
        </button>
      </div>
    </li>
  );
}
