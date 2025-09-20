// store/userSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../config/axiosConfig";

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async ({ token }: { token: string }) => {
    console.log(token);
    const response = await api.get(`auth/profile`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: { data: null, status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchUser.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default userSlice.reducer;
