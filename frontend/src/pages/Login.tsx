/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight, Heart } from "lucide-react";

export default function Login() {
  const { setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({ email: "", password: "" });

    try {
      const data = await loginUser({ email, password });
      if (data.token) {
        setToken(data.token);
        navigate("/dashboard");
      } else {
        setErrors({ email: "", password: data.message || "Login failed" });
      }
    } catch (error) {
      setErrors({ email: "", password: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce shadow-xl opacity-30"></div>
      <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full animate-pulse shadow-xl opacity-30"></div>
      <div className="absolute top-1/4 -left-12 w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full animate-ping shadow-xl opacity-20"></div>
      <div className="absolute bottom-1/4 -right-12 w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full animate-pulse shadow-xl opacity-20"></div>

      <div className="w-full max-w-md relative">
        {/* Back to home link */}
        <div className="text-center mb-8">
          <a 
            href="/landing" 
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors font-medium"
          >
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg rotate-12 transform"></div>
                <Sparkles className="absolute inset-0 w-5 h-5 text-white m-auto rotate-12" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                SweetShop
              </span>
            </div>
          </a>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 px-8 py-6 text-white relative">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
              <p className="text-white/90">Sign in to your sweet shop account</p>
            </div>
            <Heart className="absolute top-4 right-6 w-6 h-6 text-white/20" />
            <Sparkles className="absolute bottom-4 right-8 w-4 h-4 text-white/30" />
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-pink-500" />
                  <span>Email Address</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full bg-white/50 border-2 rounded-2xl px-4 py-4 pl-12 transition-all duration-300 focus:outline-none focus:ring-0 placeholder-gray-400 ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-pink-200 focus:border-pink-500 hover:border-pink-300'
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm font-medium">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-pink-500" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`w-full bg-white/50 border-2 rounded-2xl px-4 py-4 pl-12 pr-12 transition-all duration-300 focus:outline-none focus:ring-0 placeholder-gray-400 ${
                      errors.password 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-pink-200 focus:border-pink-500 hover:border-pink-300'
                    }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm font-medium">{errors.password}</p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <a 
                  href="#" 
                  className="text-sm text-pink-600 hover:text-pink-700 font-medium transition-colors"
                >
                  Forgot your password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-4 rounded-2xl hover:from-pink-600 hover:to-rose-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl font-semibold text-lg group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent"></div>
              <span className="px-4 text-sm text-gray-500 font-medium">or</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent"></div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a 
                  href="/register" 
                  className="text-pink-600 hover:text-pink-700 font-semibold transition-colors"
                >
                  Create one now
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            By signing in, you agree to our{" "}
            <a href="#" className="text-pink-600 hover:text-pink-700 transition-colors">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-pink-600 hover:text-pink-700 transition-colors">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}