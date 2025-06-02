import { Home, User, Banknote } from "lucide-react";
import solunaLogo from "../assets/solunaLogo.png";
import "../index.css";

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
        <div className="sidebar-item">
          <Home className="sidebar-icon" />
          <label>Home</label>
        </div>
        <div className="sidebar-item">
          <Banknote className="sidebar-icon" />
          <label>Bank</label>
        </div>
        <div className="sidebar-item">
          <User className="sidebar-icon" />
          <label>Profile</label>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
