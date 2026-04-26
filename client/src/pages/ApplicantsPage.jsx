import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, FileText, CheckCircle, ArrowLeft, Loader2, X, AlertCircle } from 'lucide-react';

const ApplicantsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ jobTitle: "", applicants: [] });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // ✅ NEW: Popup state for consistent UX
  const [popup, setPopup] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/applicants/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (res.ok) {
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShortlist = async (appId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/applications/shortlist/${appId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        // Update local state
        setData(prev => ({
          ...prev,
          applicants: prev.applicants.map(app => 
            app.applicationId === appId ? { ...app, status: 'reviewed' } : app
          )
        }));

        // ✅ Show Success Toast
        setPopup({ show: true, type: 'success', message: 'Candidate shortlisted successfully!' });
        setTimeout(() => setPopup({ show: false, type: '', message: '' }), 3000);
      } else {
        setPopup({ show: true, type: 'error', message: 'Failed to shortlist candidate.' });
        setTimeout(() => setPopup({ show: false, type: '', message: '' }), 3000);
      }
    } catch (error) {
      console.error("Error shortlisting:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20 dark:text-white">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
        <p className="font-bold text-lg tracking-tight">Loading Applicants...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto w-full transition-all duration-300 relative">
      
      {/* ✅ CONSISTENT POPUP UI (Aligned with Home.jsx) */}
      {popup.show && (
        <div className="fixed top-28 left-1/2 transform -translate-x-1/2 z-[100] w-full max-w-md px-4 animate-in slide-in-from-top-10 fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 px-6 py-4 rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-700 flex items-center gap-4">
            {popup.type === 'success' ? (
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle size={24} />
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

      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 transition-colors font-bold group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </button>

      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 dark:text-white leading-tight">Applicants for</h1>
        <p className="text-indigo-600 dark:text-indigo-400 text-xl font-bold">{data.jobTitle || "Job Title"}</p>
        <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-slate-500 text-sm font-medium">{data.totalApplicants} active applications</p>
        </div>
      </div>

      {/* Applicants List */}
      <div className="flex flex-col gap-4">
        {data.applicants.length === 0 ? (
          <div className="p-20 text-center bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400">
            <User size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-bold">No one has applied yet.</p>
            <p className="text-sm mt-1">Check back later or share your job posting!</p>
          </div>
        ) : (
          data.applicants.map((app) => (
            <div 
              key={app.applicationId} 
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
                  <User size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white">{app.applicantProfile?.name || "Anonymous User"}</h3>
                  <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-medium"><Mail size={14} /> {app.applicantProfile?.email}</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> 
                      {/* ✅ FIX: Ensure this key matches your updated backend mapper */}
                      {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "Date Unknown"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-none pt-4 md:pt-0">
                {app.status === 'reviewed' ? (
                  <div className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-bold text-sm border border-emerald-100 dark:border-emerald-800/30 animate-in fade-in zoom-in">
                    <CheckCircle size={18} /> Shortlisted
                  </div>
                ) : (
                  <button 
                    onClick={() => handleShortlist(app.applicationId)}
                    className="flex-1 md:flex-none px-8 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-slate-200 dark:shadow-none"
                  >
                    Shortlist
                  </button>
                )}
                
                <button className="p-2.5 rounded-full border border-slate-200 dark:border-slate-600 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all">
                  <FileText size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApplicantsPage;