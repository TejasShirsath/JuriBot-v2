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
      <div className="relative group">
        <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
          error ? "text-red-400" : "text-charcoal/40 group-focus-within:text-coffee"
        }`} />
        
        <input
          type={showPasswordToggle && isPasswordVisible ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full bg-white/50 border ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-charcoal/10 focus:border-coffee focus:ring-coffee"
          } rounded-lg py-3 pl-10 pr-4 ${
            showPasswordToggle ? "pr-10" : ""
          } text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-1 transition-all`}
        />

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
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
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