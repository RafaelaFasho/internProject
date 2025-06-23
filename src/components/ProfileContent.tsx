import React from "react";
import { User, LogOut } from "lucide-react";
import "../styles/profile.css";

interface ProfileContentProps {
  fullName: string;
  email: string;
  birthdate: string;
  phone: string;
  username: string;
  onLogout: () => void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  fullName,
  email,
  birthdate,
  phone,
  username,
  onLogout,
}) => {
  return (
    <div className="profile-container">
      <div className="profile-avatar">
        <User size={48} />
      </div>
      <div className="profile-info">
        <div className="profile-row">
          <span className="label">Full Name</span>
          <span>{fullName}</span>
        </div>
        <div className="profile-row">
          <span className="label">Email</span>
          <span>{email}</span>
        </div>
        <div className="profile-row">
          <span className="label">Birthdate</span>
          <span>{birthdate}</span>
        </div>
        <div className="profile-row">
          <span className="label">Phone</span>
          <span>{phone}</span>
        </div>
        <div className="profile-row">
          <span className="label">Username</span>
          <span>{username}</span>
        </div>
      </div>
      <button className="logout-button" onClick={onLogout}>
        <LogOut size={20} />
        Log out
      </button>
    </div>
  );
};

export default ProfileContent;
