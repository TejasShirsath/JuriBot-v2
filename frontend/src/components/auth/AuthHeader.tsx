import React from "react";
import { Link } from "react-router-dom";

interface AuthHeaderProps {
  mode: "signin" | "signup" | "forgot-password";
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ mode }) => {
  const getTitle = () => {
    switch (mode) {
      case "signin": return "Welcome Back";
      case "signup": return "Create Account";
      case "forgot-password": return "Reset Password";
      default: return "";
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case "signin": return "Enter your details to access your legal companion";
      case "signup": return "Join us to democratize legal knowledge";
      case "forgot-password": return "Enter your email to receive reset instructions";
      default: return "";
    }
  };

  return (
    <div className="text-center mb-8">
      <Link to="/" state={{ skipLoading: true }} className="inline-block mb-4">
        {/* Make sure logo.svg exists in your public folder */}
        <img src="/logo.svg" alt="Juribot Logo" className="h-20 w-auto" />
      </Link>
      <h1 className="font-serif text-3xl font-bold text-charcoal mb-2">
        {getTitle()}
      </h1>
      <p className="text-charcoal/80 text-sm font-sans font-medium">
        {getSubtitle()}
      </p>
    </div>
  );
};