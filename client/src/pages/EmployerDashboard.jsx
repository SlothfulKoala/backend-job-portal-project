import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Trash2, Edit, Users, MapPin, AlertCircle } from "lucide-react"; // Added AlertCircle

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ✅ NEW STATE FOR CUSTOM MODAL
  const [deleteModalId, setDeleteModalId] = useState(null); 
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // ✅ FIX: Force scroll to top when page loads
    window.scrollTo(0, 0); 
    
    if (!token) return;
    setLoading(true);

    fetch("http://localhost:5000/api/jobs/my-jobs", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setJobs(Array.isArray(data.jobs) ? data.jobs : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  // ✅ Trigger the custom modal instead of window.confirm
  const triggerDelete = (id) => {
    setDeleteModalId(id);
  };

  // ✅ The actual delete logic
  const confirmDelete = async () => {
    if (!deleteModalId) return;
    setIsDeleting(true);

    try {
      await fetch(`http://localhost:5000/api/jobs/${deleteModalId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter(job => job._id !== deleteModalId));
    } catch (error) {
      console.error("Error deleting job", error);
    } finally {
      setIsDeleting(false);
      setDeleteModalId(null); // Close the modal
    }
  };

  const getCompanyInitial = (name) => name ? name.charAt(0).toUpperCase() : "C";

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto w-full transition-colors duration-300 relative">
      
      {/* ✅ CUSTOM DELETE MODAL OVERLAY */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-2xl max-w-sm w-full mx-4 flex flex-col items-center text-center transform animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Delete Job?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              Are you sure you want to delete this job posting? This action cannot be undone.
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setDeleteModalId(null)}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">My Dashboard</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your {jobs.length} active job postings.</p>
        </div>
        <button
          onClick={() => navigate("/create-job")}
          className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition-all shadow-md"
        >
          + Post New Job
        </button>
      </div>

      {/* Dynamic Job Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="col-span-full text-center text-slate-500 py-10 font-medium">Loading your jobs...</p>
        ) : jobs.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-4">No jobs posted yet.</p>
            <button onClick={() => navigate("/create-job")} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
              Create your first posting 🚀
            </button>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-slate-700 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-indigo-500/10 transition-all duration-300">
              
              <div className="flex justify-between items-start">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center text-xl font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                    {getCompanyInitial(job.companyName)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white leading-tight">{job.title}</h3>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                      <MapPin size={14} /> {job.location || "Remote"}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => triggerDelete(job._id)} // ✅ Using new custom modal trigger
                  className="text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 dark:bg-slate-700 dark:hover:bg-red-500/20 p-2 rounded-full transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              {/* ✅ FIX: Added 'break-all' to stop long strings from destroying the layout */}
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 flex-1 leading-relaxed break-all">
                {job.description}
              </p>
              
              <div className="flex gap-3 mt-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button 
                  onClick={() => navigate(`/edit-job/${job._id}`)} 
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border border-slate-200 dark:border-slate-600 font-semibold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Edit size={16} /> Edit
                </button>
                <button 
                  onClick={() => navigate(`/applicants/${job._id}`)} 
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-gradient-to-r from-[#B5ACFF] to-[#9E90FE] text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
                >
                  <Users size={16} /> Applicants
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;