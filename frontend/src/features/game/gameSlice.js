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

// Fetch open (waiting) games for lobby
export const fetchOpenGames = createAsyncThunk(
  "game/fetchOpenGames",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue("Not authenticated");
      }
      const res = await api.get("/games?status=waiting", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load open games";
      return rejectWithValue(message);
    }
  }
);

// Quick match: join matchmaking queue
export const joinMatchmaking = createAsyncThunk(
  "game/joinMatchmaking",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue("Not authenticated");
      }
      const res = await api.post(
        "/matchmaking/join",
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
        error.response?.data?.message || "Failed to join matchmaking";
      return rejectWithValue(message);
    }
  }
);

// Leave matchmaking queue
export const leaveMatchmaking = createAsyncThunk(
  "game/leaveMatchmaking",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue("Not authenticated");
      }
      await api.delete("/matchmaking/leave", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return {};
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to leave matchmaking";
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

  openGames: [],
  openGamesLoading: false,
  openGamesError: null,

  matchStatus: "idle", // 'idle' | 'searching' | 'matched'
  matchError: null,
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
      })
      // open games
      .addCase(fetchOpenGames.pending, (state) => {
        state.openGamesLoading = true;
        state.openGamesError = null;
      })
      .addCase(fetchOpenGames.fulfilled, (state, action) => {
        state.openGamesLoading = false;
        state.openGames = action.payload;
      })
      .addCase(fetchOpenGames.rejected, (state, action) => {
        state.openGamesLoading = false;
        state.openGamesError = action.payload || "Failed to load open games";
      })
      // matchmaking
      .addCase(joinMatchmaking.pending, (state) => {
        state.matchStatus = "searching";
        state.matchError = null;
      })
      .addCase(joinMatchmaking.fulfilled, (state, action) => {
        const payload = action.payload;
        if (payload.status === "matched") {
          state.matchStatus = "matched";
          state.matchError = null;
          const game = payload.game;
          state.gameId = game._id;
          state.board = game.board;
          state.players = game.players;
          state.currentTurn = game.currentTurn;
          state.status = game.status;
          state.winner = game.winner;
        } else {
          // waiting
          state.matchStatus = "searching";
        }
      })
      .addCase(joinMatchmaking.rejected, (state, action) => {
        state.matchStatus = "idle";
        state.matchError = action.payload || "Failed to join matchmaking";
      })
      .addCase(leaveMatchmaking.fulfilled, (state) => {
        state.matchStatus = "idle";
        state.matchError = null;
      })
      .addCase(leaveMatchmaking.rejected, (state, action) => {
        state.matchStatus = "idle";
        state.matchError = action.payload || "Failed to leave matchmaking";
      });
  },
});

export const { setGameState, clearGameState } = gameSlice.actions;

export default gameSlice.reducer;


