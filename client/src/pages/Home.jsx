import React, { useState, useEffect } from 'react';
import { X, MapPin, Building2, Briefcase, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest'); 
  
  // UX States
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyingTo, setApplyingTo] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]); 
  const [popup, setPopup] = useState({ show: false, type: '', message: '' });

  // FETCH JOBS FROM MONGODB
  // FETCH JOBS AND APPLICATION STATUS
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      // 1. Fetch all jobs (Existing logic)
      const jobRes = await fetch(`http://localhost:5000/api/jobs?sort=${sortBy}`);
      const jobData = await jobRes.json();
      if (jobRes.ok) {
        setJobs(jobData.jobs || jobData.data || (Array.isArray(jobData) ? jobData : []));
      }

      // 2. ✅ NEW: Fetch applied job IDs if user is logged in
      // Inside Home.jsx useEffect
      if (token) {
        // ✅ Update this URL to match the new backend route
        const appRes = await fetch(`http://localhost:5000/api/applications/applied-ids`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (appRes.ok) {
          const appliedIds = await appRes.json();
          setAppliedJobs(appliedIds);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [sortBy]); // Runs on mount and when sorting changes

  // APPLY LOGIC
  const handleApply = async (jobId) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setPopup({ show: true, type: 'error', message: 'Please log in as a Job Seeker to apply!' });
      setTimeout(() => setPopup({ show: false, type: '', message: '' }), 3000);
      return;
    }

    setApplyingTo(jobId); 

    try {
      // ✅ FIXED API ENDPOINT: /apply/ added
      const res = await fetch(`http://localhost:5000/api/applications/apply/${jobId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ notes: "Applied via CareerVista Quick Apply" }) 
      });

      // Handle non-JSON responses (prevents the '<' SyntaxError)
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server error: Route not found or invalid response.");
      }

      const data = await res.json();

      if (res.ok) {
        setAppliedJobs((prev) => [...prev, jobId]); 
        setSelectedJob(null); 
        
        // Smooth scroll to top to see the success toast
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
        
        setPopup({ show: true, type: 'success', message: 'Application submitted successfully!' });
        setTimeout(() => setPopup({ show: false, type: '', message: '' }), 2500);

      } else {
        if (data.message && data.message.includes("already applied")) {
          setAppliedJobs((prev) => [...prev, jobId]); 
        }
        setPopup({ show: true, type: 'error', message: data.message || "Failed to apply." });
        setTimeout(() => setPopup({ show: false, type: '', message: '' }), 3000);
      }
    } catch (error) {
      console.error("Application Error:", error);
      setPopup({ show: true, type: 'error', message: "An error occurred while applying." });
      setTimeout(() => setPopup({ show: false, type: '', message: '' }), 3000);
    } finally {
      setApplyingTo(null); 
    }
  };

  const getCompanyInitial = (name) => name ? name.charAt(0).toUpperCase() : "C";

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto w-full transition-colors duration-300 relative">
      
      {/* ✅ FIXED TOAST NOTIFICATION: Pushed down and brought to front */}
      {popup.show && (
        <div className="fixed top-28 left-1/2 transform -translate-x-1/2 z-[100] w-full max-w-md px-4 animate-in slide-in-from-top-10 fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 px-6 py-4 rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-700 flex items-center gap-4">
            {popup.type === 'success' ? (
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} />
              </div>
            ) : (
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center shrink-0">
                <AlertCircle size={24} />
              </div>
            )}
            <div className="flex-1">
              <h4 className={`font-bold text-sm uppercase tracking-tight ${popup.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {popup.type === 'success' ? 'Success' : 'Attention'}
              </h4>
              <p className="text-slate-600 dark:text-slate-300 text-xs font-medium leading-tight">{popup.message}</p>
            </div>
            <button onClick={() => setPopup({ ...popup, show: false })} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ✅ JOB DETAILS MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] w-full max-w-2xl max-h-[80vh] mt-20 shadow-2xl flex flex-col overflow-hidden transform animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-700/50 p-6 md:p-8 flex justify-between items-start border-b border-slate-100 dark:border-slate-700 relative">
              <div className="flex gap-5 items-center">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-3xl font-black text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-100 dark:border-slate-700 shrink-0">
                  {getCompanyInitial(selectedJob.companyName)}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">{selectedJob.title}</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 flex items-center gap-2">
                    <Building2 size={16} /> {selectedJob.companyName}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedJob(null)} className="bg-white dark:bg-slate-700 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar">
              <div className="flex flex-wrap gap-3 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300">
                  <MapPin size={16} className="text-indigo-500" /> {selectedJob.location || "Remote"}
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300">
                  <Briefcase size={16} className="text-indigo-500" /> {selectedJob.type || "Full-time"}
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300">
                  <DollarSign size={16} className="text-emerald-500" /> {selectedJob.salary || "Not Disclosed"}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">About the Role</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed break-words whitespace-pre-wrap">{selectedJob.description}</p>
              </div>

              {selectedJob.skills && selectedJob.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-lg text-sm font-semibold border border-indigo-100 dark:border-indigo-800/30">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 flex justify-end">
               <button 
                 onClick={() => handleApply(selectedJob._id)}
                 disabled={applyingTo === selectedJob._id || appliedJobs.includes(selectedJob._id)}
                 className={`w-full md:w-auto px-8 py-3 rounded-full font-bold text-lg transition-all shadow-sm ${
                   appliedJobs.includes(selectedJob._id)
                     ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                     : 'bg-gradient-to-r from-[#B5ACFF] to-[#9E90FE] text-white hover:opacity-90 active:scale-95 shadow-purple-500/20'
                 }`}
               >
                 {appliedJobs.includes(selectedJob._id) ? "Applied ✅" : applyingTo === selectedJob._id ? "Applying..." : "Apply Now"}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH BAR SECTION */}
      <div className="animate-color-cycle flex flex-col md:flex-row bg-linear-to-r from-pink-200 via-blue-200 to-green-200 dark:from-fuchsia-900 dark:via-indigo-900 dark:to-emerald-900 p-2 rounded-full shadow-sm gap-2 mb-8 transition-colors duration-300">
        <div className="flex-1 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-4 py-3 rounded-full flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-400 dark:text-slate-400 shrink-0">
            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
          </svg>
          <input type="text" placeholder="Software Engineer, Product Manager, etc." className="bg-transparent border-none outline-none w-full text-gray-700 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-500" />
        </div>
        <div className="flex-1 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-4 py-3 rounded-full flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-400 dark:text-slate-400 shrink-0">
            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <input type="text" placeholder="San Francisco, CA or London, UK" className="bg-transparent border-none outline-none w-full text-gray-700 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-500" />
        </div>
        <button className="bg-black text-white dark:bg-white dark:text-black px-8 py-3 rounded-full font-semibold hover:scale-105 transition-all shadow-md">Find Jobs</button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white transition-colors">Showing {jobs.length} Job Results</h2>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium transition-colors">
          Sort by: 
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-full px-4 py-1.5 outline-none cursor-pointer">
            <option value="newest">Newest</option>
            <option value="relevant">Relevant</option>
          </select>
        </div>
      </div>

      {/* JOB GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="col-span-full text-center text-slate-500 dark:text-slate-400 py-10 font-medium">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="col-span-full text-center text-slate-500 dark:text-slate-400 py-10 font-medium">No jobs posted yet.</p>
        ) : (
          jobs.map((job) => {
            const isApplied = appliedJobs.includes(job._id);

            return (
              <div key={job._id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-slate-700 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-indigo-500/10 transition-all duration-300">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center text-xl font-bold text-indigo-600 dark:text-indigo-400 shrink-0 transition-colors">
                    {getCompanyInitial(job.companyName)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white leading-tight transition-colors">{job.title}</h3>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 transition-colors">
                      <MapPin size={14} className="shrink-0" /> {job.location || "Remote"}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 flex-1 leading-relaxed break-all transition-colors">{job.description}</p>
                <div className="flex gap-3 mt-2">
                  <button onClick={() => setSelectedJob(job)} className="flex-1 py-2.5 rounded-full border border-slate-200 dark:border-slate-600 font-semibold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    View Details
                  </button>
                  <button 
                    onClick={() => handleApply(job._id)}
                    disabled={applyingTo === job._id || isApplied}
                    className={`flex-1 py-2.5 rounded-full font-semibold text-sm transition-all shadow-sm ${
                      isApplied 
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#B5ACFF] to-[#9E90FE] text-white hover:opacity-90'
                    }`}
                  >
                    {isApplied ? "Applied" : applyingTo === job._id ? "Applying..." : "Apply Now"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Home;