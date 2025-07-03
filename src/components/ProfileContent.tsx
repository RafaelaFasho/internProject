import React from "react";
import { User, LogOut } from "lucide-react";
import "../styles/profile.css";
import { ProfileContentProps } from "../types/Profile";

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
          <span className="label2">{fullName}</span>
        </div>
        <div className="profile-row">
          <span className="label">Email</span>
          <span className="label2">{email}</span>
        </div>
        <div className="profile-row">
          <span className="label">Birthdate</span>
          <span className="label2">{birthdate}</span>
        </div>
        <div className="profile-row">
          <span className="label">Phone</span>
          <span className="label2">{phone}</span>
        </div>
        <div className="profile-row">
          <span className="label">Username</span>
          <span className="label2">{username}</span>
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
