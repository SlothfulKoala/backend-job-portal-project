import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Trash2, Edit, Users, MapPin, AlertCircle, X, CheckCircle2, Loader2, Code2, Building2 } from "lucide-react";

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals & UI State
  const [deleteModalId, setDeleteModalId] = useState(null); 
  const [editJob, setEditJob] = useState(null); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: '', message: '' });

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  // ✅ FIX 1: STOP BACKGROUND SCROLL
  useEffect(() => {
    if (editJob || deleteModalId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [editJob, deleteModalId]);

  useEffect(() => {
    window.scrollTo(0, 0); 
    fetchMyJobs();
  }, [token]);

  const fetchMyJobs = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/jobs/my-jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setJobs(Array.isArray(data.jobs) ? data.jobs : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    setIsProcessing(true);
    try {
      await fetch(`http://localhost:5000/api/jobs/${deleteModalId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter(job => job._id !== deleteModalId));
      showToast('success', 'Job deleted successfully');
    } catch (error) {
      showToast('error', 'Failed to delete job');
    } finally {
      setIsProcessing(false);
      setDeleteModalId(null);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditJob(prev => ({ ...prev, [name]: value }));
  };

  const openEditModal = (job) => {
    // ✅ FIX 2: Convert skills array to comma string for the input field
    setEditJob({
      ...job,
      skills: Array.isArray(job.skills) ? job.skills.join(', ') : job.skills
    });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // ✅ FIX 3: Convert skills string back to Array before sending to MongoDB
    const updatedData = {
      ...editJob,
      skills: typeof editJob.skills === 'string' 
        ? editJob.skills.split(',').map(s => s.trim()).filter(s => s !== "") 
        : editJob.skills
    };

    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${editJob._id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        setJobs(jobs.map(j => j._id === editJob._id ? updatedData : j));
        setEditJob(null);
        showToast('success', 'Job updated successfully!');
      }
    } catch (error) {
      showToast('error', 'Update failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const showToast = (type, message) => {
    setPopup({ show: true, type, message });
    setTimeout(() => setPopup({ show: false, type: '', message: '' }), 3000);
  };

  const getCompanyInitial = (name) => name ? name.charAt(0).toUpperCase() : "C";

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto w-full transition-colors duration-300 relative">
      
      {/* Popups (Toast) */}
      {popup.show && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] w-full max-w-md px-4 animate-in slide-in-from-top-5">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
            {popup.type === 'success' ? <CheckCircle2 className="text-emerald-500" /> : <AlertCircle className="text-red-500" />}
            <p className="text-sm font-bold dark:text-white">{popup.message}</p>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteModalId && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold dark:text-white mb-2">Delete Job?</h3>
            <p className="text-slate-500 text-sm mb-6">This will permanently remove the listing and all applications.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModalId(null)} className="flex-1 py-3 rounded-xl border dark:border-slate-700 dark:text-white font-bold">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ REFINED EDIT MODAL */}
      {editJob && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-900/50 backdrop-blur-md p-4 mt-16">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[80vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-slate-100 dark:border-slate-800">
            
            {/* Modal Header */}
            <div className="px-8 py-5 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 shrink-0">
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight leading-none">Edit Job Posting</h2>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1.5">Update the details for this position</p>
              </div>
              <button onClick={() => setEditJob(null)} className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <form onSubmit={submitEdit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Job Title</label>
                  <input type="text" name="title" value={editJob.title} onChange={handleEditChange} required
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-bold" />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Job Type</label>
                  <select name="type" value={editJob.type} onChange={handleEditChange}
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-bold">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Salary Range</label>
                  <input type="text" name="salary" value={editJob.salary} onChange={handleEditChange}
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-bold" />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1 flex items-center gap-1">
                    <Code2 size={12} /> Required Skills (comma separated)
                  </label>
                  <input type="text" name="skills" value={editJob.skills} onChange={handleEditChange} placeholder="React, Node.js, CSS..."
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-bold" />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Location</label>
                  <input type="text" name="location" value={editJob.location} onChange={handleEditChange}
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-bold" />
                </div>

                {/* ✅ LOCKING THE COMPANY FIELD */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1 flex items-center gap-1">
                    <Building2 size={12} /> Company (Read-Only)
                  </label>
                  <input type="text" value={editJob.companyName} readOnly
                    className="w-full px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border-none text-slate-400 dark:text-slate-500 cursor-not-allowed font-bold" />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Job Description</label>
                  <textarea name="description" value={editJob.description} onChange={handleEditChange} rows="5"
                    className="w-full px-6 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none font-medium leading-relaxed" />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 border-t border-slate-50 dark:border-slate-800 flex gap-3 bg-white dark:bg-slate-900 shrink-0">
              <button onClick={() => setEditJob(null)}
                className="flex-1 py-3.5 rounded-xl border border-slate-100 dark:border-slate-800 font-bold text-slate-500 hover:bg-slate-50 transition-all text-xs uppercase tracking-widest">
                Discard
              </button>
              <button onClick={submitEdit} disabled={isProcessing}
                className="flex-[2] py-3.5 rounded-xl bg-indigo-600 text-white font-black shadow-lg shadow-indigo-200 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest">
                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main UI Header */}
      <div className="flex justify-between items-end mb-10 px-2">
        <div>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-none">Employer Dashboard</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold uppercase tracking-widest text-[10px]">Managing {jobs.length} open positions</p>
        </div>
        <button onClick={() => navigate("/create-job")} className="bg-slate-900 text-white dark:bg-white dark:text-black px-10 py-4 rounded-full font-black hover:scale-105 active:scale-95 transition-all shadow-xl text-xs uppercase tracking-widest">
          + New Job
        </button>
      </div>

      {/* Job Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full flex flex-col items-center py-24">
             <Loader2 size={40} className="animate-spin text-indigo-500" />
             <p className="mt-4 text-slate-400 font-black uppercase tracking-widest text-[10px]">Syncing Data...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="col-span-full text-center py-32 bg-slate-50 dark:bg-slate-800/30 rounded-[3rem] border-4 border-dashed border-slate-100 dark:border-slate-800">
            <p className="text-slate-300 text-xl font-black mb-4 uppercase">No jobs found.</p>
            <button onClick={() => navigate("/create-job")} className="text-indigo-600 font-black text-lg hover:underline transition-all">Post your first job 🚀</button>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-sm border border-slate-50 dark:border-slate-700 flex flex-col gap-6 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 group">
              <div className="flex justify-between items-start">
                <div className="flex gap-5 items-center">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-2xl font-black text-indigo-600 dark:text-indigo-400 shrink-0">
                    {getCompanyInitial(job.companyName)}
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-800 dark:text-white leading-tight group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                    <div className="text-[10px] font-black text-slate-400 mt-1.5 flex items-center gap-1 uppercase tracking-widest">
                      <MapPin size={12} className="text-indigo-500" /> {job.location || "Remote"}
                    </div>
                  </div>
                </div>
                <button onClick={() => setDeleteModalId(job._id)} className="text-slate-200 hover:text-red-500 p-2 transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed font-medium break-all">{job.description}</p>
              <div className="flex gap-3 pt-6 border-t border-slate-50 dark:border-slate-700 mt-auto">
                <button onClick={() => openEditModal(job)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border border-slate-200 dark:border-slate-700 font-black text-[10px] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all uppercase tracking-widest">
                  <Edit size={14} /> Edit
                </button>
                <button onClick={() => navigate(`/applicants/${job._id}`)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-black text-[10px] hover:opacity-90 transition-all uppercase tracking-widest shadow-lg shadow-indigo-500/10">
                  <Users size={14} /> Applicants
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