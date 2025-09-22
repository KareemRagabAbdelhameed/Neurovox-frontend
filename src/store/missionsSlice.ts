// store/missionsSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface MissionsState {
  points: number;
  videoCompleted: boolean;
  articleRead: boolean;
  checkedIn: boolean;
  surveyCompleted: boolean;
  taskStartTime: number | null;
  startedAt: {
    video?: number;
    article?: number;
    checkin?: number;
    survey?: number;
  };
  durations: {
    video?: number;   // seconds
    article?: number;
    checkin?: number;
    survey?: number;
  };
}

const initialState: MissionsState = {
  points: 0,
  videoCompleted: false,
  articleRead: false,
  checkedIn: false,
  surveyCompleted: false,
  taskStartTime: null,
  startedAt: {},
  durations: {},
};

const missionsSlice = createSlice({
  name: "missions",
  initialState,
  reducers: {
    addPoints: (state, action: PayloadAction<number>) => {
      state.points += action.payload;
    },
    startTask: (state, action: PayloadAction<string>) => {
      const task = action.payload;
      state.startedAt[task as keyof MissionsState["startedAt"]] = Date.now();
      state.taskStartTime = Date.now();
    },
    completeTask: (state, action: PayloadAction<string>) => {
      const task = action.payload;
      const start = state.startedAt[task as keyof MissionsState["startedAt"]];
      const duration = start ? Math.floor((Date.now() - start) / 1000) : 0;
      if (state.taskStartTime) {
        const duration = Math.floor((Date.now() - state.taskStartTime) / 1000);
        console.log(`⏱ Task "${action.payload}" took ${duration} seconds`);
        state.taskStartTime = null;
      }

      switch (task) {
        case "video":
          state.videoCompleted = true;
          state.durations.video = duration;
          break;
        case "article":
          state.articleRead = true;
          state.durations.article = duration;
          break;
        case "checkin":
          state.checkedIn = true;
          state.durations.checkin = duration;
          break;
        case "survey":
          state.surveyCompleted = true;
          state.durations.survey = duration;
          break;
      }
    },
  },
});

export const { addPoints, startTask, completeTask } = missionsSlice.actions;
export default missionsSlice.reducer;
