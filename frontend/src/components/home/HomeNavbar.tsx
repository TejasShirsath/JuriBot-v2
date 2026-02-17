import React from "react";
import { LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface HomeNavbarProps {
  sectionTitle?: string;
}

export const HomeNavbar: React.FC<HomeNavbarProps> = ({ sectionTitle = "Workspace" }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav className="w-full z-40 px-6 md:px-12 py-4 bg-white/90 backdrop-blur-sm border-b border-stone-100">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="shrink-0">
          <Link to="/home" className="font-serif text-2xl font-bold tracking-wide text-charcoal flex items-center gap-2 hover:opacity-80 transition-opacity">
            JURIBOT
            <span className="text-[10px] bg-coffee text-ivory px-2 py-0.5 rounded-full font-sans tracking-widest uppercase">
              {sectionTitle}
            </span>
          </Link>
        </div>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-charcoal">{currentUser?.displayName || currentUser?.email || "User"}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-coffee/10 border border-coffee/20 flex items-center justify-center overflow-hidden">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="text-coffee h-5 w-5" />
              )}
            </div>
          </div>

          <div className="h-8 w-px bg-charcoal/10 mx-2 hidden md:block"></div>
          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 text-charcoal/60 hover:text-red-600 transition-colors duration-300 cursor-pointer"
          >
            <LogOut size={20} className="transition-transform duration-300" />
            <span className="text-xs font-bold tracking-widest hidden md:block group-hover:translate-x-1 transition-transform duration-300">
              LOGOUT
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};
