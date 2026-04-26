import React, { useEffect, useState } from 'react';
import { Briefcase, MapPin, Clock, CheckCircle2, Timer, XCircle } from 'lucide-react';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchApps = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/applications/my-applications", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setApplications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [token]);

  // Helper for status colors
  const getStatusStyles = (status) => {
    switch (status) {
      case 'reviewed': // This is your "Shortlisted" status
        return "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400";
      case 'pending':
        return "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400";
      case 'rejected':
        return "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-900/20 dark:text-slate-400";
    }
  };

  if (loading) return <div className="p-10 text-center dark:text-white font-bold">Loading your applications...</div>;

  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 dark:text-white">My Applications</h1>
        <p className="text-slate-500 mt-1">Track the status of your {applications.length} active applications.</p>
      </div>

      <div className="grid gap-4">
        {applications.length === 0 ? (
          <div className="p-20 text-center bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <Briefcase size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500 font-bold">You haven't applied to any jobs yet.</p>
          </div>
        ) : (
          applications.map((app) => (
            <div key={app._id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl shrink-0">
                  {app.jobId?.companyName?.charAt(0) || "C"}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white">{app.jobId?.title || "Deleted Job"}</h3>
                  <p className="text-slate-500 text-sm flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1"><Briefcase size={14}/> {app.jobId?.companyName}</span>
                    <span className="flex items-center gap-1"><MapPin size={14}/> {app.jobId?.location}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:items-end gap-2 w-full md:w-auto">
                <div className={`px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-wider flex items-center gap-2 ${getStatusStyles(app.status)}`}>
                  {app.status === 'reviewed' ? <CheckCircle2 size={14}/> : <Timer size={14}/>}
                  {app.status === 'reviewed' ? 'Shortlisted' : app.status}
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock size={12}/> Applied on {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyApplications;