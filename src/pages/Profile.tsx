import { useEffect, useState } from "react";
import ProfileContent from "../components/ProfileContent";
import Sidebar from "../components/Sidebar";
import "../styles/profile.css";
import { ACCESS_TOKEN } from "../constants/constants";
import axiosInstance from "../utils/axios";
import { ProfileData } from "../types/Profile";

function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) throw new Error("No access token found");

        const response = await axiosInstance.get(`/authentication/user/`, {
          headers: {
            token: token,
          },
        });

        const data = response.data;

        const fullName =
          data.fullName ||
          (data.firstName && data.lastName
            ? `${data.firstName} ${data.lastName}`
            : "");

        setProfile({
          username: data.username,
          fullName,
          email: data.email,
          birthdate: data.birthdate,
          phone: data.phone,
          joinedDate: data.joinedDate,
        });
      } catch (err: any) {
        setError(err.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);

    window.location.href = "/login";
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile data found.</div>;

  return (
    <div className="page">
      <Sidebar />
      <div className="main-content">
        <ProfileContent
          username={profile.username}
          fullName={profile.fullName}
          email={profile.email}
          birthdate={profile.birthdate}
          phone={profile.phone}
          onLogout={handleLogout}
        />
      </div>
    </div>
  );
}

export default Profile;
