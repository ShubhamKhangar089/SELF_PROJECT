let ioInstance = null;

// Map of userId -> Set of socketIds
const userSockets = new Map();

export const setIO = (io) => {
  ioInstance = io;
};

export const registerSocket = (userId, socketId) => {
  if (!userId || !socketId) return;
  const key = String(userId);
  if (!userSockets.has(key)) {
    userSockets.set(key, new Set());
  }
  userSockets.get(key).add(socketId);
};

export const unregisterSocket = (userId, socketId) => {
  if (!userId || !socketId) return;
  const key = String(userId);
  const set = userSockets.get(key);
  if (!set) return;
  set.delete(socketId);
  if (set.size === 0) {
    userSockets.delete(key);
  }
};

export const emitToUser = (userId, event, payload) => {
  if (!ioInstance || !userId || !event) return;
  const key = String(userId);
  const sockets = userSockets.get(key);
  if (!sockets) return;
  sockets.forEach((socketId) => {
    ioInstance.to(socketId).emit(event, payload);
  });
};

export const emitToAll = (event, payload) => {
  if (!ioInstance || !event) return;
  ioInstance.emit(event, payload);
};

export const getOnlineCount = () => userSockets.size;


