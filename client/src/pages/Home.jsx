import React, { useState, useEffect } from 'react';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest'); 

  // FETCH JOBS FROM MONGODB
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/jobs?sort=${sortBy}`);
        const data = await response.json();
        
        if (response.ok) {
          if (Array.isArray(data)) {
            setJobs(data);
          } else if (data && Array.isArray(data.jobs)) {
            setJobs(data.jobs);
          } else if (data && Array.isArray(data.data)) {
            setJobs(data.data);
          } else {
            setJobs([]); 
          }
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [sortBy]);

  const getCompanyInitial = (companyName) => {
    return companyName ? companyName.charAt(0).toUpperCase() : "C";
  };

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto w-full transition-colors duration-300">
      
      {/* Search Bar */}
      <div className="animate-color-cycle flex flex-col md:flex-row bg-linear-to-r from-pink-200 via-blue-200 to-green-200 dark:from-fuchsia-900 dark:via-indigo-900 dark:to-emerald-900 p-2 rounded-full shadow-sm gap-2 mb-8 transition-colors duration-300">
        <div className="flex-1 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-4 py-3 rounded-full flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-400 dark:text-slate-400 shrink-0">
            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
          </svg>
          <input 
            type="text" 
            placeholder="Software Engineer, Product Manager, etc." 
            className="bg-transparent border-none outline-none w-full text-gray-700 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-500" 
          />
        </div>
        <div className="flex-1 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-4 py-3 rounded-full flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-400 dark:text-slate-400 shrink-0">
            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <input 
            type="text" 
            placeholder="San Francisco, CA or London, UK" 
            className="bg-transparent border-none outline-none w-full text-gray-700 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-500" 
          />
        </div>
        <button className="bg-black text-white dark:bg-white dark:text-black px-8 py-3 rounded-full font-semibold hover:scale-105 transition-all shadow-md">
          Find Jobs
        </button>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white transition-colors">Showing {jobs.length} Job Results</h2>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium transition-colors">
          Sort by: 
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-full px-4 py-1.5 outline-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
          >
            <option value="newest">Newest</option>
            <option value="relevant">Relevant</option>
          </select>
        </div>
      </div>

      {/* Dynamic Job Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="col-span-full text-center text-slate-500 dark:text-slate-400 py-10 font-medium">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="col-span-full text-center text-slate-500 dark:text-slate-400 py-10 font-medium">No jobs posted yet. Be the first to create one!</p>
        ) : (
          jobs.map((job, index) => (
            <div key={job._id || index} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-slate-700 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-indigo-500/10 transition-all duration-300">
              
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center text-xl font-bold text-indigo-600 dark:text-indigo-400 shrink-0 transition-colors">
                  {getCompanyInitial(job.companyName)}
                </div>
                
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white leading-tight transition-colors">{job.title}</h3>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-slate-400 shrink-0">
                      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg> {job.location || "Remote"}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 flex-1 leading-relaxed transition-colors">
                {job.description}
              </p>
              
              <div className="flex gap-3 mt-2">
                <button className="flex-1 py-2.5 rounded-full border border-slate-200 dark:border-slate-600 font-semibold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  View Details
                </button>
                <button className="flex-1 py-2.5 rounded-full bg-linear-to-r from-pink-200 to-blue-200 dark:from-indigo-600 dark:to-blue-600 text-slate-900 dark:text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm">
                  Apply Now
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
    </div>
  );
};

export default Home;