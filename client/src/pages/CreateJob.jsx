import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CheckCircle2 } from "lucide-react"; // Import for the success icon

const CreateJob = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [showSuccess, setShowSuccess] = useState(false); // ✅ Controls the popup
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevents double-clicks

  const [form, setForm] = useState({
    title: "", type: "", salary: "", location: "", description: "", 
    companyName: user?.name || "", contactEmail: user?.email || "", skills: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...form,
      skills: form.skills ? form.skills.split(",").map(s => s.trim()) : []
    };

    try {
      const res = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // ✅ Trigger the Success Popup
        setShowSuccess(true);
        
        // ✅ Auto-redirect after 2.5 seconds
        setTimeout(() => {
          navigate("/");
        }, 1200);

      } else {
        alert("Failed to create job.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error creating job", error);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ✅ FULL SCREEN SUCCESS POPUP OVERLAY */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center transform animate-in fade-in zoom-in duration-300">
            <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6 relative">
              {/* Pulsing ring effect */}
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
              <CheckCircle2 size={48} className="text-green-500 relative z-10" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Job Posted!</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Redirecting to your dashboard...</p>
          </div>
        </div>
      )}

      {/* Main Form Content */}
      <div className="flex-1 p-6 max-w-3xl mx-auto w-full">
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-slate-700">
          <h2 className="text-2xl font-black mb-8 text-slate-800 dark:text-white">Create New Job</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Company Name</label>
              <input 
                name="companyName" value={form.companyName} readOnly 
                className="px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed dark:bg-slate-900/50 dark:border-slate-700 outline-none" 
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Contact Email</label>
              <input 
                type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange} required 
                className="px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 outline-none dark:text-white focus:ring-2 focus:ring-purple-100" 
              />
            </div>

            <input name="title" placeholder="Job Title" onChange={handleChange} required className="px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 outline-none dark:text-white focus:ring-2 focus:ring-purple-100" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input name="type" placeholder="Full-time / Internship" onChange={handleChange} required className="px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 outline-none dark:text-white focus:ring-2 focus:ring-purple-100" />
              <input name="salary" placeholder="Salary (e.g. $80k - $100k)" onChange={handleChange} required className="px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 outline-none dark:text-white focus:ring-2 focus:ring-purple-100" />
            </div>

            <input name="location" placeholder="Location (e.g. Remote, New York)" onChange={handleChange} required className="px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 outline-none dark:text-white focus:ring-2 focus:ring-purple-100" />
            
            <input name="skills" placeholder="Required Skills (comma separated: React, Node, MongoDB)" onChange={handleChange} className="px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 outline-none dark:text-white focus:ring-2 focus:ring-purple-100" />
            
            <textarea name="description" placeholder="Job Description" onChange={handleChange} required rows={5} className="px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 outline-none dark:text-white resize-none focus:ring-2 focus:ring-purple-100" />
            
            <button 
              type="submit" 
              className="w-full mt-4 group relative flex items-center justify-center gap-3 bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-black shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10">Post Job</span>
              <svg 
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateJob;