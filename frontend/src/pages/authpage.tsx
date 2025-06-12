import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Sun,
  Moon,
  Mail,
  Lock,
  User,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { loginrequst, register } from "../service/authservice";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth.contexts";

type AuthMode = "login" | "signup";

interface User {
  id: string;
  username: string;
  email: string;
}

export default function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
const navigate=useNavigate()
  const { login } = useAuth();
  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDarkMode(savedTheme === "dark" || (!savedTheme && prefersDark));
  }, []);

  // Apply dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setValidationErrors({});

    // Basic client-side validation
    if (!email.trim()) {
      setError("Email is required");
      setIsLoading(false);
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      setIsLoading(false);
      return;
    }
    if (mode === "signup" && !username.trim()) {
      setError("Username is required");
      setIsLoading(false);
      return;
    }
    if (mode === "signup" && password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      let response;
      if (mode === "login") {
        response = await loginrequst(email, password);
        console.log(response);
        localStorage.setItem("access", response.data.access);
        if (response.status && response.status == 200) {
          // alert(`Welcome back! (This is a demo)`);
          // Here you would typically call your login context/state management
          clearForm();
          login(response.data.user);
          // navigate("/");
        } else {
          // Handle different types of error responses
          if (response.details && typeof response.details === "object") {
            // If there are validation errors (like password requirements)
            setValidationErrors(response.details);
          } else {
            // General error message
            setError(response.message || "Invalid email or password");
          }
        }
      } else {
        response = await register(username, email, password);
        console.log(response);
        localStorage.setItem('uid',response.data.uid)
        navigate('/otp')
        if (response.success) {
          setSignupSuccess(true);
          setTimeout(() => {
            setMode("login");
            setSignupSuccess(false);
            setUsername("");
            setPassword("");
          }, 1500);
        } else {
          // Handle different types of error responses for signup
          if (response.details && typeof response.details === "object") {
            setValidationErrors(response.details);
          } else {
            setError(response.message || "Failed to sign up");
          }
        }
      }
    } catch (err:any) {
      console.log("error is ", err);

      setValidationErrors(err.details);
      // Better error handling for catch block
      if (err instanceof Error) {
        try {
          // Try to parse as JSON if it's a string
          const errorData = JSON.parse(err.message);
          console.log(errorData, "dataaaa");

          if (errorData.details && typeof errorData.details === "object") {
          } else {
            setError(errorData.error || err.message);
          }
        } catch {
          // If it's not JSON, use the error message directly
          setError(err.message);
        }
      } else {
        setError("Authentication failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    clearForm();
    setError(null);
    setValidationErrors({});
    setSignupSuccess(false);
  };

  const clearForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="max-w-md w-full">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            aria-label="Toggle theme">
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 transform transition-all duration-500">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              {mode === "login" ? (
                <Lock className="w-8 h-8 text-white" />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {mode === "login"
                ? "Sign in to your account"
                : "Sign up for a new account"}
            </p>
          </div>

          {/* Success Message */}
          {signupSuccess && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 rounded-xl animate-pulse">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3" />
                <span>Signup successful! Redirecting to login...</span>
              </div>
            </div>
          )}

          {/* General Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 rounded-xl">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-3" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Validation Errors */}
          {Object.keys(validationErrors).length > 0 && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 rounded-xl">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  {Object.entries(validationErrors).map(([field, message]) => (
                    <div key={field} className="text-sm">
                      <strong className="capitalize">{field}:</strong> {message}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            {mode === "signup" && (
              <div className="transform transition-all duration-300">
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border ${
                      validationErrors.username
                        ? "border-red-300 dark:border-red-600"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-650 disabled:opacity-50`}
                    placeholder="Enter your username"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border ${
                    validationErrors.email
                      ? "border-red-300 dark:border-red-600"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-650 disabled:opacity-50`}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border ${
                    validationErrors.password
                      ? "border-red-300 dark:border-red-600"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-650 disabled:opacity-50`}
                  placeholder="Enter your password"
                  required
                  minLength={mode === "signup" ? 6 : undefined}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {mode === "signup" && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            {/* Demo Info */}
            {mode === "login" && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                <strong>Demo credentials:</strong> demo@example.com / password
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                <>
                  {mode === "login" ? (
                    <Lock className="w-5 h-5" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  {mode === "login" ? "Sign In" : "Sign Up"}
                </>
              )}
            </button>
          </form>

          {/* Mode Toggle */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
              <button
                type="button"
                onClick={toggleMode}
                disabled={isLoading}
                className="ml-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 underline-offset-4 hover:underline disabled:opacity-50">
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
