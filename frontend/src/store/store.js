import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import authReducer from "../features/auth/auth";
import gameReducer from "../features/game/gameSlice";
import chatReducer from "../features/chat/chatSlice";
import presenceReducer from "../features/presence/presenceSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    counter: counterReducer,
    game: gameReducer,
    chat: chatReducer,
    presence: presenceReducer,
    },
});

export default store;