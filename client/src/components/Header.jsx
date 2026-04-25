import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [user, setUser] = useState(null);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  // --- 1. FETCH USER FROM DATABASE ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user/me'); // Update with your port
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, []);

  // --- 2. DARK MODE LOGIC ---
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

  // --- 3. DYNAMIC AVATAR LOGIC ---
  // We use a "Skeleton" or placeholder if the user data hasn't arrived yet
  const avatarSrc = user?.profilePic 
    ? user.profilePic 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=4f46e5&color=fff`;

  return (
    <header className="sticky top-0 z-100 flex justify-between items-center px-8 py-4 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 transition-all duration-500">
        
        <Link to="/" className="flex items-center gap-2.5 text-[22px] font-bold text-gray-900 dark:text-white transition-colors">
            <i className="fa-brands fa-envira text-2xl bg-linear-to-br from-[#4f46e5] to-[#ec4899] bg-clip-text text-transparent"></i> 
            CareerVista
        </Link>
        
        <div className="flex items-center gap-5">
            {/* Dark Mode Toggle */}
            <div onClick={() => setIsDark(!isDark)} className="relative w-6 h-6 flex items-center justify-center cursor-pointer group text-gray-500 dark:text-gray-400">
                <i className={`fa-regular fa-moon absolute transition-all duration-500 group-hover:text-[#1a1ad0] ${isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}></i>
                <i className={`fa-regular fa-sun absolute transition-all duration-500 group-hover:text-yellow-400 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}></i>
            </div>

            {/* --- Clickable Profile Section --- */}
            <Link to="/profile" className="flex items-center gap-3 group px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors duration-300">
                <div className="hidden md:block text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-white leading-none capitalize">
                        {user ? user.name : "Loading..."}
                    </p>
                </div>
                
                <div className="w-9.5 h-9.5 rounded-full overflow-hidden border-2 border-transparent group-hover:border-cv-primary transition-all duration-300 shadow-sm">
                    <img 
                    src={avatarSrc} 
                    alt={user?.name} 
                    className="w-full h-full object-cover" 
                    />
                </div>
            </Link>
        </div>
    </header>
  );
};

export default Header;