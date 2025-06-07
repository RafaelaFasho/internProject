import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants/constants";
import { useState, useEffect, ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (!token) {
      setIsAuthorized(false);
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        // Token ka skaduar
        setIsAuthorized(false);
      } else {
        // Token valid
        setIsAuthorized(true);
      }
    } catch (error) {
      setIsAuthorized(false);
    }
  }, []);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
