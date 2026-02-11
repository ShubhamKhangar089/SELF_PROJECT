import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getSocket } from "../../services/socket";

const ChatPanel = ({ gameId }) => {
  const { messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    const socket = getSocket();
    if (!socket) return;

    socket.emit("chat_message", { gameId, text: trimmed });
    setText("");
  };

  useEffect(() => {
    if (!bottomRef.current) return;
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow border border-gray-200 flex flex-col h-80">
      <div className="px-3 py-2 border-b border-gray-200 text-sm font-semibold text-gray-700">
        Chat
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 text-sm">
        {messages.length === 0 && (
          <p className="text-gray-400 text-xs">No messages yet. Say hi!</p>
        )}
        {messages.map((msg) => {
          const isMe = user && (msg.senderId === user.id || msg.senderId === user._id);
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded px-2 py-1 ${
                  isMe
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <div className="text-[10px] opacity-80 mb-0.5">
                  {isMe ? "You" : msg.senderName}
                </div>
                <div>{msg.text}</div>
                <div className="text-[9px] opacity-60 mt-0.5 text-right">
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString()
                    : ""}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <form
        onSubmit={handleSend}
        className="border-t border-gray-200 px-2 py-2 flex items-center gap-2"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold disabled:opacity-60"
          disabled={!text.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;


