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
  refreshToken: string | null;
}

// ✅ safe parser for localStorage
const getStoredToken = () => localStorage.getItem("token");
const getStoredRefreshToken = () => localStorage.getItem("refreshToken");

const initialState: AuthState = {
  loading: false,
  error: null,
  success: null,
  user: getStoredToken(),
  token: getStoredToken(),
  refreshToken : getStoredRefreshToken()
};

// Async thunk for register
export const registerUser = createAsyncThunk(
  "auth/register",
  async (data: RegisterPayload, { rejectWithValue }) => {
    try {
      const res = await api.post("auth/register", data);
      console.log(res.data);
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

// Add a new async thunk for refreshing token
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const state: any = getState();
      const refreshToken = state.auth.refreshToken;

      const response = await api.post("auth/refresh", {}, {
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      });

      const { accessToken } = response.data.data;
      dispatch(setToken(accessToken));
      
      return accessToken;
    } catch (err: any) {
      // If refresh fails, log out the user
      dispatch(logoutUser());
      return rejectWithValue(err.response?.data?.message);
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
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
      localStorage.setItem("refreshToken", action.payload);
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
        state.refreshToken = action.payload.data.refreshToken;

         // save the tokens
         localStorage.setItem("token", action.payload.data.accessToken);
         localStorage.setItem("refreshToken", action.payload.data.refreshToken);
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
        state.refreshToken = null;
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
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
      })

      // Add the refresh token case to extraReducers
      .addCase(refreshToken.fulfilled, (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
      })
      .addCase(refreshToken.rejected, (state) => {
      state.token = null;
      state.refreshToken = null;
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      });
      },
      });

export const { resetAuth , setToken , setRefreshToken } = authSlice.actions;
export default authSlice.reducer;


