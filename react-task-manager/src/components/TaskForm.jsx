import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../redux/tasksSlice';

const PRIORITIES = ['High', 'Medium', 'Low'];

export default function TaskForm() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim()) return;

    dispatch(addTask({ title, priority }));
    setTitle('');
    setPriority('Medium');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="field field-grow">
        <label htmlFor="task-title">Task title</label>
        <input
          id="task-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What needs to be done?"
          autoComplete="off"
        />
      </div>

      <div className="field">
        <label htmlFor="task-priority">Priority</label>
        <select
          id="task-priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
          {PRIORITIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <button className="primary-button" type="submit" disabled={!title.trim()}>
        Add task
      </button>
    </form>
  );
}
