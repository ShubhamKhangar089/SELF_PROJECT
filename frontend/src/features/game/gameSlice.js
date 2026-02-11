import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

// Create a new game for the current user (as X)
export const createGame = createAsyncThunk(
  "game/create",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue("Not authenticated");
      }
      const res = await api.post(
        "/games",
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create game";
      return rejectWithValue(message);
    }
  }
);

// Join an existing game as O
export const joinGame = createAsyncThunk(
  "game/join",
  async (gameId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue("Not authenticated");
      }
      const res = await api.post(
        `/games/${gameId}/join`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to join game";
      return rejectWithValue(message);
    }
  }
);

// Fetch initial game state via REST
export const fetchGameById = createAsyncThunk(
  "game/fetchById",
  async (gameId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue("Not authenticated");
      }
      const res = await api.get(`/games/${gameId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load game";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  gameId: null,
  board: Array(9).fill(""),
  players: {
    x: null,
    o: null,
  },
  currentTurn: "X",
  status: "waiting", // 'waiting' | 'in_progress' | 'finished'
  winner: null, // 'X' | 'O' | 'draw' | null
  loading: false,
  error: null,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameState: (state, action) => {
      const game = action.payload;
      state.gameId = game._id;
      state.board = game.board;
      state.players = game.players;
      state.currentTurn = game.currentTurn;
      state.status = game.status;
      state.winner = game.winner;
      state.error = null;
    },
    clearGameState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // create game
      .addCase(createGame.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGame.fulfilled, (state, action) => {
        state.loading = false;
        const game = action.payload;
        state.gameId = game._id;
        state.board = game.board;
        state.players = game.players;
        state.currentTurn = game.currentTurn;
        state.status = game.status;
        state.winner = game.winner;
      })
      .addCase(createGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create game";
      })
      // join game
      .addCase(joinGame.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinGame.fulfilled, (state, action) => {
        state.loading = false;
        const game = action.payload;
        state.gameId = game._id;
        state.board = game.board;
        state.players = game.players;
        state.currentTurn = game.currentTurn;
        state.status = game.status;
        state.winner = game.winner;
      })
      .addCase(joinGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to join game";
      })
      .addCase(fetchGameById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGameById.fulfilled, (state, action) => {
        state.loading = false;
        const game = action.payload;
        state.gameId = game._id;
        state.board = game.board;
        state.players = game.players;
        state.currentTurn = game.currentTurn;
        state.status = game.status;
        state.winner = game.winner;
      })
      .addCase(fetchGameById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load game";
      });
  },
});

export const { setGameState, clearGameState } = gameSlice.actions;

export default gameSlice.reducer;


