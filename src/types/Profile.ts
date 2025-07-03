export interface ProfileData {
  username: string;
  fullName: string;
  email: string;
  birthdate: string;
  phone: string;
  joinedDate: string;
}

export interface ProfileContentProps {
  fullName: string;
  email: string;
  birthdate: string;
  phone: string;
  username: string;
  onLogout: () => void;
}
