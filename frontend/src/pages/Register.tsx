/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { registerUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowRight, Heart, Star } from "lucide-react";
import toast from "react-hot-toast";

export default function Register() {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    general: ""
  });

  const validateForm = () => {
    const newErrors = { name: "", email: "", password: "", general: "" };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "Full name is required";
      isValid = false;
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Valid email is required";
      isValid = false;
    }

    if (!password || password.length < 6) {
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
    setErrors({ name: "", email: "", password: "", general: "" });

    try {
      const data = await registerUser({ name: name.trim(), email, password });
      if (data.token) {
        setToken(data.token);
        toast.success("Registration successful!");
        navigate("/dashboard");
      } else {
        setErrors({ name: "", email: "", password: "", general: data.message || "Registration failed" });
        toast.error(data.message || "Registration failed");
      }
    } catch {
      setErrors({ name: "", email: "", password: "", general: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce shadow-xl opacity-30"></div>
      <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full animate-pulse shadow-xl opacity-30"></div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <a href="/landing" className="inline-flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors font-medium">
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

        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 px-8 py-6 text-white relative">
            <h1 className="text-3xl font-bold mb-2">Join SweetShop!</h1>
            <p className="text-white/90">Create your account and start managing your sweet business</p>
            <Star className="absolute top-4 right-6 w-6 h-6 text-white/20 fill-current" />
            <Heart className="absolute bottom-4 right-8 w-4 h-4 text-white/30" />
          </div>

          <div className="p-8">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-6">
                <p className="text-sm font-medium">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                  <User className="w-4 h-4 text-pink-500" />
                  <span>Full Name</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className={`w-full bg-white/50 border-2 rounded-2xl px-4 py-4 pl-12 transition-all duration-300 focus:outline-none focus:ring-0 placeholder-gray-400 ${
                      errors.name ? 'border-red-300 focus:border-red-500' : 'border-pink-200 focus:border-pink-500 hover:border-pink-300'
                    }`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {errors.name && <p className="text-red-500 text-sm font-medium">{errors.name}</p>}
              </div>

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
                      errors.email ? 'border-red-300 focus:border-red-500' : 'border-pink-200 focus:border-pink-500 hover:border-pink-300'
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {errors.email && <p className="text-red-500 text-sm font-medium">{errors.email}</p>}
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
                    placeholder="Create a password"
                    className={`w-full bg-white/50 border-2 rounded-2xl px-4 py-4 pl-12 pr-12 transition-all duration-300 focus:outline-none focus:ring-0 placeholder-gray-400 ${
                      errors.password ? 'border-red-300 focus:border-red-500' : 'border-pink-200 focus:border-pink-500 hover:border-pink-300'
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
                {errors.password && <p className="text-red-500 text-sm font-medium">{errors.password}</p>}
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
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Create Account</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
