import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./routes/PrivateRoute";
import Home from "./pages/Home";
import Bank from "./pages/Bank";
import Profile from "./pages/Profile";
import ProductDetails from "./pages/ProductDetails";
import BankDetails from "./pages/BankDetails";

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
      <Route
        path="/bank"
        element={
          <PrivateRoute>
            <Bank />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/product/:id"
        element={
          <PrivateRoute>
            <ProductDetails />
          </PrivateRoute>
        }
      />
      <Route
        path="/bank/:id"
        element={
          <PrivateRoute>
            <BankDetails />
          </PrivateRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;
