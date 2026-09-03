import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import PriorityFilter from './components/PriorityFilter';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

export default function App() {
  const tasks = useSelector((state) => state.tasks.items);
  const [priorityFilter, setPriorityFilter] = useState('All');

  const visibleTasks = useMemo(() => {
    if (priorityFilter === 'All') return tasks;
    return tasks.filter((task) => task.priority === priorityFilter);
  }, [priorityFilter, tasks]);

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <span className="eyebrow">FEKRA coding test</span>
          <h1>Task Manager</h1>
          <p>Plan, prioritize, and complete work without losing your place.</p>
        </div>
        <div className="summary-card" aria-label="Task summary">
          <strong>{completedCount}/{tasks.length}</strong>
          <span>tasks completed</span>
        </div>
      </section>

      <section className="panel" aria-labelledby="add-task-heading">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Create</span>
            <h2 id="add-task-heading">Add a task</h2>
          </div>
        </div>
        <TaskForm />
      </section>

      <section className="panel" aria-labelledby="task-list-heading">
        <div className="section-heading list-heading">
          <div>
            <span className="eyebrow">Focus</span>
            <h2 id="task-list-heading">Your tasks</h2>
          </div>
          <PriorityFilter value={priorityFilter} onChange={setPriorityFilter} />
        </div>
        <TaskList tasks={visibleTasks} hasAnyTasks={tasks.length > 0} />
      </section>
    </main>
  );
}
