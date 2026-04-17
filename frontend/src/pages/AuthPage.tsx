import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signInWithPopup, 
  updateProfile 
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

import { AuthInput } from "../components/auth/AuthInput";
import { AuthHeader } from "../components/auth/AuthHeader";
import { TermsModal } from "../components/auth/TermsModal";
import { SocialLogin } from "../components/auth/SocialLogin";

type AuthMode = "signin" | "signup" | "forgot-password";

interface FirebaseError {
  code: string;
  message: string;
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
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
    setTermsAccepted(false);
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

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/home");
    } catch (err) {
      const error = err as FirebaseError;
      console.error("Google Sign-In Error:", error.code);
      setErrors({ auth: getErrorMessage(error.code) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    navigate("/home");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      if (mode === "signup") {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await updateProfile(userCredential.user, { displayName: formData.name });
        navigate("/home");
      } else if (mode === "signin") {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        navigate("/home");
      } else if (mode === "forgot-password") {
        await sendPasswordResetEmail(auth, formData.email);
        alert("Password reset link sent to your email!");
        setMode("signin");
      }
    } catch (err) {
      const error = err as FirebaseError;
      console.error("Auth Error:", error.code);
      setErrors({ auth: getErrorMessage(error.code) });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/invalid-credential":
        return "Invalid credentials. Please check your email and password.";
      case "auth/email-already-in-use":
        return "This email is already registered. Please sign in instead.";
      case "auth/invalid-email":
        return "The email address is not valid.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
      case "auth/user-disabled":
        return "This account has been disabled. Please contact support.";
      case "auth/network-request-failed":
        return "Network error. Please check your connection.";
      case "auth/popup-closed-by-user":
        return "Sign-in cancelled by user.";
      default:
        return "Authentication failed. Please try again.";
    }
  };

  return (
    <div className="min-h-screen w-full bg-ivory flex items-center justify-center p-4 py-16 relative overflow-y-auto">
      {/* Background Watermark */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[20rem] text-charcoal whitespace-nowrap">
          JURIBOT
        </span>
      </div>

      <div className="relative w-full max-w-md">
        <Link
          to="/"
          state={{ skipLoading: true }}
          className="absolute -top-12 left-0 text-gold hover:text-coffee transition-colors z-50 flex items-center gap-2 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-sans font-bold tracking-wider text-sm">BACK</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full bg-white/50 backdrop-blur-sm border border-charcoal/10 rounded-2xl shadow-xl overflow-hidden relative z-10"
        >
          <div className="p-8">
            <AuthHeader mode={mode} />

            {errors.auth && (
              <p className="text-red-500 text-sm text-center mb-4 font-medium">{errors.auth}</p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col">
              <AnimatePresence mode="wait">
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                icon={Mail}
                error={errors.email}
              />

              <AnimatePresence mode="wait">
                {mode !== "forgot-password" && (
                  <motion.div
                    key="password-field"
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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

              <AnimatePresence mode="wait">
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                      icon={Lock}
                      error={errors.confirmPassword}
                    />
                  </motion.div>
                )}
              </AnimatePresence>


              {mode === "signup" && (
                <div className="flex items-start gap-2 mb-6">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="peer h-4 w-4 shrink-0 cursor-pointer appearance-none rounded border border-charcoal/20 transition-all checked:bg-coffee checked:border-coffee hover:border-coffee focus:outline-none focus:ring-1 focus:ring-coffee/20"
                    />
                    <svg
                      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 text-ivory opacity-0 peer-checked:opacity-100 transition-opacity"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <label htmlFor="terms" className="text-xs text-charcoal/70 leading-relaxed select-none">
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className="text-coffee font-bold hover:underline cursor-pointer focus:outline-none"
                    >
                      Terms & Conditions
                    </button>
                  </label>
                </div>
              )}

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
                disabled={isLoading || (mode === "signup" && !termsAccepted)}
                className="w-full bg-charcoal text-ivory py-3 rounded-lg font-medium hover:bg-coffee transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-charcoal group cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === "signin" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
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
                <SocialLogin 
                  onGoogleClick={handleGoogleSignIn}
                  onGuestClick={handleGuestLogin}
                  isLoading={isLoading} 
                  disabled={mode === "signup" && !termsAccepted}
                />

                <div className="mt-8 text-center">
                  <p className="text-charcoal/60 text-sm">
                    {mode === "signin" ? "Don't have an account?" : "Already have an account?"}
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
      
      <TermsModal 
        isOpen={showTermsModal} 
        onClose={() => setShowTermsModal(false)} 
        onAccept={() => {
          setTermsAccepted(true);
          setShowTermsModal(false);
        }}
      />
    </div>
  );
}