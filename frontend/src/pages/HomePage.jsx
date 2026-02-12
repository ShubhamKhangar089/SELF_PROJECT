import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { connectSocket, getSocket } from "../services/socket";
import {
  createGame,
  joinGame,
  fetchOpenGames,
  joinMatchmaking,
  leaveMatchmaking,
} from "../features/game/gameSlice";

const User = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    loading,
    error,
    openGames,
    openGamesLoading,
    openGamesError,
    matchStatus,
    matchError,
  } = useSelector((state) => state.game);

  const [joinId, setJoinId] = useState("");

  const handleStartGame = async () => {
    const action = await dispatch(createGame());
    if (createGame.fulfilled.match(action)) {
      const game = action.payload;
      navigate(`/game/${game._id}`);
    }
  };

  const handleJoinGame = async () => {
    const trimmed = joinId.trim();
    if (!trimmed) return;
    const action = await dispatch(joinGame(trimmed));
    if (joinGame.fulfilled.match(action)) {
      const game = action.payload;
      navigate(`/game/${game._id}`);
    }
  };

  const { token } = useSelector((state) => state.auth);

  // Initial load of open games when lobby mounts
  useEffect(() => {
    dispatch(fetchOpenGames());
  }, [dispatch]);

  // Subscribe to Socket.io event to refresh open games only when they change
  useEffect(() => {
    if (!token) return;
    const socket = connectSocket(token);

    const handleOpenGamesChanged = () => {
      dispatch(fetchOpenGames());
    };

    socket.on("open_games_changed", handleOpenGamesChanged);

    return () => {
      const current = getSocket();
      if (current) {
        current.off("open_games_changed", handleOpenGamesChanged);
      }
    };
  }, [dispatch, token]);

  useEffect(() => {
    if (matchStatus !== "searching" || !token) return;
    const socket = connectSocket(token);

    const handleMatchFound = (payload) => {
      if (payload?.gameId) {
        navigate(`/game/${payload.gameId}`);
      }
    };

    socket.on("match_found", handleMatchFound);

    return () => {
      const current = getSocket();
      if (current) {
        current.off("match_found", handleMatchFound);
      }
    };
  }, [matchStatus, token, navigate]);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-50 mb-1">
                Lobby
              </h1>
              <p className="text-xs md:text-sm text-slate-300">
                Start a new Tic Tac Toe match or join an existing game with a friend.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <button
                type="button"
                onClick={handleStartGame}
                disabled={loading}
                className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold disabled:opacity-60 shadow-sm"
              >
                {loading ? "Creating game..." : "Start New Game (as X)"}
              </button>

              <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
                <input
                  type="text"
                  value={joinId}
                  onChange={(e) => setJoinId(e.target.value)}
                  placeholder="Enter Game ID to join"
                  className="px-3 py-2 border border-slate-700 bg-slate-900 rounded text-sm text-slate-100 flex-1 min-w-[180px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleJoinGame}
                  disabled={loading}
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold disabled:opacity-60 shadow-sm"
                >
                  Join Game (as O)
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs md:text-sm text-red-400 bg-red-500/10 border border-red-500/40 rounded px-3 py-1.5 mt-1">
                {error}
              </p>
            )}

            <div className="mt-4 text-[11px] md:text-xs text-slate-400 space-y-1">
              <p>
                <span className="font-semibold text-slate-200">Tip:</span> After
                creating a game, copy the Game ID from the URL bar and share it
                with a friend so they can join as O.
              </p>
              <p>
                Or use{" "}
                <span className="font-semibold text-slate-200">
                  Quick Match
                </span>{" "}
                to be auto-paired with another player looking for a game.
              </p>
            </div>
          </div>

          <div className="w-full md:w-80 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <h2 className="text-sm font-semibold text-slate-100 mb-1">
              Quick Match
            </h2>
            <p className="text-xs text-slate-400">
              Let the system find an opponent for you automatically.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  if (matchStatus === "searching") {
                    await dispatch(leaveMatchmaking());
                    return;
                  }
                  const action = await dispatch(joinMatchmaking());
                  if (
                    joinMatchmaking.fulfilled.match(action) &&
                    action.payload.status === "matched"
                  ) {
                    const { gameId } = action.payload;
                    navigate(`/game/${gameId}`);
                  }
                }}
                className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow-sm disabled:opacity-60"
              >
                {matchStatus === "searching" ? "Searching..." : "Quick Match"}
              </button>
              {matchStatus === "searching" && (
                <span className="text-[11px] text-slate-400">
                  Looking for another player...
                </span>
              )}
            </div>
            {matchError && (
              <p className="text-[11px] text-red-400 bg-red-500/10 border border-red-500/40 rounded px-3 py-1.5 mt-1">
                {matchError}
              </p>
            )}

            <h2 className="text-sm font-semibold text-slate-100 mb-1">
              Open Games
            </h2>
            {openGamesLoading && (
              <p className="text-xs text-slate-400">Loading open games...</p>
            )}
            {openGamesError && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/40 rounded px-3 py-1.5 mt-1">
                {openGamesError}
              </p>
            )}
            {!openGamesLoading && !openGamesError && openGames.length === 0 && (
              <p className="text-xs text-slate-400">
                No open games right now. Start a new one!
              </p>
            )}
            <div className="space-y-2 max-h-64 overflow-y-auto text-xs">
              {openGames.map((game) => {
                const host =
                  game.players?.x?.name ||
                  game.players?.x?.email ||
                  "Unknown";
                const created =
                  game.createdAt &&
                  new Date(game.createdAt).toLocaleTimeString();
                return (
                  <div
                    key={game._id}
                    className="flex items-center justify-between gap-2 border border-slate-800 rounded-lg px-2 py-1.5 bg-slate-900"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-slate-100 truncate">
                        Host: {host}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        ID: {game._id.slice(-6)} • {created || ""}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        const action = await dispatch(joinGame(game._id));
                        if (joinGame.fulfilled.match(action)) {
                          navigate(`/game/${game._id}`);
                        }
                      }}
                      className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-[11px] font-semibold text-white"
                    >
                      Join
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;