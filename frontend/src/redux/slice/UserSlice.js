import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../../appConfig";

const getCsrf = () => {
  axios.get(`${BASE_URL}/get-csrf`, { withCredentials: true });
};

export const getUser = createAsyncThunk(
  "getUser",
  async (id, { rejectWithValue }) => {
    try {
      getCsrf();

      const csrf = document.cookie
        .split("; ")
        .find((c) => c.startsWith("csrftoken="))
        ?.split("=")[1];

      const response = axios.get(`${BASE_URL}/user/${id}`, {
        headers: { "X-CSRFtoken": csrf },
        withCredentials: true,
      });
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getUsers = createAsyncThunk(
  "getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const csrf = document.cookie
        .split("; ")
        .find((c) => c.startsWith("csrftoken="))
        ?.split("=")[1];

      const response = axios.get(`${BASE_URL}/users`, {
        headers: { "X-CSRFtoken": csrf },
        withCredentials: true,
      });
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const createUser = createAsyncThunk(
  "user/createUser",
  async (payload, { rejectWithValue }) => {
    try {
      const csrf = document.cookie
        .split("; ")
        .find((c) => c.startsWith("csrftoken="))
        ?.split("=")[1];

      const response = await axios.post(`${BASE_URL}/users/`, payload, {
        headers: { "X-CSRFToken": csrf },
        withCredentials: true,
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
      const csrf = document.cookie
        .split("; ")
        .find((c) => c.startsWith("csrftoken="))
        ?.split("=")[1];

      const response = await axios.put(`${BASE_URL}/user/${id}/`, payload, {
        headers: { "X-CSRFToken": csrf },
        withCredentials: true,
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
      const csrf = document.cookie
        .split("; ")
        .find((c) => c.startsWith("csrftoken="))
        ?.split("=")[1];

      const response = await axios.delete(`${BASE_URL}/user/${id}/`, {
        headers: { "X-CSRFToken": csrf },
        withCredentials: true,
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
    userData: null,
    users: [],
    loading: false,
    success: false,
    error: false,
  },
  reducers: {},
  extraReducers: (builder) => {
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
      state.users = action.payload.data;
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
