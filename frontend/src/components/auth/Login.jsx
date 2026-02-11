import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../features/auth/auth";
import { createGame } from "../../features/game/gameSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, status, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // After successful login, redirect based on role
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
    if (!email || !password) return;
    dispatch(loginUser({ email, password }));
  };

  const isLoading = status === "loading";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full flex flex-col md:flex-row bg-slate-900/60 border border-slate-700 rounded-2xl shadow-xl overflow-hidden">
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-500/20 via-slate-900 to-purple-600/20 items-center justify-center p-8">
          <div className="text-slate-100 space-y-3">
            <h2 className="text-2xl font-bold">
              Welcome to <span className="text-blue-400">Tic Tac Toe Arena</span>
            </h2>
            <p className="text-sm text-slate-300">
              Play real-time Tic Tac Toe with friends, track your games, and chat live during matches.
            </p>
            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
              <li>Role-based access: admin &amp; user views</li>
              <li>Real-time gameplay and chat</li>
              <li>Responsive experience across devices</li>
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
                Sign in
              </h1>
              <p className="text-xs text-slate-400">
                Use your account to join or start a game.
              </p>
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/40 rounded px-3 py-1.5">
                {error}
              </p>
            )}

            <div className="space-y-1">
              <label className="block text-xs text-slate-300">Email</label>
              <input
                type="email"
                className="w-full border border-slate-600 bg-slate-800/80 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                className="w-full border border-slate-600 bg-slate-800/80 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-md text-sm font-semibold disabled:opacity-60 transition-colors"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <p className="text-[11px] text-center text-slate-400">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-blue-400 font-semibold">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;


