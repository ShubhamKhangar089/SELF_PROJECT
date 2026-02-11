import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchGameById } from "../features/game/gameSlice";
import useGameSocket from "../hooks/useGameSocket";
import { getSocket } from "../services/socket";
import ChatPanel from "../components/game/ChatPanel";

const GameRoom = () => {
  const { gameId } = useParams();
  const dispatch = useDispatch();
  const { board, currentTurn, status, winner, players, loading, error } =
    useSelector((state) => state.game);
  const { user } = useSelector((state) => state.auth);

  useGameSocket(gameId);

  useEffect(() => {
    if (gameId) {
      dispatch(fetchGameById(gameId));
    }
  }, [dispatch, gameId]);

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
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1 bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col items-center">
              <div className="grid grid-cols-3 gap-2 mb-4">
                {board.map((cell, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleCellClick(index)}
                    className="w-20 h-20 bg-slate-900 border border-slate-700 flex items-center justify-center text-3xl font-bold text-slate-100 hover:bg-slate-800 transition-colors"
                  >
                    {cell}
                  </button>
                ))}
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
            </div>

            <ChatPanel gameId={gameId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameRoom;


