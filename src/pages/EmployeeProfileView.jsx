import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { taskService } from "../services/taskService";
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Hash, Pencil, Trash2, Camera, Upload, X, CheckCircle2 } from "lucide-react";

export default function EmployeeProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  // Edit Form Fields
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editPlace, setEditPlace] = useState("");
  const [editBioId, setEditBioId] = useState("");
  const [editMobileNumber, setEditMobileNumber] = useState("");
  const [editAadharNumber, setEditAadharNumber] = useState("");
  const [editAvatar, setEditAvatar] = useState("");

  const [masterRoles, setMasterRoles] = useState([]);
  const [masterLocations, setMasterLocations] = useState([]);

  const editFileInputRef = useRef(null);

  useEffect(() => {
    const allEmployees = taskService.getEmployees();
    const found = allEmployees.find(e => e.id === id);
    if (found) {
      setEmployee(found);
    }
    setMasterRoles(taskService.getMasterRoles());
    setMasterLocations(taskService.getMasterLocations());
  }, [id]);

  const handleEditPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenEditModal = () => {
    if (!employee) return;
    setEditName(employee.name || "");
    setEditEmail(employee.email || "");
    setEditRole(employee.role || "");
    setEditPlace(employee.place || "");
    setEditBioId(employee.bioId || "");
    setEditMobileNumber(employee.mobileNumber || "");
    setEditAadharNumber(employee.aadharNumber || "");
    setEditAvatar(employee.avatar || "");
    setIsEditModalOpen(true);
  };

  const handleEditEmployee = (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      alert("Name is required");
      return;
    }
    if (!editEmail.trim() || !editEmail.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    const mobileRegex = /^\d{10}$/;
    const mobileStr = String(editMobileNumber || "");
    if (!mobileStr || !mobileRegex.test(mobileStr.replace(/[\s-]/g, ''))) {
      alert("Mobile number must be exactly 10 digits.");
      return;
    }
    const aadharRegex = /^\d{12}$/;
    const aadharStr = String(editAadharNumber || "");
    if (!aadharStr || !aadharRegex.test(aadharStr.replace(/[\s-]/g, ''))) {
      alert("Aadhar number must be exactly 12 digits.");
      return;
    }

    const updated = taskService.updateEmployee(employee.id, {
      name: editName,
      email: editEmail,
      role: editRole || "Team Member",
      place: editPlace,
      bioId: editBioId,
      mobileNumber: editMobileNumber,
      aadharNumber: editAadharNumber,
      avatar: editAvatar
    });

    setEmployee(updated);
    setIsEditModalOpen(false);

    setToastMessage(`Profile updated successfully!`);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleDeleteEmployee = () => {
    if (window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
      taskService.deleteEmployee(employee.id);
      navigate("/directory");
    }
  };

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Employee Not Found</h2>
        <button onClick={() => navigate("/directory")} className="text-primary font-bold hover:underline">
          Return to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8 animate-fade-in pb-8 lg:pb-12 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-8 right-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-2xl shadow-premium flex items-center gap-3 border border-slate-800 dark:border-slate-100 z-50 animate-slide-up">
          <div className="bg-emerald-500/20 p-1.5 rounded-full">
            <CheckCircle2 size={20} className="text-emerald-500" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Success</h4>
            <p className="text-xs text-slate-300 dark:text-slate-600 font-semibold">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Back Button */}
      <Link to="/directory" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors">
        <ArrowLeft size={16} />
        Back to Directory
      </Link>

      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden shadow-premium relative">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

        {/* Edit & Delete Actions Overlay */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
          <button 
            onClick={handleOpenEditModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light rounded-xl text-xs font-bold shadow-md hover:scale-105 transition-all border border-slate-200/40 dark:border-slate-700/40"
          >
            <Pencil size={13} /> Edit
          </button>
          <button 
            onClick={handleDeleteEmployee}
            className="flex items-center gap-1.5 px-3 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md hover:bg-rose-600 hover:scale-105 transition-all"
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>

        <div className="px-5 sm:px-8 pb-5 sm:pb-8 flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6 -mt-12 relative z-10">
          <img 
            src={employee.avatar} 
            alt={employee.name} 
            className="w-32 h-32 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-lg bg-white" 
          />
          <div className="flex-1 text-center md:text-left mt-2 md:mt-14">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">{employee.name}</h1>
            <p className="text-primary dark:text-primary-light font-bold mt-1 text-lg">{employee.role || "Team Member"}</p>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Contact Information */}
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-[1.5rem] lg:rounded-3xl p-5 lg:p-8 shadow-sm">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-6">Contact Information</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-slate-400">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Email Address</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">{employee.email}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-slate-400">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Mobile Number</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">{employee.mobileNumber || "Not Provided"}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-slate-400">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Location</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">{employee.place || "Not Provided"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Details */}
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-[1.5rem] lg:rounded-3xl p-5 lg:p-8 shadow-sm">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-6">Professional Details</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-slate-400">
                <Briefcase size={20} />
              </div>
              <div>
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Bio ID / Employee ID</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">{employee.bioId || "-"}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-slate-400">
                <Hash size={20} />
              </div>
              <div>
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Aadhar Number</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  {employee.aadharNumber ? `•••• •••• ${String(employee.aadharNumber).slice(-4)}` : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Edit Employee Glassmorphic Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] lg:rounded-[2.5rem] shadow-premium max-w-2xl w-full max-h-[95vh] overflow-y-auto p-4 sm:p-6 lg:p-8 animate-slide-up custom-scrollbar">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/50">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Pencil className="text-primary" size={24} />
                  Edit Employee Profile
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">Update the details for this employee profile.</p>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditEmployee} className="space-y-4 lg:space-y-6">
              {/* Photo Upload Section */}
              <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50 dark:bg-slate-900/40 p-5 rounded-3xl border border-slate-150 dark:border-slate-700/30">
                <div 
                  className="relative group cursor-pointer shrink-0"
                  onClick={() => editFileInputRef.current?.click()}
                >
                  <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-white dark:ring-slate-800 shadow-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    {editAvatar ? (
                      <img src={editAvatar} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera size={24} className="text-slate-400" />
                    )}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-2xl">
                    <Camera size={18} className="text-white" />
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={editFileInputRef} 
                    onChange={handleEditPhotoUpload} 
                  />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Profile Photo</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Update the profile picture or keep the current one.</p>
                  <button 
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark dark:text-primary-light transition-colors"
                  >
                    <Upload size={13} /> Select Image
                  </button>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 ml-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-semibold transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 ml-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="e.g. john@company.com"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-semibold transition-all"
                  />
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 ml-1">Role / Job Title</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-semibold transition-all appearance-none"
                  >
                    <option value="" disabled>Select Role</option>
                    {masterRoles.map(r => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                    {editRole && !masterRoles.find(r => r.name === editRole) && (
                      <option value={editRole}>{editRole}</option>
                    )}
                  </select>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 ml-1">Place / Location</label>
                  <select
                    value={editPlace}
                    onChange={(e) => setEditPlace(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-semibold transition-all appearance-none"
                  >
                    <option value="" disabled>Select Location</option>
                    {masterLocations.map(l => (
                      <option key={l.id} value={l.name}>{l.name}</option>
                    ))}
                    {editPlace && !masterLocations.find(l => l.name === editPlace) && (
                      <option value={editPlace}>{editPlace}</option>
                    )}
                  </select>
                </div>

                {/* Bio ID */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 ml-1">Bio ID / Employee ID</label>
                  <input
                    type="text"
                    value={editBioId}
                    onChange={(e) => setEditBioId(e.target.value)}
                    placeholder="e.g. BIO-98432"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-semibold transition-all"
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 ml-1">Mobile Number</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={editMobileNumber}
                    onChange={(e) => setEditMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="e.g. 9876543210"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-semibold transition-all"
                  />
                </div>

                {/* Aadhar Number */}
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-350 ml-1">Aadhar Number</label>
                  <input
                    type="text"
                    required
                    maxLength={12}
                    value={editAadharNumber}
                    onChange={(e) => setEditAadharNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                    placeholder="XXXX-XXXX-XXXX"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-semibold transition-all"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl font-bold text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm shadow-glow transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
