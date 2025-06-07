import { useEffect, useState } from "react";
import ProfileContent from "../components/ProfileContent";
import Sidebar from "../components/Sidebar";
import "../index.css";
import { ACCESS_TOKEN } from "../constants/constants";

interface ProfileData {
  username: string;
  fullName: string;
  email: string;
  birthdate: string;
  phone: string;
  joinedDate: string;
}

function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) throw new Error("No access token found");

        const response = await fetch(
          "http://192.168.10.248:2208/api/authentication/user",
          {
            headers: {
              token: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();

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
