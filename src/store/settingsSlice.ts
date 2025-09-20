// src/store/settingsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light",
  language: "en",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
});

export const { toggleTheme, setLanguage } = settingsSlice.actions;
export default settingsSlice.reducer;
