import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../config/axiosConfig";
import Swal from "sweetalert2";

interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  password: string;
}

interface AuthState {
  loading: boolean;
  error: string | null;
  success: string | null;
  user: any | null;
  token: string | null;
}

// ✅ safe parser for localStorage
const getStoredUser = () => {
  return localStorage.getItem("token");
};

const initialState: AuthState = {
  loading: false,
  error: null,
  success: null,
  user: getStoredUser(),
  token: localStorage.getItem("token") || null,
};

// Async thunk for register
export const registerUser = createAsyncThunk(
  "auth/register",
  async (data: RegisterPayload, { rejectWithValue }) => {
    try {
      const res = await api.post("auth/register", data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("auth/login", credentials);
      console.log(response.data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Invalid email or password"
      );
    }
  }
);

// Async thunk for Logout
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, {getState , rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      console.log(token);

      await api.post("auth/logout",{},{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return true;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// Async thunk for forgotPassword
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const { data } = await api.post("auth/forgot-password", { email });
      Swal.fire({
        position: "top",
        icon: "success",
        title: data.message || "Password reset link sent to your email",
        showConfirmButton: false,
        timer: 2000,
      });
      return data;
    } catch (err: any) {
      Swal.fire({
        position: "top",
        icon: "error",
        title: err.response?.data?.message || "Something went wrong",
        showConfirmButton: false,
        timer: 2000,
      });
      return rejectWithValue(err.response?.data);
    }
  }
);

// Async thunk for reset-password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ password }: { password: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`auth/reset-password`, { password });
      Swal.fire({
        position: "top",
        icon: "success",
        title: data.message || "Password has been reset successfully",
        showConfirmButton: false,
        timer: 2000,
      });
      return data;
    } catch (err: any) {
      Swal.fire({
        position: "top",
        icon: "error",
        title: err.response?.data?.message || "Something went wrong",
        showConfirmButton: false,
        timer: 2000,
      });
      return rejectWithValue(err.response?.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.token = action.payload.data.accessToken;

        // save the user data and token
        console.log(action.payload.data.accessToken);
        localStorage.setItem("token", action.payload.data.accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // forgot-password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state) => {
        state.loading = false;
      })

      // reset-password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;
