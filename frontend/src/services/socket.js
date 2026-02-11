import { io } from "socket.io-client";
import { API_BASE_URL } from "./api";

let socket = null;

const SOCKET_URL = API_BASE_URL.replace("/api", "");

export const connectSocket = (token) => {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    auth: { token },
    withCredentials: true,
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};


