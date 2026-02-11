import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../features/auth/auth";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate("/login", { replace: true });
    });
  };

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


