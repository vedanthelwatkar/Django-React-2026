import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../../appConfig";

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/token/`, {
        username,
        password,
      });

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const getUser = createAsyncThunk(
  "getUser",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access");

      const response = axios.get(`${BASE_URL}/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getUsers = createAsyncThunk(
  "getUsers",
  async (page = 1, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access");

      const response = await axios.get(`${BASE_URL}/users/?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const createUser = createAsyncThunk(
  "user/createUser",
  async (payload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access");

      const response = await axios.post(`${BASE_URL}/users/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access");

      const response = await axios.put(`${BASE_URL}/user/${id}/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access");

      const response = await axios.delete(`${BASE_URL}/user/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

const User = createSlice({
  name: "User",
  initialState: {
    access: null,
    refresh: null,
    userData: null,
    users: [],
    loading: false,
    success: false,
    error: false,
  },

  reducers: {
    logout: (state) => {
      state.access = null;
      state.refresh = null;
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;

      localStorage.setItem("access", action.payload.access);
      localStorage.setItem("refresh", action.payload.refresh);
    });

    builder.addCase(getUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = false;
      state.userData = action.payload.data;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });

    builder.addCase(getUsers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = false;

      state.users = action.payload.results;
      state.total = action.payload.count;
      state.next = action.payload.next;
      state.previous = action.payload.previous;
    });

    builder.addCase(getUsers.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });

    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = false;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });

    builder.addCase(deleteUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = false;
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });

    builder.addCase(createUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = false;
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });
  },
});

export default User.reducer;
export const { logout } = User.actions;
