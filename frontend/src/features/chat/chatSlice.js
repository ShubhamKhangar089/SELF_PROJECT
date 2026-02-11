import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [], // { id, text, senderId, senderName, createdAt }
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: () => initialState,
  },
});

export const { addMessage, clearMessages } = chatSlice.actions;

export default chatSlice.reducer;


