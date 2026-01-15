import React from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

interface AuthInputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ElementType;
  error?: string;
  showPasswordToggle?: boolean;
  isPasswordVisible?: boolean;
  onTogglePassword?: () => void;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  icon: Icon,
  error,
  showPasswordToggle,
  isPasswordVisible,
  onTogglePassword,
}) => {
  return (
    <div className="mb-4">
      <div className="relative">
        <input
          type={showPasswordToggle && isPasswordVisible ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`peer w-full bg-white/50 border ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-charcoal/20 focus:border-coffee focus:ring-coffee"
          } rounded-lg py-3 pl-10 pr-4 ${
            showPasswordToggle ? "pr-10" : ""
          } text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-1 focus:ring-inset transition-all`}
        />

        <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors pointer-events-none ${
          error ? "text-red-400" : "text-charcoal/40 peer-focus:text-coffee"
        }`} />

        {showPasswordToggle && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal transition-colors cursor-pointer"
          >
            {isPasswordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}

        {error && !showPasswordToggle && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
            <AlertCircle className="w-4 h-4" />
          </div>
        )}
      </div>
      
      {/* Animated Error Text */}
      {error && (
        <p className="text-red-500 text-[11px] mt-1 ml-1 font-medium animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};