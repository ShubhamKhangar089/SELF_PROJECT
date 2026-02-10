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
    <nav className="w-full bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
      <div className="font-semibold text-lg">RBAC Demo</div>
      <div className="flex items-center gap-4 text-sm">
        {user && (
          <span className="text-slate-200">
            {user.email} ({user.role})
          </span>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-sm font-semibold"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;


