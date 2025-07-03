import { useState } from "react";
import { Home, User, Banknote, Menu } from "lucide-react"; // Shto ikonën Menu për hamburger
import solunaLogo from "../assets/solunaLogo.png";
import "../styles/sidebar.css";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Ikona hamburger për ekran të vogël */}
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Menu />
      </button>

      {/* Sidebar me klasën 'open' kur është hapur */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="logo-container-sidebar">
          <img
            src={solunaLogo}
            alt="Soluna Logo"
            className="soluna-logo-sidebar"
          />
        </div>
        <nav className="sidebar-menu" onClick={() => setIsOpen(false)}>
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
    </>
  );
};

export default Sidebar;
