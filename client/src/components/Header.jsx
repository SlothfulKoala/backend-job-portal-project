import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  // 1. GLOBAL AUTH STATE (Your superior logic)
  const { user, loading, logout } = useContext(AuthContext); 
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const navigate = useNavigate();

  // 2. DARK MODE LOGIC
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const avatarSrc = user?.profilePic 
    ? user.profilePic 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=4f46e5&color=fff`;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-100 flex justify-between items-center px-8 py-4 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 transition-all duration-500">
        
        {/* LOGO (Teammate's FontAwesome UI) */}
        <Link to="/" className="flex items-center gap-2.5 text-[22px] font-bold text-gray-900 dark:text-white transition-colors">
            {/* Note: I swapped bg-linear to bg-gradient to ensure it works across Tailwind versions */}
            <i className="fa-brands fa-envira text-2xl bg-linear-to-br from-[#4f46e5] to-[#ec4899] bg-clip-text text-transparent"></i> 
            CareerVista
        </Link>
        
        <div className="flex items-center gap-6">
            
            {/* DARK MODE TOGGLE (Teammate's FontAwesome UI) */}
            <div onClick={() => setIsDark(!isDark)} className="relative w-6 h-6 flex items-center justify-center cursor-pointer group text-gray-500 dark:text-gray-400">
                <i className={`fa-regular fa-moon absolute transition-all duration-500 group-hover:text-[#1a1ad0] ${isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}></i>
                <i className={`fa-regular fa-sun absolute transition-all duration-500 group-hover:text-yellow-400 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}></i>
            </div>

            {/* --- AUTHENTICATION UI LOGIC (Your Logic) --- */}
            {loading ? (
                
                // STATE 1: SKELETON LOADER
                <div className="flex items-center gap-3 animate-pulse">
                    <div className="hidden md:block w-24 h-4 bg-gray-200 dark:bg-slate-700 rounded-md"></div>
                    <div className="w-9.5 h-9.5 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
                </div>

            ) : user ? (
                
                // STATE 2: LOGGED IN 
                <div className="flex items-center gap-4">
                    <Link to="/profile" className="flex items-center gap-3 group px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors duration-300">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-bold text-gray-900 dark:text-white leading-none capitalize">
                                {user.name}
                            </p>
                        </div>
                        
                        {/* Avatar with Teammate's border-cv-primary hover effect */}
                        <div className="w-9.5 h-9.5 rounded-full overflow-hidden border-2 border-transparent group-hover:border-cv-primary transition-all duration-300 shadow-sm">
                            <img 
                                src={avatarSrc} 
                                alt={user.name} 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                    </Link>

                    {/* Keep the logout button so users aren't trapped! */}
                    <button 
                        onClick={handleLogout}
                        className="text-sm font-semibold text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                        Logout
                    </button>
                </div>

            ) : (

                // STATE 3: LOGGED OUT
                <div className="flex items-center gap-3 ml-2">
                    <Link to="/login" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        Log In
                    </Link>
                    <Link to="/signup" className="text-sm font-semibold bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white px-5 py-2 rounded-full shadow-sm transition-all hover:shadow-md">
                        Sign Up
                    </Link>
                </div>

            )}
        </div>
    </header>
  );
};

export default Header;