import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  // 1. Grab all three pieces of state from Context
  const { user, loading, logout } = useContext(AuthContext); 
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  
  // 2. Add navigate for the logout function
  const navigate = useNavigate();

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

  // 3. Add the logout handler
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-100 flex justify-between items-center px-8 py-4 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 transition-all duration-500">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2.5 text-[22px] font-bold text-gray-900 dark:text-white transition-colors">
          <i className="fa-brands fa-envira text-2xl bg-linear-to-br from-[#4f46e5] to-[#ec4899] bg-clip-text text-transparent"></i> 
          CareerVista
        </Link>
        
        <div className="flex items-center gap-6">
            
            {/* DARK MODE TOGGLE - Preserved your exact animation classes, but used SVGs */}
            <div onClick={() => setIsDark(!isDark)} className="relative w-6 h-6 flex items-center justify-center cursor-pointer group text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 absolute transition-all duration-500 group-hover:text-[#1a1ad0] ${isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}>
                  <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 absolute transition-all duration-500 group-hover:text-yellow-400 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}>
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                </svg>
            </div>

            {/* --- AUTHENTICATION UI LOGIC --- */}
            {loading ? (
                
                // STATE 1: SKELETON LOADER
                <div className="flex items-center gap-3 animate-pulse">
                    <div className="hidden md:block w-24 h-4 bg-gray-200 dark:bg-slate-700 rounded-md"></div>
                    <div className="w-9.5 h-9.5 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
                </div>

            ) : user ? (
                
                // STATE 2: LOGGED IN (Your custom profile link + Logout)
                <div className="flex items-center gap-4">
                    <Link to="/profile" className="flex items-center gap-3 group px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors duration-300">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-bold text-gray-900 dark:text-white leading-none capitalize">
                                {user.name}
                            </p>
                        </div>
                        
                        <div className="w-9.5 h-9.5 rounded-full overflow-hidden border-2 border-transparent group-hover:border-indigo-600 transition-all duration-300 shadow-sm">
                            <img 
                                src={avatarSrc} 
                                alt={user.name} 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                    </Link>

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