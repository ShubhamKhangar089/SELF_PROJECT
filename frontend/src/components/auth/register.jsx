import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../features/auth/auth";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, status, error } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  // After successful register, redirect based on role
  useEffect(() => {
    if (!user) return;

    if (user.role === "admin") {
      navigate("/admin", { replace: true });
    } else if (user.role === "user") {
      navigate("/home", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    dispatch(registerUser({ name, email, password, role }));
  };

  const isLoading = status === "loading";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full flex flex-col md:flex-row bg-slate-900/60 border border-slate-700 rounded-2xl shadow-xl overflow-hidden">
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-emerald-500/20 via-slate-900 to-blue-600/20 items-center justify-center p-8">
          <div className="text-slate-100 space-y-3">
            <h2 className="text-2xl font-bold">
              Create your <span className="text-emerald-400">Arena account</span>
            </h2>
            <p className="text-sm text-slate-300">
              Choose your role and start playing real-time Tic Tac Toe or managing games as an admin.
            </p>
            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
              <li>User role: play games, chat, and join rooms</li>
              <li>Admin role: manage users and oversee matches</li>
            </ul>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-slate-900 px-6 py-8">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm mx-auto space-y-5"
          >
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-semibold text-slate-50">
                Sign up
              </h1>
              <p className="text-xs text-slate-400">
                Create an account to start playing or managing games.
              </p>
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/40 rounded px-3 py-1.5">
                {error}
              </p>
            )}

            <div className="space-y-1">
              <label className="block text-xs text-slate-300">Name</label>
              <input
                type="text"
                className="w-full border border-slate-600 bg-slate-800/80 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs text-slate-300">Email</label>
              <input
                type="email"
                className="w-full border border-slate-600 bg-slate-800/80 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs text-slate-300">Password</label>
              <input
                type="password"
                className="w-full border border-slate-600 bg-slate-800/80 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs text-slate-300">Role</label>
              <select
                className="w-full border border-slate-600 bg-slate-800/80 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-md text-sm font-semibold disabled:opacity-60 transition-colors"
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;


