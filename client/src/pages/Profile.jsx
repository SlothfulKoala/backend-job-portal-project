import React, { useState } from 'react';
import { Mail, Phone, MapPin, Globe, Link as LinkIcon, Plus, Trash2, X, Briefcase, User as UserIcon, Edit3, Check, RotateCcw } from 'lucide-react';

export default function Profile() {
    // 1. Core User Data (This would come from your Backend/AuthContext)
    const [user, setUser] = useState({
        name: "Aditya Goyal",
        email: "aditya@careervista.com",
        role: "seeker", 
        profilePic: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
        phone: "+91 98765 43210",
        location: "Punjab, India",
        links: [
            { name: "GitHub", url: "https://github.com/aditya" },
        ],
        profile: { bio: "Full-stack developer focused on MERN.", resume: "" },
        companyDetails: { companyName: "", website: "", description: "" }
    });

    // 2. Form & UI State
    const [isEditing, setIsEditing] = useState(false); // The "Toggle"
    const [formData, setFormData] = useState({ ...user });
    const [isAddingLink, setIsAddingLink] = useState(false);
    const [newLink, setNewLink] = useState({ name: '', url: '' });
    const [imageFile, setImageFile] = useState(null);

    // 3. Logic Handlers
    const handleCancel = () => {
        setFormData({ ...user }); // Reset to original data
        setImageFile(null);
        setIsEditing(false);
        setIsAddingLink(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        // Insert your fetch(PATCH) logic here (as discussed in previous steps)
        console.log("Saving data:", formData);
        setUser({ ...formData }); // Mock success
        setIsEditing(false);
    };

    // Shared input styling to reduce clutter
    const inputStyle = `w-full px-4 py-3.5 rounded-2xl outline-none transition-all ${
        isEditing 
        ? "bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-indigo-500/20 dark:text-white" 
        : "bg-slate-100/50 dark:bg-slate-800/30 border-transparent text-slate-500 cursor-not-allowed"
    }`;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-10 transition-colors duration-300">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* --- SIDEBAR --- */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none text-center">
                        <div className="relative group w-32 h-32 mx-auto mb-6">
                            <div className="absolute inset-0 bg-gradient-to-tr from-pink-300 via-blue-300 to-green-300 rounded-full blur-sm opacity-70"></div>
                            <img 
                                src={imageFile ? URL.createObjectURL(imageFile) : formData.profilePic} 
                                className="relative w-full h-full rounded-full object-cover border-4 border-white dark:border-slate-900 shadow-md" 
                            />
                            {isEditing && (
                                <label className="absolute bottom-0 right-0 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
                                    <Plus size={16} className="text-indigo-600" />
                                    <input type="file" className="hidden" onChange={(e) => setImageFile(e.target.files[0])} />
                                </label>
                            )}
                        </div>
                        <h2 className="text-2xl font-bold dark:text-white">{formData.name}</h2>
                        
                        {/* Links Section */}
                        <div className="mt-10 text-left">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Connect</h3>
                                {isEditing && (
                                    <button onClick={() => setIsAddingLink(!isAddingLink)} className="text-indigo-500 hover:bg-indigo-50 p-1 rounded">
                                        <Plus size={18} />
                                    </button>
                                )}
                            </div>

                            {isEditing && isAddingLink && (
                                <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-2 border border-dashed border-slate-300">
                                    <input placeholder="Label" className="w-full text-xs p-2 bg-transparent border-b outline-none dark:text-white" value={newLink.name} onChange={e => setNewLink({...newLink, name: e.target.value})} />
                                    <input placeholder="URL" className="w-full text-xs p-2 bg-transparent outline-none dark:text-white" value={newLink.url} onChange={e => setNewLink({...newLink, url: e.target.value})} />
                                    <button onClick={() => { setFormData(prev => ({ ...prev, links: [...prev.links, newLink] })); setIsAddingLink(false); }} className="w-full py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg mt-2 uppercase">Confirm</button>
                                </div>
                            )}

                            <div className="space-y-2">
                                {formData.links.map((link, i) => (
                                    <div key={i} className="flex items-center bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                                        <LinkIcon size={14} className="text-slate-400 mr-3" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">{link.name}</p>
                                            <p className="text-xs text-indigo-600 truncate">{link.url}</p>
                                        </div>
                                        {isEditing && (
                                            <button onClick={() => setFormData(prev => ({ ...prev, links: prev.links.filter((_, idx) => idx !== i) }))} className="text-red-400 ml-2"><Trash2 size={14}/></button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- MAIN FORM --- */}
                <div className="lg:col-span-8">
                    <form className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white dark:border-slate-800 shadow-xl space-y-10">
                        
                        {/* Header with Mode Switching Buttons */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600"><UserIcon size={20}/></div>
                                <h3 className="text-xl font-bold dark:text-white">Profile Information</h3>
                            </div>
                            
                            {!isEditing ? (
                                <button 
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
                                >
                                    <Edit3 size={18} /> Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-3">
                                    <button 
                                        type="button"
                                        onClick={handleCancel}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-300 transition-all"
                                    >
                                        <RotateCcw size={18} /> Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        onClick={handleSave}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-500 transition-all shadow-lg shadow-green-200 dark:shadow-none"
                                    >
                                        <Check size={18} /> Save Changes
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
                                <input value={formData.email} readOnly className="w-full px-4 py-3.5 bg-slate-100/50 dark:bg-slate-800/30 border-transparent text-slate-400 cursor-not-allowed rounded-2xl outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                                <input name="name" value={formData.name} onChange={handleInputChange} readOnly={!isEditing} className={inputStyle} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Phone Number</label>
                                <input name="phone" value={formData.phone} onChange={handleInputChange} readOnly={!isEditing} className={inputStyle} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Location</label>
                                <input name="location" value={formData.location} onChange={handleInputChange} readOnly={!isEditing} className={inputStyle} />
                            </div>
                        </div>

                        {/* Role Specific Section */}
                        <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                             <h3 className="text-lg font-bold dark:text-white mb-6 uppercase tracking-tight text-slate-400">
                                {formData.role === 'employer' ? 'Corporate Details' : 'Professional Background'}
                             </h3>
                             
                             {formData.role === 'employer' ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Company Name</label>
                                            <input name="companyDetails.companyName" value={formData.companyDetails.companyName} onChange={handleInputChange} readOnly={!isEditing} className={inputStyle} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Company Website</label>
                                            <input name="companyDetails.website" value={formData.companyDetails.website} onChange={handleInputChange} readOnly={!isEditing} className={inputStyle} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">About Company</label>
                                        <textarea name="companyDetails.description" value={formData.companyDetails.description} onChange={handleInputChange} readOnly={!isEditing} rows="4" className={`${inputStyle} resize-none`} />
                                    </div>
                                </div>
                             ) : (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Professional Bio</label>
                                        <textarea name="profile.bio" value={formData.profile.bio} onChange={handleInputChange} readOnly={!isEditing} rows="4" className={`${inputStyle} resize-none`} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Resume (PDF)</label>
                                        <div className={`p-6 border-2 border-dashed rounded-3xl transition-all ${isEditing ? 'border-indigo-200 bg-indigo-50/10' : 'border-transparent bg-slate-100/50'}`}>
                                            <p className="text-sm text-slate-500 mb-2">Current Resume: <span className="font-bold text-indigo-600">{user.profile.resume || "No file uploaded"}</span></p>
                                            {isEditing && <input type="file" accept=".pdf" className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-600 file:text-white cursor-pointer" />}
                                        </div>
                                    </div>
                                </div>
                             )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}