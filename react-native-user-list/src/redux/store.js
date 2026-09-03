import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import usersReducer, { CACHE_KEY } from './usersSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
  },
});

let lastSerialized = null;

store.subscribe(() => {
  const items = store.getState().users.items;
  if (items.length === 0) return;

  const serialized = JSON.stringify(items);
  if (serialized === lastSerialized) return;

  lastSerialized = serialized;
  AsyncStorage.setItem(CACHE_KEY, serialized).catch(() => {
    // The in-memory Redux state remains usable even if caching fails.
  });
});
