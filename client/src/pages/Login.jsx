import React, { useState, useContext } from 'react';
import { Mail, Lock, Eye, EyeOff, UserSearch } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
          email: form.email,
          password: form.password
      });

      login(res.data.user, res.data.token);
      navigate("/");

    } catch (err) {
      console.error("Login failed", err);
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/google", { 
        token: credentialResponse.credential 
      });

      login(res.data.user, res.data.token);
      navigate("/");

    } catch (err) {
      console.error("Google login failed", err);
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <main className="flex-1 flex flex-col lg:flex-row bg-white dark:bg-slate-900 rounded-[40px] shadow-[0_20px_70px_-10px_rgba(110,95,240,0.1)] border border-slate-100 dark:border-slate-800 overflow-hidden">
        
        {/* LEFT SECTION */}
        <div className="lg:w-1/2 bg-gradient-to-br from-[#F8F7FF] to-[#EFEDFF] dark:from-slate-800 dark:to-slate-900 p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-block bg-white dark:bg-slate-700 px-4 py-1.5 rounded-full text-[11px] font-bold text-[#9E90FE] shadow-sm uppercase tracking-widest mb-6 border border-white dark:border-slate-600">
              Welcome Back! 👋
            </span>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white leading-[1.1] mb-4">
              Find your <span className="text-[#9E90FE]">Dream Job</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base max-w-xs">
              The most reliable platform to jumpstart your professional journey.
            </p>
          </div>

          <div className="relative flex items-center justify-center py-10">
            <div className="absolute w-64 h-64 bg-[#9E90FE] rounded-full blur-[100px] opacity-20"></div>
            <div className="relative z-10 bg-white dark:bg-slate-800 p-12 rounded-[3rem] shadow-2xl border border-purple-50 dark:border-slate-700 flex items-center justify-center transform hover:rotate-3 transition-transform duration-500">
              <UserSearch size={120} className="text-[#9E90FE]" strokeWidth={1} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 relative z-10">
            {['Thousands of Jobs', 'Verified Companies', 'Easy Application', 'Career Growth'].map((text) => (
              <div key={text} className="flex items-center gap-2 text-[12px] font-bold text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-2.5 rounded-2xl border border-white/50 dark:border-slate-700">
                <div className="bg-[#9E90FE] rounded-full p-1">
                  <div className="w-1.5 h-1.5 border-r-2 border-b-2 border-white rotate-45 transform -translate-y-0.5" />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center bg-white dark:bg-slate-900">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Login to your account</h2>
          <p className="text-slate-400 font-medium mb-8">Enter your credentials to continue</p>

          {error && <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm font-bold rounded-xl border border-red-100">{error}</div>}

          <form className="space-y-6" onSubmit={handleStandardLogin}>
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-3">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
                <input 
                  type="email" name="email" value={form.email} onChange={handleChange} required
                  placeholder="you@example.com" // ✅ Added Placeholder
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-purple-100 outline-none transition-all dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-3">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} required
                  placeholder="••••••••" // ✅ Added Placeholder
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-purple-100 outline-none transition-all dark:text-white"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-slate-400 hover:text-[#9E90FE]">
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#B5ACFF] to-[#9E90FE] text-white font-black rounded-2xl shadow-xl shadow-purple-200 hover:shadow-2xl transition-all active:scale-95">
              Login
            </button>
          </form>

          <div className="relative my-10 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800"></div></div>
            <span className="relative bg-white dark:bg-slate-900 px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">or continue with</span>
          </div>

          <div className="flex justify-center">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.log("Login Failed")} />
          </div>

          <p className="mt-10 text-center text-sm font-bold text-slate-400">
            Don't have an account? <Link to="/signup" className="text-[#9E90FE] hover:underline font-bold">Sign Up</Link>
          </p>
        </div>
      </main>
    </GoogleOAuthProvider>
  );
}