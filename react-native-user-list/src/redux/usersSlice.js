import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const CACHE_KEY = '@fekra-user-list/users-v1';
export const PAGE_SIZE = 5;

const transformUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  address: [user.address?.street, user.address?.city, user.address?.zipcode]
    .filter(Boolean)
    .join(', '),
});

export const loadCachedUsers = createAsyncThunk('users/loadCache', async () => {
  const raw = await AsyncStorage.getItem(CACHE_KEY);
  if (!raw) return [];

  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
});

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ page = 1 } = {}, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=${PAGE_SIZE}`,
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      return {
        page,
        users: data.map(transformUser),
      };
    } catch (error) {
      return rejectWithValue(error?.message || 'Unable to fetch users');
    }
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    page: 0,
    hasMore: true,
    status: 'idle',
    cacheStatus: 'idle',
    error: null,
  },
  reducers: {
    resetUsers(state) {
      state.items = [];
      state.page = 0;
      state.hasMore = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCachedUsers.pending, (state) => {
        state.cacheStatus = 'loading';
      })
      .addCase(loadCachedUsers.fulfilled, (state, action) => {
        state.cacheStatus = 'succeeded';
        if (state.items.length === 0 && action.payload.length > 0) {
          state.items = action.payload;
          state.page = Math.max(1, Math.ceil(action.payload.length / PAGE_SIZE));
        }
      })
      .addCase(loadCachedUsers.rejected, (state) => {
        state.cacheStatus = 'failed';
      })
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        const { users, page } = action.payload;
        const existingIds = new Set(state.items.map((user) => user.id));
        const uniqueUsers = users.filter((user) => !existingIds.has(user.id));

        if (page === 1) {
          state.items = users;
        } else {
          state.items.push(...uniqueUsers);
        }

        state.page = page;
        state.hasMore = users.length === PAGE_SIZE && (page === 1 || uniqueUsers.length > 0);
        state.status = 'succeeded';
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unable to fetch users';
      });
  },
});

export const { resetUsers } = usersSlice.actions;
export default usersSlice.reducer;
