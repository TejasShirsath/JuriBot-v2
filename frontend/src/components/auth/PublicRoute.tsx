import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-ivory">
        <div className="w-8 h-8 border-2 border-coffee/30 border-t-coffee rounded-full animate-spin" />
      </div>
    );
  }

  if (currentUser) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};
