import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Admin from "./pages/Admin";
import User from "./pages/user";
import Login from "./components/auth/login";
import Register from "./components/auth/register";

const RequiredAuth = ({ allowedRoles, children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin"
        element={
          <RequiredAuth allowedRoles={["admin"]}>
            <Admin />
          </RequiredAuth>
        }
      />

      <Route
        path="/user"
        element={
          <RequiredAuth allowedRoles={["user"]}>
            <User />
          </RequiredAuth>
        }
      />

      {/* default route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
