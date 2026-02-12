import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FiUsers, FiGrid, FiPlayCircle, FiCheckCircle } from "react-icons/fi";
import Navbar from "../components/navbar/Navbar";
import api from "../services/api";

const Admin = () => {
  const { token } = useSelector((state) => state.auth);

  const [stats, setStats] = useState(null);
  const [recentGames, setRecentGames] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        setError("Missing auth token");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [statsRes, gamesRes, usersRes] = await Promise.all([
          api.get("/admin/stats", config),
          api.get("/admin/recent-games?limit=10", config),
          api.get("/admin/users?limit=10", config),
        ]);

        if (!isMounted) return;

        setStats(statsRes.data);
        setRecentGames(gamesRes.data || []);
        setUsers(usersRes.data || []);
      } catch (err) {
        if (!isMounted) return;
        // eslint-disable-next-line no-console
        console.error("Admin dashboard fetch error:", err);
        setError(
          err.response?.data?.message || "Failed to load admin dashboard data"
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
            <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
            <p className="text-sm text-slate-400">
            Monitor users, games, and live activity for Tic Tac Toe Arena.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wide text-slate-400 bg-slate-900/70 border border-slate-800 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live overview
          </span>
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/40 rounded px-3 py-2">
            {error}
          </p>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            label="Total Users"
            value={stats?.totalUsers}
            Icon={FiUsers}
            loading={loading}
          />
          <SummaryCard
            label="Total Games"
            value={stats?.totalGames}
            Icon={FiGrid}
            loading={loading}
          />
          <SummaryCard
            label="Active Games"
            value={stats?.inProgressGames}
            Icon={FiPlayCircle}
            loading={loading}
          />
          <SummaryCard
            label="Finished Games"
            value={stats?.finishedGames}
            Icon={FiCheckCircle}
            loading={loading}
          />
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800 text-slate-100 text-sm">
                  <FiPlayCircle />
                </span>
                <h2 className="text-sm font-semibold text-slate-100">
                  Recent Games
                </h2>
              </div>
              <span className="text-[11px] text-slate-400">
                Last {recentGames.length} games
              </span>
            </div>
            <div className="overflow-x-auto text-xs">
              <table className="min-w-full border-separate border-spacing-y-1">
                <thead className="text-[11px] uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="text-left px-2 py-1">Game</th>
                    <th className="text-left px-2 py-1">Players</th>
                    <th className="text-left px-2 py-1">Status</th>
                    <th className="text-left px-2 py-1">Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-2 py-3 text-center text-slate-400"
                      >
                        Loading...
                      </td>
                    </tr>
                  )}
                  {!loading && recentGames.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-2 py-3 text-center text-slate-400"
                      >
                        No games yet.
                      </td>
                    </tr>
                  )}
                  {!loading &&
                    recentGames.map((g) => {
                      const shortId = g._id.slice(-6);
                      const x =
                        g.players?.x?.name ||
                        g.players?.x?.email ||
                        "Unknown X";
                      const o =
                        g.players?.o?.name ||
                        g.players?.o?.email ||
                        "Unknown O";
                      return (
                        <tr
                          key={g._id}
                          className="bg-slate-900 border border-slate-800"
                        >
                          <td className="px-2 py-1 align-top text-slate-100">
                            #{shortId}
                            <div className="text-[10px] text-slate-400">
                              {g.createdAt &&
                                new Date(g.createdAt).toLocaleString()}
                            </div>
                          </td>
                          <td className="px-2 py-1 align-top">
                            <div className="text-slate-100 truncate">
                              X: {x}
                            </div>
                            <div className="text-slate-100 truncate">
                              O: {o}
                            </div>
                          </td>
                          <td className="px-2 py-1 align-top capitalize">
                            <span className="inline-flex items-center rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-200">
                              {g.status}
                            </span>
                          </td>
                          <td className="px-2 py-1 align-top">
                            <span className="text-slate-100 text-xs">
                              {g.winner || "-"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800 text-slate-100 text-sm">
                  <FiUsers />
                </span>
                <h2 className="text-sm font-semibold text-slate-100">
                  Recent Users
                </h2>
              </div>
              <span className="text-[11px] text-slate-400">
                Last {users.length} signups
              </span>
            </div>
            <div className="overflow-x-auto text-xs">
              <table className="min-w-full border-separate border-spacing-y-1">
                <thead className="text-[11px] uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="text-left px-2 py-1">User</th>
                    <th className="text-left px-2 py-1">Email</th>
                    <th className="text-left px-2 py-1">Role</th>
                    <th className="text-left px-2 py-1">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-2 py-3 text-center text-slate-400"
                      >
                        Loading...
                      </td>
                    </tr>
                  )}
                  {!loading && users.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-2 py-3 text-center text-slate-400"
                      >
                        No users yet.
                      </td>
                    </tr>
                  )}
                  {!loading &&
                    users.map((u) => (
                      <tr
                        key={u._id}
                        className="bg-slate-900 border border-slate-800"
                      >
                        <td className="px-2 py-1 align-top text-slate-100">
                          {u.name || "Unnamed"}
                        </td>
                        <td className="px-2 py-1 align-top text-slate-100 truncate max-w-[160px]">
                          {u.email}
                        </td>
                        <td className="px-2 py-1 align-top">
                          <span className="inline-flex items-center rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-200">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-2 py-1 align-top text-[10px] text-slate-400">
                          {u.createdAt &&
                            new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, loading, Icon }) => (
  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
    {Icon && (
      <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-100 text-lg">
        <Icon />
      </div>
    )}
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span className="text-xl font-semibold text-slate-50">
        {loading ? "…" : value ?? 0}
      </span>
    </div>
  </div>
);

export default Admin;