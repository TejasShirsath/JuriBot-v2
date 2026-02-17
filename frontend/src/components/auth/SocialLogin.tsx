import React from "react";
import { motion } from "framer-motion";

interface SocialLoginProps {
  onGoogleClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const SocialLogin: React.FC<SocialLoginProps> = ({
  onGoogleClick,
  isLoading,
  disabled
}) => {
  return (
    <div className="mt-6">
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-charcoal/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-ivory px-2 text-charcoal/40 font-medium">
            Or continue with
          </span>
        </div>
      </div>

      <motion.button
        whileHover={!disabled ? { scale: 1.01 } : {}}
        whileTap={!disabled ? { scale: 0.99 } : {}}
        onClick={onGoogleClick}
        disabled={isLoading || disabled}
        type="button"
        className="w-full bg-white border border-charcoal/10 text-charcoal py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.64 12.2045C20.64 11.4034 20.5847 10.6121 20.45 9.92139H12.2136V12.8718H17.067C16.9749 13.9022 16.514 15.6599 15.0217 16.7118L14.9961 16.8524L17.6015 18.825L17.7831 18.8432C19.4184 17.3676 20.64 15.0211 20.64 12.2045Z"
            fill="#4285F4"
          />
          <path
            d="M12.2137 20.6399C14.5882 20.6399 16.5768 19.8665 18.0317 18.5447L15.0218 16.206C14.285 16.7027 13.3197 17.0251 12.2173 17.0251C9.88879 17.0251 7.91526 15.4852 7.2023 13.3855L7.06764 13.3969L4.36859 15.4419L4.32178 15.5714C5.77665 18.4063 8.76101 20.6399 12.2137 20.6399Z"
            fill="#34A853"
          />
          <path
            d="M7.20223 13.3855C7.01804 12.8443 6.91485 12.2681 6.91485 11.6661C6.91485 11.0642 7.01436 10.4879 7.19486 9.94672L7.18953 9.79153L4.4754 7.71973L4.32171 7.76077C3.12301 10.1197 3.12301 13.2125 4.32171 15.5714L7.20223 13.3855Z"
            fill="#FBBC05"
          />
          <path
            d="M12.2137 6.30713C13.8439 6.30713 15.0033 7.00031 15.6265 7.58288L18.1091 5.16042C16.5731 3.75549 14.5846 2.69238 12.2137 2.69238C8.76101 2.69238 5.77665 4.92598 4.32178 7.76077L7.19493 9.94672C7.91157 7.84705 9.88879 6.30713 12.2137 6.30713Z"
            fill="#EB4335"
          />
        </svg>
        Google
      </motion.button>
    </div>
  );
};
