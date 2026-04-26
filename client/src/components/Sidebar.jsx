import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // ✅ Role-based check

const Sidebar = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext); 
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const getNavClass = (path) => {
    const isActive = location.pathname === path;
    return `group/navitem flex items-center p-[15px] text-[16px] font-medium rounded-[12px] transition-colors duration-300 mb-[5px] whitespace-nowrap text-[#111827] dark:text-gray-300 ${
      isActive ? 'bg-[#f3f4f6] dark:bg-slate-800 text-[#4f46e5] dark:text-white' : 'hover:bg-[#f3f4f6] dark:hover:bg-slate-800'
    }`;
  };

  const hoverClasses = !isOpen ? "group/sidebar md:hover:w-[250px] md:hover:px-[15px]" : "";
  
  const textAnimationClass = `transition-all duration-400 ease-in-out ${
    isOpen 
      ? 'opacity-100 max-w-[150px] pl-[15px] translate-x-0' 
      : 'opacity-0 max-w-0 pl-0 -translate-x-[15px] group-hover/sidebar:opacity-100 group-hover/sidebar:max-w-[150px] group-hover/sidebar:pl-[15px] group-hover/sidebar:translate-x-0'
  }`;

  return (
    <aside 
      className={`sticky top-21.25 z-50 h-[calc(100vh-100px)] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[20px] py-5 shadow-lg border-l-2 border-transparent dark:border-slate-800 transition-all duration-500 overflow-x-hidden ${hoverClasses} ${
        isOpen ? 'w-62.5 px-3.75 max-sm:fixed max-sm:left-4' : 'w-20 px-2.5'
      }`}
    >
        {/* Toggle Button */}
        <div 
          onClick={toggleSidebar} 
          className="flex items-center p-3.75 text-[16px] font-medium text-[#111827] dark:text-white mb-5 pb-5 border-b border-[#e5e7eb] dark:border-slate-800 rounded-t-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        >
            <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                <i className={`fa-solid fa-bars absolute text-[20px] transition-all duration-500 transform ${
                  isOpen ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100 group-hover/sidebar:opacity-0 group-hover/sidebar:scale-50'
                }`}></i>
                <i className={`fa-solid fa-thumbtack absolute text-[20px] transition-all duration-500 transform hidden! md:flex! items-center justify-center ${
                  isOpen ? 'opacity-100 scale-110 -rotate-45 text-cv-icon' : 'opacity-0 scale-50 rotate-0 text-gray-400 group-hover/sidebar:opacity-100 group-hover/sidebar:scale-100 group-hover/sidebar:-rotate-45' 
                }`}></i>
                <i className={`fa-solid fa-xmark absolute text-[22px] transition-all duration-500 transform flex! md:hidden! items-center justify-center ${
                  isOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-90 pointer-events-none' 
                }`}></i>
            </div>
            
            <span className={`font-bold ${textAnimationClass}`}>
                {isOpen ? (
                    <><span className="md:hidden">Close</span><span className="hidden md:inline">Pinned</span></>
                ) : (
                    <><span className="md:group-hover/sidebar:hidden">Menu</span><span className="hidden md:group-hover/sidebar:inline">Pin</span></>
                )}
            </span>
        </div>

        <nav className="flex flex-col">
            
            {/* ✅ EMPLOYER NAVIGATION */}
            {user?.role === 'employer' ? (
              <>
                <Link to="/" className={getNavClass('/')}>
                    <i className="fa-solid fa-chart-line text-[20px] min-w-6 text-center shrink-0 transition-all duration-400 group-hover/navitem:scale-125 group-hover/navitem:text-cv-icon"></i> 
                    <span className={textAnimationClass}>My Dashboard</span>
                </Link>
                <Link to="/create-job" className={getNavClass('/create-job')}>
                    <i className="fa-solid fa-square-plus text-[20px] min-w-6 text-center shrink-0 transition-all duration-400 group-hover/navitem:scale-125 group-hover/navitem:text-cv-icon"></i> 
                    <span className={textAnimationClass}>Post Job</span>
                </Link>
                <Link to="/employer-profile" className={getNavClass('/employer-profile')}>
                    <i className="fa-solid fa-building-user text-[20px] min-w-6 text-center shrink-0 transition-all duration-400 group-hover/navitem:scale-125 group-hover/navitem:text-cv-icon"></i> 
                    <span className={textAnimationClass}>Company</span>
                </Link>
              </>
            ) : (
              /* ✅ SEEKER OR GUEST NAVIGATION */
              <>
                <Link to="/" className={getNavClass('/')}>
                    <i className="fa-solid fa-magnifying-glass text-[20px] min-w-6 text-center shrink-0 transition-all duration-400 group-hover/navitem:scale-125 group-hover/navitem:text-cv-icon"></i> 
                    <span className={textAnimationClass}>Find Jobs</span>
                </Link>
                {user?.role === 'seeker' && (
                  <>
                    <Link to="/my-applications" className={getNavClass('/my-applications')}>
                        <i className="fa-solid fa-file-invoice text-[20px] min-w-6 text-center shrink-0 transition-all duration-400 group-hover/navitem:scale-125 group-hover/navitem:text-cv-icon"></i> 
                        <span className={textAnimationClass}>Applications</span>
                    </Link>
                    <Link to="/profile" className={getNavClass('/profile')}>
                        <i className="fa-solid fa-user-pen text-[20px] min-w-6 text-center shrink-0 transition-all duration-400 group-hover/navitem:scale-125 group-hover/navitem:text-cv-icon"></i> 
                        <span className={textAnimationClass}>Profile</span>
                    </Link>
                  </>
                )}
                {!user && (
                  <Link to="/login" className={getNavClass('/login')}>
                      <i className="fa-solid fa-right-to-bracket text-[20px] min-w-6 text-center shrink-0 transition-all duration-400 group-hover/navitem:scale-125 group-hover/navitem:text-cv-icon"></i> 
                      <span className={textAnimationClass}>Login</span>
                  </Link>
                )}
              </>
            )}
        </nav>
    </aside>
  );
};

export default Sidebar;