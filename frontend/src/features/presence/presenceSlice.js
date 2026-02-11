import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  onlineCount: 0,
};

const presenceSlice = createSlice({
  name: "presence",
  initialState,
  reducers: {
    setOnlineCount: (state, action) => {
      state.onlineCount = action.payload ?? 0;
    },
  },
});

export const { setOnlineCount } = presenceSlice.actions;

export default presenceSlice.reducer;


