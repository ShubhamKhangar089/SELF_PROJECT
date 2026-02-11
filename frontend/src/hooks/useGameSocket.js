import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket, getSocket } from "../services/socket";
import { setGameState } from "../features/game/gameSlice";
import { addMessage, clearMessages } from "../features/chat/chatSlice";

const useGameSocket = (gameId) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token || !gameId) return;

    const socket = connectSocket(token);

    const handleGameState = (game) => {
      dispatch(setGameState(game));
    };

    const handleGameUpdate = (game) => {
      dispatch(setGameState(game));
    };

    const handleChatMessage = (message) => {
      dispatch(addMessage(message));
    };

    const handleGameError = (payload) => {
      // For now, just log; you can dispatch to slices if you want to show errors
      // eslint-disable-next-line no-console
      console.error("Game socket error:", payload);
    };

    // Clear chat when joining/rejoining a game
    dispatch(clearMessages());

    socket.on("game_state", handleGameState);
    socket.on("game_update", handleGameUpdate);
    socket.on("game_error", handleGameError);
    socket.on("chat_message", handleChatMessage);

    // Join the specific game room
    socket.emit("join_game", { gameId });

    return () => {
      const current = getSocket();
      if (current) {
        current.off("game_state", handleGameState);
        current.off("game_update", handleGameUpdate);
        current.off("game_error", handleGameError);
        current.off("chat_message", handleChatMessage);
      }
    };
  }, [dispatch, gameId, token]);
};

export default useGameSocket;


