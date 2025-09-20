// themeSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface ThemeState {
  darkMode: boolean;
}

const initialState: ThemeState = { darkMode: false };

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("darkMode", JSON.stringify(state.darkMode));
    },
    setTheme: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem("darkMode", JSON.stringify(state.darkMode));
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer; // <-- هنا الـthemeReducer
