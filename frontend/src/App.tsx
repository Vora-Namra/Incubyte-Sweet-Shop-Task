import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider, useAuth } from "./context/AuthContext";
import type { JSX } from "react";
import Sweets from "./pages/Sweets";
import Landing from "./pages/Landing";
import { Toaster } from "react-hot-toast";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  // Check if environment variable is loaded
  console.log("VITE_BACKEND_URL:", import.meta.env.VITE_BACKEND_URL);
  
  return (
    <AuthProvider>
      <Router>  
      <Routes>
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Sweets /></ProtectedRoute>} />
          
          <Route path="/" element={<Navigate to="/landing" replace />} />
        </Routes>
      </Router>
      <Toaster position="top-right" reverseOrder={false} />

    </AuthProvider>
  );
}