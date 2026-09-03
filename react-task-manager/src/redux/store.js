import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';

const STORAGE_KEY = 'fekra-task-manager-tasks';

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return undefined;

    return { tasks: { items: parsed } };
  } catch {
    return undefined;
  }
}

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
  preloadedState: loadTasks(),
});

store.subscribe(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store.getState().tasks.items));
  } catch {
    // Persistence failure should not block the app itself.
  }
});
