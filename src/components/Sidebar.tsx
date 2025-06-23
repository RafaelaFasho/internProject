import { Home, User, Banknote } from "lucide-react";
import solunaLogo from "../assets/solunaLogo.png";
import "../styles/sidebar.css";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo-container-sidebar">
        <img
          src={solunaLogo}
          alt="Soluna Logo"
          className="soluna-logo-sidebar"
        />
      </div>
      <nav className="sidebar-menu">
        <Link to="/home" className="sidebar-item">
          <Home className="sidebar-icon" />
          <label>Home</label>
        </Link>
        <Link to="/bank" className="sidebar-item">
          <Banknote className="sidebar-icon" />
          <label>Bank</label>
        </Link>
        <Link to="/profile" className="sidebar-item">
          <User className="sidebar-icon" />
          <label>Profile</label>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
