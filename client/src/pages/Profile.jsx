import React, { useState } from 'react';

export default function Profile() {
  // --- TEMPORARY MOCK DATA FOR UI TESTING ---
  // Change "seeker" to "employer" to see the conditional layout change!
  const user = {
      _id: "mock-id-123",
      name: "Aditya Goyal",
      email: "aditya@careervista.com",
      role: "employer", 
      profilePic: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      phone: "+91 98765 43210",
      location: "Punjab, India",
      bio: "Passionate Full-Stack Developer with experience in React, Node.js, and MongoDB. I love building scalable web applications.",
      portfolioUrl: "https://github.com/aditya", // For seeker
      resume: "my-resume-link.pdf" // For seeker
    };
    // companyName: "Tech Innovations Inc.", // For employer
    // companyWebsite: "https://techinnovations.com", // For employer

  // State Management
  const [formData, setFormData] = useState({
      name: user?.name || "",
      phone: user?.phone || "",
      location: user?.location || "",
      bio: user?.bio || "",
      companyName: user?.companyName || "",
      companyWebsite: user?.companyWebsite || "",
      portfolioUrl: user?.portfolioUrl || ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    alert("This is just a UI preview! Logic will run here later.");
  };

  if (!user) return <div className="p-10 text-center dark:text-white">Loading...</div>;

  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto w-full transition-colors duration-300">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white transition-colors">
            {user.role === 'employer' ? 'Company Profile' : 'My Candidate Profile'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your personal information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Avatar Card */}
        <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg">
                
                {/* Avatar with Gradient Border */}
                <div className="w-32 h-32 rounded-full p-1 bg-linear-to-r from-pink-200 via-blue-200 to-green-200 dark:from-indigo-600 dark:to-blue-600 mb-4">
                    <img 
                        src={imageFile ? URL.createObjectURL(imageFile) : user.profilePic} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover border-4 border-white dark:border-slate-800"
                    />
                </div>
                
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">{formData.name || "Your Name"}</h2>
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mt-1">{user.role}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">{user.email}</p>

                <div className="mt-6 w-full">
                    <label className="block w-full py-2.5 px-4 rounded-full border border-slate-200 dark:border-slate-600 font-semibold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors text-center">
                        Change Avatar
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files[0])} />
                    </label>
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: The Form */}
        <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-slate-700 transition-all duration-300">
                <form onSubmit={handleUpdate} className="flex flex-col gap-6">
                    
                    {/* Basic Info Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Location</label>
                            <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g. San Francisco, CA" className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-colors" />
                        </div>
                    </div>

                    {/* EMPLOYER SPECIFIC FIELDS */}
                    {user.role === 'employer' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company Name</label>
                                <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-colors" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company Website</label>
                                <input type="url" name="companyWebsite" value={formData.companyWebsite} onChange={handleInputChange} placeholder="https://" className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-colors" />
                            </div>
                        </div>
                    )}

                    {/* SEEKER SPECIFIC FIELDS */}
                    {user.role === 'seeker' && (
                        <div className="grid grid-cols-1 gap-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Portfolio / GitHub Link</label>
                                <input type="url" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleInputChange} placeholder="https://github.com/..." className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-colors" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Upload Resume (PDF)</label>
                                <input type="file" accept=".pdf" onChange={(e) => setResumeFile(e.target.files[0])} className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-slate-700 dark:file:text-indigo-400 dark:hover:file:bg-slate-600 transition-all cursor-pointer" />
                            </div>
                        </div>
                    )}

                    {/* Shared Text Area */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {user.role === 'employer' ? 'Company Description' : 'Professional Summary'}
                        </label>
                        <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows="4" className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-colors resize-none"></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <button type="submit" className="bg-linear-to-r from-pink-200 to-blue-200 dark:from-indigo-600 dark:to-blue-600 text-slate-900 dark:text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity shadow-sm hover:shadow-md">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>

      </div>
    </div>
  );
}