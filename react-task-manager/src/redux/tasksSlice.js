import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: {
      reducer(state, action) {
        state.items.unshift(action.payload);
      },
      prepare({ title, priority }) {
        return {
          payload: {
            id: nanoid(),
            title: title.trim(),
            priority,
            completed: false,
          },
        };
      },
    },
    editTask(state, action) {
      const { id, title, priority } = action.payload;
      const task = state.items.find((item) => item.id === id);
      if (task) {
        task.title = title.trim();
        task.priority = priority;
      }
    },
    deleteTask(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    toggleTask(state, action) {
      const task = state.items.find((item) => item.id === action.payload);
      if (task) task.completed = !task.completed;
    },
  },
});

export const { addTask, editTask, deleteTask, toggleTask } = tasksSlice.actions;
export default tasksSlice.reducer;
