import React from 'react';

const Footer = () => {
  return (
    <footer className="relative w-full bg-[#06080d] overflow-hidden px-8 py-16 md:px-16 mt-auto shadow-2xl">
      
      {/* --- Ambient Glows & Texture (Using inline styles for complex filters) --- */}
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-overlay z-1"
        style={{ 
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      ></div>

      <div className="absolute pointer-events-none z-0" 
           style={{ bottom: '-50px', right: '250px', width: '500px', height: '500px', background: '#b026ff', borderRadius: '50%', filter: 'blur(140px)', opacity: 0.5 }}></div>
      <div className="absolute pointer-events-none z-0" 
           style={{ top: '100px', right: '150px', width: '400px', height: '400px', background: '#2563eb', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.4 }}></div>
      <div className="absolute pointer-events-none z-0" 
           style={{ bottom: '-150px', right: '-100px', width: '400px', height: '400px', background: '#10b981', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.6 }}></div>

      {/* --- Content Layer --- */}
      <div className="relative z-10 max-w-300 mx-auto flex flex-col gap-12">
        
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4 leading-tight tracking-tight">
              Ready to Elevate <span className="text-[#8b909a]">Your<br className="hidden md:block" />Career?</span>
            </h1>
            <p className="text-[#a1a1aa] text-sm md:text-base leading-relaxed max-w-md">
              Take your job search to the next level with powerful matching, real-time insights, and tools built to scale your career.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <a href="/jobs" className="bg-cv-primary text-white px-8 py-3.5 rounded-full text-sm font-semibold text-center hover:opacity-90 transition-opacity">Find Jobs Now</a>
            <a href="/employer" className="bg-white text-black px-8 py-3.5 rounded-full text-sm font-semibold text-center hover:opacity-90 transition-opacity">Post a Job</a>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/15"></div>

        {/* Middle Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-12">
          
        <div className="max-w-90">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-white rounded-lg flex justify-center items-center">
              <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 fill-cv-primary" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.5 4H7.5C6.1 4 5 5.1 5 6.5V11H12C13.1 11 14 11.9 14 13V17H16.5C17.9 17 19 15.9 19 14.5V10C19 8.9 18.1 8 17 8H10V6.5C10 6.2 10.2 6 10.5 6H14.5V4ZM9.5 20H16.5C17.9 20 19 18.9 19 17.5V13H12C10.9 13 10 12.1 10 11V7H7.5C6.1 7 5 8.1 5 9.5V14C5 15.1 5.9 16 7 16H14V17.5C14 17.8 13.8 18 13.5 18H9.5V20Z"/>
              </svg>
            </div>
            <div className="text-white text-2xl font-semibold tracking-tight">Career Vista</div>
          </div>
          <p className="text-[#a1a1aa] text-sm leading-relaxed">
            Career Vista empowers modern professionals with intelligent tools to hire smarter, apply faster, and grow stronger.
          </p>
        </div>

          <div className="flex flex-col sm:flex-row gap-12 sm:gap-20 pr-0 lg:pr-5">
            <div className="flex flex-col gap-4">
              <h4 className="text-white text-base font-medium mb-1">Platform</h4>
              <a href="/jobs" className="text-white/65 hover:text-white text-sm transition-colors">Browse Jobs</a>
              <a href="/employer" className="text-white/65 hover:text-white text-sm transition-colors">Employer Dashboard</a>
              <a href="/login" className="text-white/65 hover:text-white text-sm transition-colors">Seeker Profile</a>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white text-base font-medium mb-1">Resources</h4>
              <a href="#" className="text-white/65 hover:text-white text-sm transition-colors">Resume Guide</a>
              <a href="#" className="text-white/65 hover:text-white text-sm transition-colors">Interview Tips</a>
              <a href="#" className="text-white/65 hover:text-white text-sm transition-colors">Salary Calculator</a>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white text-base font-medium mb-1">Support</h4>
              <a href="#" className="text-white/65 hover:text-white text-sm transition-colors">FAQ's</a>
              <a href="#" className="text-white/65 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-white/65 hover:text-white text-sm transition-colors">Terms & Conditions</a>
            </div>
          </div>
          
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/15"></div>

        {/* Bottom Section */}
        <div className="text-center pt-2">
          <span className="text-white/50 text-[13px]">&copy;2026 Career Vista. All rights reserved.</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;