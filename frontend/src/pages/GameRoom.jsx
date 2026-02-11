import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchGameById } from "../features/game/gameSlice";
import useGameSocket from "../hooks/useGameSocket";
import { connectSocket, getSocket } from "../services/socket";
import ChatPanel from "../components/game/ChatPanel";

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const GameRoom = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { board, currentTurn, status, winner, players, loading, error } =
    useSelector((state) => state.game);
  const { user, token } = useSelector((state) => state.auth);

  const [scoreboard, setScoreboard] = useState({
    xWins: 0,
    oWins: 0,
    draws: 0,
  });
  const lastCountedGameIdRef = useRef(null);
  const [lastMoveIndex, setLastMoveIndex] = useState(null);
  const prevBoardRef = useRef(board);
  const [rematchState, setRematchState] = useState({
    pending: false,
    incomingRequest: null,
  });

  useGameSocket(gameId);

  useEffect(() => {
    if (gameId) {
      dispatch(fetchGameById(gameId));
    }
  }, [dispatch, gameId]);

  // Track last move index locally by diffing boards
  useEffect(() => {
    const prev = prevBoardRef.current;
    if (!prev || prev.length !== board.length) {
      prevBoardRef.current = board;
      return;
    }
    let idx = null;
    for (let i = 0; i < board.length; i += 1) {
      if (prev[i] !== board[i] && board[i] !== "") {
        idx = i;
        break;
      }
    }
    if (idx !== null) {
      setLastMoveIndex(idx);
    }
    prevBoardRef.current = board;
  }, [board]);

  // Compute winning line for highlight
  const winningLine = useMemo(() => {
    if (winner !== "X" && winner !== "O") return null;
    for (const [a, b, c] of winningLines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return [a, b, c];
      }
    }
    return null;
  }, [board, winner]);

  // Update scoreboard once per finished game
  useEffect(() => {
    if (status !== "finished" || !gameId) return;
    if (lastCountedGameIdRef.current === gameId) return;

    setScoreboard((prev) => {
      if (winner === "X") {
        return { ...prev, xWins: prev.xWins + 1 };
      }
      if (winner === "O") {
        return { ...prev, oWins: prev.oWins + 1 };
      }
      if (winner === "draw") {
        return { ...prev, draws: prev.draws + 1 };
      }
      return prev;
    });

    lastCountedGameIdRef.current = gameId;
  }, [status, winner, gameId]);

  // Rematch socket events
  useEffect(() => {
    if (!token || !gameId) return;
    const socket = connectSocket(token);

    const handleRematchRequest = (payload) => {
      if (!payload || payload.gameId !== gameId) return;
      // If we are the requester, mark pending; otherwise store incoming request
      if (payload.from?.id === (user?.id || user?._id)) {
        setRematchState({ pending: true, incomingRequest: null });
      } else {
        setRematchState({ pending: false, incomingRequest: payload.from });
      }
    };

    const handleRematchDeclined = (payload) => {
      if (!payload || payload.gameId !== gameId) return;
      setRematchState({ pending: false, incomingRequest: null });
    };

    const handleRematchStarted = (payload) => {
      if (!payload || !payload.newGameId) return;
      setRematchState({ pending: false, incomingRequest: null });
      navigate(`/game/${payload.newGameId}`);
    };

    socket.on("rematch_request", handleRematchRequest);
    socket.on("rematch_declined", handleRematchDeclined);
    socket.on("rematch_started", handleRematchStarted);

    return () => {
      const current = getSocket();
      if (current) {
        current.off("rematch_request", handleRematchRequest);
        current.off("rematch_declined", handleRematchDeclined);
        current.off("rematch_started", handleRematchStarted);
      }
    };
  }, [token, gameId, navigate, user]);

  const youAre =
    user && players
      ? String(players.x?._id || players.x) === String(user.id || user._id)
        ? "X"
        : players.o &&
          String(players.o?._id || players.o) === String(user.id || user._id)
        ? "O"
        : "spectator"
      : "spectator";

  const handleCellClick = (index) => {
    if (status !== "in_progress") return;
    if (winner) return;
    if (!user) return;

    // Only allow current player to move
    if (youAre !== currentTurn) return;
    if (board[index] !== "") return;

    const socket = getSocket();
    if (!socket) return;

    socket.emit("make_move", { gameId, index });
  };

  const handleRequestRematch = () => {
    if (!user || status !== "finished") return;
    const socket = getSocket();
    if (!socket) return;
    setRematchState({ pending: true, incomingRequest: null });
    socket.emit("rematch_request", { gameId });
  };

  const handleRespondRematch = (accepted) => {
    if (!user || status !== "finished") return;
    const socket = getSocket();
    if (!socket) return;
    setRematchState({ pending: false, incomingRequest: null });
    socket.emit("rematch_response", { gameId, accepted });
  };

  const renderStatus = () => {
    if (loading) return "Loading game...";
    if (error) return error;
    if (status === "waiting") return "Waiting for another player to join...";
    if (status === "in_progress") {
      if (youAre === "spectator") {
        return `Watching game. Current turn: ${currentTurn}`;
      }
      return youAre === currentTurn ? "Your turn" : "Opponent's turn";
    }
    if (status === "finished") {
      if (winner === "draw") return "Game ended in a draw";
      if (youAre === winner) return "You won!";
      if (youAre === "spectator") return `Winner: ${winner}`;
      return "You lost";
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-50">
                Tic Tac Toe
              </h1>
              <p className="text-xs md:text-sm text-slate-300">
                {renderStatus()}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                      currentTurn === "X"
                        ? "bg-emerald-500/20 border-emerald-400"
                        : "bg-slate-800 border-slate-600"
                    }`}
                  >
                    X
                  </div>
                  <span className="hidden sm:block max-w-[120px] truncate text-slate-200">
                    {players?.x?.name || players?.x?.email || "Player X"}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">vs</span>
                <div className="flex items-center gap-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                      currentTurn === "O"
                        ? "bg-emerald-500/20 border-emerald-400"
                        : "bg-slate-800 border-slate-600"
                    }`}
                  >
                    O
                  </div>
                  <span className="hidden sm:block max-w-[120px] truncate text-slate-200">
                    {players?.o?.name || players?.o?.email || "Player O"}
                  </span>
                </div>
              </div>
              <div className="text-[10px] text-slate-400">
                Score – X: {scoreboard.xWins} • O: {scoreboard.oWins} • Draws:{" "}
                {scoreboard.draws}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1 bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col items-center gap-3">
              <div className="grid grid-cols-3 gap-2 mb-2">
                {board.map((cell, index) => {
                  const isWinning =
                    winningLine && winningLine.includes(index);
                  const isLastMove = lastMoveIndex === index && !isWinning;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleCellClick(index)}
                      className={`w-20 h-20 border flex items-center justify-center text-3xl font-bold text-slate-100 transition-colors ${
                        isWinning
                          ? "bg-emerald-600/30 border-emerald-400 animate-pulse"
                          : isLastMove
                          ? "bg-blue-600/20 border-blue-400"
                          : "bg-slate-900 border-slate-700 hover:bg-slate-800"
                      }`}
                    >
                      {cell}
                    </button>
                  );
                })}
              </div>

              <div className="text-xs text-slate-300 space-y-1 text-center">
                <div>
                  You are:{" "}
                  <span className="font-semibold text-slate-50">
                    {youAre}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  X starts first. Players take turns placing their mark in
                  empty cells.
                </div>
              </div>

              {status === "finished" && (
                <div className="mt-2 flex flex-col sm:flex-row gap-2 items-center">
                  {rematchState.incomingRequest ? (
                    <>
                      <span className="text-[11px] text-slate-300">
                        {rematchState.incomingRequest.name ||
                          rematchState.incomingRequest.email ||
                          "Opponent"}{" "}
                        requested a rematch.
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleRespondRematch(true)}
                          className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-[11px] font-semibold text-white"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRespondRematch(false)}
                          className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-[11px] font-semibold text-slate-100"
                        >
                          Decline
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRequestRematch}
                      disabled={rematchState.pending}
                      className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-[11px] font-semibold text-white disabled:opacity-60"
                    >
                      {rematchState.pending
                        ? "Rematch requested..."
                        : "Request rematch"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => navigate("/home")}
                    className="px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-[11px] font-semibold text-slate-100"
                  >
                    Leave game
                  </button>
                </div>
              )}
            </div>

            <ChatPanel gameId={gameId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameRoom;


