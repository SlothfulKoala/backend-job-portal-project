import React, { useState, useContext } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Building2, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { AuthContext } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('seeker'); 
  const [error, setError] = useState(null);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= SIGNUP =================
  const handleStandardSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match!");
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",   // ✅ FIXED
        {
          name: form.fullName,
          email: form.email,
          password: form.password,
          role: role
        }
      );

      console.log("Registered User:", res.data);

      // Save user + token in context
      login(res.data.user, res.data.token);

      // Redirect
      navigate("/");

    } catch (err) {
      console.error("Signup failed", err);
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  // ================= GOOGLE SIGNUP =================
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/google",   // ✅ FIXED
        { token: credentialResponse.credential, role: role }
      );

      console.log("User:", res.data);

      // Use same login system
      login(res.data.user, res.data.token);

      navigate("/");

    } catch (err) {
      console.error("Google signup failed", err);
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <main className="flex-1 flex flex-col lg:flex-row bg-white dark:bg-slate-900 rounded-[40px] shadow-[0_20px_70px_-10px_rgba(110,95,240,0.1)] border border-slate-100 dark:border-slate-800 overflow-hidden">
        
        {/* LEFT SECTION (UNCHANGED) */}
        <div className="lg:w-1/2 bg-gradient-to-br from-[#F8F7FF] to-[#EFEDFF] dark:from-slate-800 dark:to-slate-900 p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-block bg-white dark:bg-slate-700 px-4 py-1.5 rounded-full text-[11px] font-bold text-[#9E90FE] shadow-sm uppercase tracking-widest mb-6 border border-white dark:border-slate-600">
              Create Account ✨
            </span>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white leading-[1.1] mb-4">
              Join <span className="text-[#9E90FE]">CareerVista</span> today!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-xs">
              Create your account and take the first step towards your dream career.
            </p>
          </div>

          <div className="relative flex items-center justify-center py-6">
            <div className="absolute w-72 h-72 bg-[#9E90FE]/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-2xl border border-purple-50 dark:border-slate-700 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                 <div className="flex -space-x-4">
                    <div className="w-12 h-12 rounded-full bg-purple-400 border-4 border-white dark:border-slate-900"></div>
                    <div className="w-12 h-12 rounded-full bg-blue-400 border-4 border-white dark:border-slate-900"></div>
                    <div className="w-12 h-12 rounded-full bg-indigo-400 border-4 border-white dark:border-slate-900 flex items-center justify-center text-white text-xs font-bold">+</div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION (FORM UI UNCHANGED) */}
        <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center bg-white dark:bg-slate-900 overflow-y-auto">

          {error && <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm font-bold rounded-xl">{error}</div>}

          <form onSubmit={handleStandardSignup}>
            {/* your UI inputs remain EXACTLY same */}
          </form>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log("Login Failed")}
            />
          </div>

        </div>
      </main>
    </GoogleOAuthProvider>
  );
}