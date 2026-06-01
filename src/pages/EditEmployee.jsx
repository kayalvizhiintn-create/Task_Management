import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Camera, Upload, CheckCircle2 } from "lucide-react";
import { taskService } from "../services/taskService";

export default function EditEmployee() {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [place, setPlace] = useState("");
  const [bioId, setBioId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [avatar, setAvatar] = useState(null);

  const [masterRoles, setMasterRoles] = useState([]);
  const [masterLocations, setMasterLocations] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMasterRoles(taskService.getMasterRoles() || []);
    setMasterLocations(taskService.getMasterLocations() || []);

    const employee = taskService.getEmployeeById(id);
    if (employee) {
      setName(employee.name || "");
      setEmail(employee.email || "");
      setPassword(employee.password || "");
      setRole(employee.role || "");
      setPlace(employee.place || "");
      setBioId(employee.bioId || "");
      setMobileNumber(employee.mobileNumber || "");
      setAadharNumber(employee.aadharNumber || "");
      setAvatar(employee.avatar || null);
    }
    setLoading(false);
  }, [id]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditEmployee = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Name is required");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }
    
    const updateData = {
      name,
      email,
      role: role || "Team Member",
      place,
      bioId,
      mobileNumber,
      aadharNumber,
      avatar
    };
    if (password) updateData.password = password;

    taskService.updateEmployee(id, updateData);
    
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate(-1); // Go back to the previous page (Directory or Profile View)
    }, 1500);
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8 animate-fade-in pb-8 lg:pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 lg:p-8 rounded-[2rem] shadow-premium border border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-slide-up relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light rounded-2xl shadow-sm hover:shadow-md transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Edit Employee Profile</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-semibold text-sm">Update the details for this employee.</p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white dark:bg-slate-800 p-6 lg:p-8 rounded-[2rem] shadow-premium border border-slate-100 dark:border-slate-700/50 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <form onSubmit={handleEditEmployee} className="space-y-8">
          {/* Photo Upload Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 dark:bg-slate-900/40 p-6 rounded-3xl border border-slate-150 dark:border-slate-700/30">
            <div
              className="relative group cursor-pointer shrink-0"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-white dark:ring-slate-800 shadow-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center transition-transform group-hover:scale-105">
                {avatar ? (
                  <img src={avatar} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={28} className="text-slate-400" />
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-2xl">
                <Camera size={20} className="text-white" />
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
              />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Profile Photo</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium max-w-md">Update the professional profile picture.</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-dark dark:text-primary-light transition-colors bg-primary/10 px-4 py-2 rounded-xl"
              >
                <Upload size={16} /> Select Image
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-700 dark:text-slate-300 ml-1">Full Name *</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white font-semibold transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-700 dark:text-slate-300 ml-1">Email Address *</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white font-semibold transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-700 dark:text-slate-300 ml-1">Password</label>
              <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white font-semibold transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-700 dark:text-slate-300 ml-1">Role / Job Title</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white font-semibold transition-all appearance-none cursor-pointer">
                <option value="" disabled>Select Role</option>
                {masterRoles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                {role && !masterRoles.find(r => r.name === role) && <option value={role}>{role}</option>}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-700 dark:text-slate-300 ml-1">Place / Location</label>
              <select value={place} onChange={(e) => setPlace(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white font-semibold transition-all appearance-none cursor-pointer">
                <option value="" disabled>Select Location</option>
                {masterLocations.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
                {place && !masterLocations.find(l => l.name === place) && <option value={place}>{place}</option>}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-700 dark:text-slate-300 ml-1">Bio ID / Employee ID</label>
              <input type="text" value={bioId} onChange={(e) => setBioId(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white font-semibold transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-700 dark:text-slate-300 ml-1">Mobile Number</label>
              <input type="text" maxLength={10} value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white font-semibold transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-700 dark:text-slate-300 ml-1">Aadhar Number</label>
              <input type="text" maxLength={12} value={aadharNumber} onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, '').slice(0, 12))} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white font-semibold transition-all" />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl font-bold text-sm transition-all shadow-sm w-full sm:w-auto text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold text-sm shadow-glow transition-all w-full sm:w-auto text-center"
            >
              Save Employee
            </button>
          </div>
        </form>
      </div>

      {showToast && (
        <div className="fixed bottom-8 right-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-2xl shadow-premium flex items-center gap-3 border border-slate-800 dark:border-slate-100 z-50 animate-slide-up">
          <div className="bg-emerald-500/20 p-1.5 rounded-full">
            <CheckCircle2 size={20} className="text-emerald-500" />
          </div>
          <span className="text-sm font-bold tracking-wide">Saved Successfully!</span>
        </div>
      )}
    </div>
  );
}
