import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

// POST /auth/register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password, role }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });
      return res.data; // { token, user }
    } catch (error) {
      const message =
        error.response?.data?.message || "Registration failed";
      return rejectWithValue(message);
    }
  }
);

// POST /auth/login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      return res.data; // { token, user }
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed";
      return rejectWithValue(message);
    }
  }
);

// POST /auth/logout
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await api.post("/auth/logout");
});

const initialState = {
  user: null,
  token: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Registration failed";
      })
      // login
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      })
      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = "idle";
        state.error = null;
      });
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;