import React, { useState, useEffect, useRef } from "react";
import { taskService } from "../services/taskService";
import { User, CheckCircle2, Camera, Upload, Shield } from "lucide-react";

export default function EmployeeDetails() {
  const [currentUser, setCurrentUser] = useState(null);

  // Profile Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [place, setPlace] = useState("");
  const [bioId, setBioId] = useState("");
  const [role, setRole] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [avatar, setAvatar] = useState("");

  const [masterRoles, setMasterRoles] = useState([]);
  const [masterLocations, setMasterLocations] = useState([]);

  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const user = taskService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setName(user.name || "");
      setEmail(user.email || "");
      setPlace(user.place || "");
      setBioId(user.bioId || "");
      setRole(user.role || "");
      setAadharNumber(user.aadharNumber || "");
      setMobileNumber(user.mobileNumber || "");
      setAvatar(user.avatar || "");
    }
    setMasterRoles(taskService.getMasterRoles());
    setMasterLocations(taskService.getMasterLocations());
  }, []);

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

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const mobileRegex = /^\d{10}$/;
    const mobileStr = String(mobileNumber || "");
    if (!mobileStr || !mobileRegex.test(mobileStr.replace(/[\s-]/g, ''))) {
      alert("Mobile number must be exactly 10 digits.");
      return;
    }
    const aadharRegex = /^\d{12}$/;
    const aadharStr = String(aadharNumber || "");
    if (!aadharStr || !aadharRegex.test(aadharStr.replace(/[\s-]/g, ''))) {
      alert("Aadhar number must be exactly 12 digits.");
      return;
    }

    const updated = {
      ...currentUser,
      name,
      email,
      place,
      bioId,
      role,
      aadharNumber,
      mobileNumber,
      avatar
    };

    localStorage.setItem("navanala_currentUser", JSON.stringify(updated));

    // Update matching employee in lists
    const emps = taskService.getEmployees();
    const idx = emps.findIndex(emp => emp.id === currentUser.id);
    if (idx !== -1) {
      emps[idx] = { ...emps[idx], ...updated };
      localStorage.setItem("navanala_employees", JSON.stringify(emps));
    }

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 lg:space-y-8 animate-fade-in pb-8 lg:pb-12">

      {showToast && (
        <div className="fixed top-8 right-8 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-floating flex items-center gap-3 border border-slate-800 z-50 animate-slide-up">
          <div className="bg-emerald-500/20 p-1.5 rounded-full">
            <CheckCircle2 size={20} className="text-emerald-500" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Success</h4>
            <p className="text-xs text-slate-300 font-medium">Employee details saved successfully.</p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="relative overflow-hidden rounded-[1.5rem] lg:rounded-[2rem] bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-5 sm:p-6 lg:p-10 shadow-premium">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 dark:bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

        <div className="relative flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
              Employee Profile
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-semibold mt-2 text-sm max-w-lg leading-relaxed">
              Manage your personal and professional profile details. Make sure all your information is up to date in the company directory.
            </p>
          </div>
          <button
            onClick={handleSaveProfile}
            className="group relative px-6 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-sm font-extrabold shadow-lg hover:shadow-xl transition-all overflow-hidden whitespace-nowrap shrink-0"
          >
            <div className="absolute inset-0 bg-white/20 dark:bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            <span className="relative flex items-center gap-2">
              <Shield size={16} /> Save Details
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">

        <div className="bg-white dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 p-5 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] shadow-sm hover:shadow-premium transition-shadow duration-300">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-slate-700/50">
            <div className="p-3 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light rounded-2xl">
              <User size={24} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Profile Information</h3>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">Your personal identity in the workspace</p>
            </div>
          </div>

          {currentUser && (
            <div className="space-y-8">
              {/* Photo Upload Section */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div
                  className="relative group cursor-pointer shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-24 h-24 rounded-[2rem] object-cover ring-4 ring-slate-50 dark:ring-slate-800 shadow-lg group-hover:opacity-80 transition-opacity bg-slate-100 dark:bg-slate-700"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-slate-900/60 p-2 rounded-xl backdrop-blur-sm">
                      <Camera size={20} className="text-white" />
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                  />
                </div>
                <div className="flex-1 space-y-2 text-center sm:text-left mt-2 sm:mt-0 flex flex-col justify-center h-24">
                  <h5 className="font-black text-slate-900 dark:text-white text-xl">{name || "Your Name"}</h5>
                  <p className="text-xs font-bold text-primary dark:text-primary-light uppercase tracking-widest">{role || "Your Role"}</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors mx-auto sm:mx-0"
                  >
                    <Upload size={14} /> Update Photo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-bold transition-all"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-bold transition-all"
                    placeholder="e.g. john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 ml-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-bold transition-all appearance-none"
                  >
                    <option value="" disabled>Select Role</option>
                    {masterRoles.map(r => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                    {role && !masterRoles.find(r => r.name === role) && (
                      <option value={role}>{role}</option>
                    )}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 ml-1">Place / Location</label>
                  <select
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-bold transition-all appearance-none"
                  >
                    <option value="" disabled>Select Location</option>
                    {masterLocations.map(l => (
                      <option key={l.id} value={l.name}>{l.name}</option>
                    ))}
                    {place && !masterLocations.find(l => l.name === place) && (
                      <option value={place}>{place}</option>
                    )}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 ml-1">Bio ID / Employee ID</label>
                  <input
                    type="text"
                    value={bioId}
                    onChange={(e) => setBioId(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-bold transition-all"
                    placeholder="e.g. BIO-98234"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 ml-1">Mobile Number</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-bold transition-all"
                    placeholder="e.g. 9876543210"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2 md:col-span-3">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 ml-1">Aadhar Number</label>
                  <input
                    type="text"
                    required
                    maxLength={12}
                    value={aadharNumber}
                    onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-bold transition-all"
                    placeholder="XXXX-XXXX-XXXX"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
