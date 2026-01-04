import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, User, ArrowRight, ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthInput } from "../components/auth/AuthInput";
import { AuthHeader } from "../components/auth/AuthHeader";
import { SocialLogin } from "../components/auth/SocialLogin";

type AuthMode = "signin" | "signup" | "forgot-password";

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setErrors({});
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (mode === "signup" && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (mode !== "forgot-password") {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
      if (mode === "signup" && formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    // API call
    setTimeout(() => {
      setIsLoading(false);
      if (mode === "forgot-password") {
        alert("Password reset link sent to your email!");
        setMode("signin");
      } else {
        navigate("/home");
      }
    }, 1500);
  };

  return (
    <div className="h-screen w-full bg-ivory flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[20rem] text-charcoal whitespace-nowrap">
          JURIBOT
        </span>
      </div>

      <div className="relative w-full max-w-md">
        <Link
          to="/"
          state={{ skipLoading: true }}
          className="absolute -top-12 left-0 md:-left-24 md:top-0 text-gold hover:text-coffee transition-colors z-50 flex items-center gap-2 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-sans font-bold tracking-wider text-sm">
            BACK
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full bg-white/50 backdrop-blur-sm border border-charcoal/10 rounded-2xl shadow-xl overflow-hidden relative z-10"
        >
          <div className="p-8">
            <AuthHeader mode={mode} />

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col">
              <AnimatePresence>
                {mode === "signup" && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <AuthInput
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      icon={User}
                      error={errors.name}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <AuthInput
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                icon={Mail}
                error={errors.email}
              />

              <AnimatePresence>
                {mode !== "forgot-password" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <AuthInput
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      icon={Lock}
                      error={errors.password}
                      showPasswordToggle
                      isPasswordVisible={showPassword}
                      onTogglePassword={() => setShowPassword(!showPassword)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {mode === "signup" && (
                  <motion.div
                    key="confirm-password-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <AuthInput
                      type="password"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      icon={Lock}
                      error={errors.confirmPassword}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {mode === "signin" && (
                <div className="flex justify-end mb-4">
                  <button
                    type="button"
                    onClick={() => setMode("forgot-password")}
                    className="text-xs text-charcoal/60 hover:text-coffee transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-charcoal text-ivory py-3 rounded-lg font-medium hover:bg-coffee transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === "signin"
                      ? "Sign In"
                      : mode === "signup"
                      ? "Create Account"
                      : "Send Reset Link"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {mode === "forgot-password" && (
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="w-full mt-4 text-charcoal/60 hover:text-coffee transition-colors text-sm font-medium cursor-pointer"
                >
                  Back to Sign In
                </button>
              )}
            </form>

            {mode !== "forgot-password" && (
              <>
                <SocialLogin />

                <div className="mt-8 text-center">
                  <p className="text-charcoal/60 text-sm">
                    {mode === "signin"
                      ? "Don't have an account?"
                      : "Already have an account?"}
                    <button
                      onClick={toggleMode}
                      className="ml-2 text-coffee font-medium hover:underline focus:outline-none cursor-pointer"
                    >
                      {mode === "signin" ? "Sign Up" : "Sign In"}
                    </button>
                  </p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
