import { useState } from "react";
import { registerUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = await registerUser({ name, email, password });

    if (data.token) {
      setToken(data.token);
      alert("Registration successful");
      navigate("/");
    } else {
      alert(data.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-pink-100 via-white to-blue-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-xl rounded-lg w-96 space-y-4 border border-gray-200"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">Create Account</h1>
        <p className="text-sm text-gray-500 text-center">
          Fill the details to register
        </p>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-gray-500 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
