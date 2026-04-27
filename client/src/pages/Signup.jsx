import React, { useState, useContext } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Building2, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { AuthContext } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('seeker'); 
  const [error, setError] = useState(null);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStandardSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match!");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: role
      });

      login(res.data.user, res.data.token); 
      navigate("/"); 

    } catch (err) {
      console.error("Signup failed", err);
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        token: credentialResponse.credential,
        role: role 
      });
      
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      console.error("Google signup failed", err);
      setError("Google authentication failed.");
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <main className="flex-1 flex flex-col lg:flex-row bg-white dark:bg-slate-900 rounded-[40px] shadow-[0_20px_70px_-10px_rgba(110,95,240,0.1)] border border-slate-100 dark:border-slate-800 overflow-hidden">
        
        {/* LEFT SECTION */}
        <div className="lg:w-1/2 bg-linear-to-br from-[#F8F7FF] to-[#EFEDFF] dark:from-slate-800 dark:to-slate-900 p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-block bg-white dark:bg-slate-700 px-4 py-1.5 rounded-full text-[11px] font-bold text-[#9E90FE] shadow-sm uppercase tracking-widest mb-6 border border-white dark:border-slate-600">
              Create Account ✨
            </span>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white leading-[1.1] mb-4">
              Join <span className="text-[#9E90FE]">CareerVista</span> today!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-xs">
              The first step towards your professional breakthrough starts here.
            </p>
          </div>

          <div className="relative flex items-center justify-center py-6">
            <div className="absolute w-72 h-72 bg-[#9E90FE]/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-2xl border border-purple-50 dark:border-slate-700 flex items-center justify-center">
               <User size={80} className="text-[#9E90FE]" strokeWidth={1} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 relative z-10">
            {['Personalized Job Matches', 'Quick & Easy Application', 'Track Your Progress'].map((text) => (
              <div key={text} className="flex items-center gap-3 text-[13px] font-bold text-slate-600 dark:text-slate-300">
                <CheckCircle2 size={18} className="text-[#9E90FE]" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SECTION: Signup Form */}
        <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center bg-white dark:bg-slate-900 overflow-y-auto">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Create your account</h2>
          <p className="text-slate-400 dark:text-slate-500 font-medium mb-6">Enter your details to get started</p>

          {error && <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm font-bold rounded-xl border border-red-100">{error}</div>}

          <form className="space-y-5" onSubmit={handleStandardSignup}>
            
            {/* ✅ DYNAMIC NAME INPUT */}
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">
                {role === 'employer' ? 'Full Name' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input 
                  type="text" name="name" value={form.name} onChange={handleChange} required
                  placeholder={role === 'employer' ? "e.g. Google, Microsoft" : "John Doe"} 
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-purple-100 outline-none transition-all dark:text-white" 
                />
              </div>
            </div>

            {/* ✅ DYNAMIC EMAIL INPUT */}
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">
                {role === 'employer' ? 'Company Email' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input 
                  type="email" name="email" value={form.email} onChange={handleChange} required
                  placeholder={role === 'employer' ? "hr@company.com" : "you@example.com"} 
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-purple-100 outline-none transition-all dark:text-white" 
                />
              </div>
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} required minLength={6}
                    placeholder="••••••••" 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-purple-100 outline-none transition-all dark:text-white" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required
                    placeholder="••••••••" 
                    className="w-full pl-12 pr-10 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-purple-100 outline-none transition-all dark:text-white" 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-slate-400 hover:text-[#9E90FE]">
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-3">I am a</label>
              <div className="grid grid-cols-2 gap-4">
                 <button type="button" onClick={() => setRole('seeker')} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'seeker' ? 'border-[#9E90FE] bg-purple-50 dark:bg-purple-900/20' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}>
                    <User size={20} className={role === 'seeker' ? 'text-[#9E90FE]' : 'text-slate-400'} />
                    <span className={`text-xs font-bold ${role === 'seeker' ? 'text-[#9E90FE]' : 'text-slate-500'}`}>Job Seeker</span>
                 </button>
                 <button type="button" onClick={() => setRole('employer')} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'employer' ? 'border-[#9E90FE] bg-purple-50 dark:bg-purple-900/20' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}>
                    <Building2 size={20} className={role === 'employer' ? 'text-[#9E90FE]' : 'text-slate-400'} />
                    <span className={`text-xs font-bold ${role === 'employer' ? 'text-[#9E90FE]' : 'text-slate-500'}`}>Employer</span>
                 </button>
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-linear-to-r from-[#B5ACFF] to-[#9E90FE] text-white font-black rounded-2xl shadow-xl shadow-purple-200 dark:shadow-none hover:shadow-2xl transition-all transform active:scale-95">
              Create Account
            </button>
          </form>

          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800"></div></div>
            <span className="relative bg-white dark:bg-slate-900 px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">or continue with</span>
          </div>

          <div className="flex justify-center">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google Signup failed")} theme="outline" shape="pill" width="350px" text="signup_with" />
          </div>

          <p className="mt-8 text-center text-sm font-bold text-slate-400">
            Already have an account? <Link to="/login" className="text-[#9E90FE] hover:underline font-bold">Login</Link>
          </p>
        </div>
      </main>
    </GoogleOAuthProvider>
  );
}