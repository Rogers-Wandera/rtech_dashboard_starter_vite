import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SessionTimerState {
  sessionId: string | null;
  secondsLeft: number;
  isActive: boolean;
}

const initialState: SessionTimerState = {
  sessionId: null,
  secondsLeft: 0,
  isActive: false,
};

const sessionTimerSlice = createSlice({
  name: "sessionTimer",
  initialState,
  reducers: {
    startTimer(
      state,
      action: PayloadAction<{ sessionId: string; secondsLeft: number }>
    ) {
      state.sessionId = action.payload.sessionId;
      state.secondsLeft = action.payload.secondsLeft;
      state.isActive = true;
    },
    tick(state) {
      if (state.secondsLeft > 0) {
        state.secondsLeft -= 1;
      } else {
        state.isActive = false;
      }
    },
    stopTimer(state) {
      state.isActive = false;
      state.sessionId = null;
      state.secondsLeft = 0;
    },
  },
});

export const { startTimer, tick, stopTimer } = sessionTimerSlice.actions;
export default sessionTimerSlice.reducer;
