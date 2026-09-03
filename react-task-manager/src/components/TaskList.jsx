import TaskItem from './TaskItem';

export default function TaskList({ tasks, hasAnyTasks }) {
  if (!hasAnyTasks) {
    return (
      <div className="empty-state">
        <strong>No tasks yet.</strong>
        <span>Add your first task above.</span>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <strong>No matching tasks.</strong>
        <span>Try another priority filter.</span>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
