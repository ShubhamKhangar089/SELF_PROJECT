import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../features/auth/auth";
import { connectSocket, getSocket } from "../../services/socket";
import { setOnlineCount } from "../../features/presence/presenceSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const { onlineCount } = useSelector((state) => state.presence);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate("/login", { replace: true });
    });
  };

  useEffect(() => {
    if (!token) return;
    const socket = connectSocket(token);

    const handleOnlineCount = (payload) => {
      dispatch(setOnlineCount(payload?.count ?? 0));
    };

    socket.on("online_count", handleOnlineCount);

    return () => {
      const current = getSocket();
      if (current) {
        current.off("online_count", handleOnlineCount);
      }
    };
  }, [dispatch, token]);

  return (
    <nav className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-sm font-bold">
            XO
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm md:text-base font-semibold">
              Tic Tac Toe Arena
            </span>
            <span className="hidden sm:block text-[11px] text-slate-300">
              Real-time game &amp; chat
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs md:text-sm">
          {onlineCount > 0 && (
            <div className="flex items-center gap-1 text-[11px] md:text-xs text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{onlineCount} online</span>
            </div>
          )}
          {user && (
            <div className="flex flex-col items-end leading-tight">
              <span className="text-slate-100 font-medium truncate max-w-[160px]">
                {user.email}
              </span>
              <span className="text-[11px] uppercase tracking-wide text-slate-300">
                {user.role}
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-md bg-red-500 hover:bg-red-600 text-xs md:text-sm font-semibold shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


