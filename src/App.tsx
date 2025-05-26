import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./routes/PrivateRoute";
import Home from "./pages/Home";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
