import React, { useState, useEffect, useRef } from "react";
import { taskService } from "../services/taskService";
import { Users, Search, Plus, X, Upload, Camera, CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmployeeDirectory() {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [masterRoles, setMasterRoles] = useState([]);
  const [masterLocations, setMasterLocations] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [place, setPlace] = useState("");
  const [bioId, setBioId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");

  // Edit Form State
  const [editingEmpId, setEditingEmpId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editPlace, setEditPlace] = useState("");
  const [editBioId, setEditBioId] = useState("");
  const [editMobileNumber, setEditMobileNumber] = useState("");
  const [editAadharNumber, setEditAadharNumber] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editAvatar, setEditAvatar] = useState("");

  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  useEffect(() => {
    // Fetch all employees
    setEmployees(taskService.getEmployees());
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

  const handleOpenEditModal = (emp) => {
    setEditingEmpId(emp.id);
    setEditName(emp.name || "");
    setEditEmail(emp.email || "");
    setEditRole(emp.role || "");
    setEditPlace(emp.place || "");
    setEditBioId(emp.bioId || "");
    setEditMobileNumber(emp.mobileNumber || "");
    setEditAadharNumber(emp.aadharNumber || "");
    setEditPassword(emp.password || "");
    setEditAvatar(emp.avatar || "");
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
    if (!editMobileNumber || !mobileRegex.test(editMobileNumber.replace(/[\s-]/g, ''))) {
      alert("Mobile number must be exactly 10 digits.");
      return;
    }
    const aadharRegex = /^\d{12}$/;
    if (!editAadharNumber || !aadharRegex.test(editAadharNumber.replace(/[\s-]/g, ''))) {
      alert("Aadhar number must be exactly 12 digits.");
      return;
    }

    const updateData = {
      name: editName,
      email: editEmail,
      role: editRole || "Team Member",
      place: editPlace,
      bioId: editBioId,
      mobileNumber: editMobileNumber,
      aadharNumber: editAadharNumber,
      avatar: editAvatar
    };
    if (editPassword) {
      updateData.password = editPassword;
    }

    taskService.updateEmployee(editingEmpId, updateData);

    // Refresh employees list
    setEmployees(taskService.getEmployees());
    setIsEditModalOpen(false);

    // Show Toast
    setToastMessage(`Employee "${editName}" updated successfully!`);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleDeleteEmployee = (id, empName) => {
    if (window.confirm(`Are you sure you want to delete ${empName}?`)) {
      taskService.deleteEmployee(id);
      setEmployees(taskService.getEmployees());
      setToastMessage(`Employee "${empName}" deleted successfully!`);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Name is required");
      return;
    }
    if (!password.trim()) {
      alert("Password is required");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileNumber || !mobileRegex.test(mobileNumber.replace(/[\s-]/g, ''))) {
      alert("Mobile number must be exactly 10 digits.");
      return;
    }
    const aadharRegex = /^\d{12}$/;
    if (!aadharNumber || !aadharRegex.test(aadharNumber.replace(/[\s-]/g, ''))) {
      alert("Aadhar number must be exactly 12 digits.");
      return;
    }

    const newEmp = taskService.addEmployee({
      name,
      email,
      role: role || "Team Member",
      place,
      bioId,
      mobileNumber,
      aadharNumber,
      password,
      avatar
    });

    // Refresh employees list
    setEmployees(taskService.getEmployees());

    // Reset Form State
    setName("");
    setEmail("");
    setRole("");
    setPlace("");
    setBioId("");
    setMobileNumber("");
    setAadharNumber("");
    setPassword("");
    setAvatar("");

    // Close Modal
    setIsModalOpen(false);

    // Show Toast
    setToastMessage(`Employee "${newEmp.name}" added successfully!`);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Filter employees based on search query
  const filteredEmployees = employees.filter((emp) => {
    const query = searchQuery.toLowerCase();
    return (
      emp.name.toLowerCase().includes(query) ||
      (emp.role && emp.role.toLowerCase().includes(query)) ||
      (emp.place && emp.place.toLowerCase().includes(query)) ||
      (emp.email && emp.email.toLowerCase().includes(query))
    );
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-fade-in pb-8 lg:pb-12 relative">
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

      {/* Header Section */}
      <div className="relative overflow-hidden rounded-[1.5rem] lg:rounded-[2rem] bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-5 sm:p-6 lg:p-10 shadow-premium flex flex-col md:flex-row justify-between items-center gap-4 lg:gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 flex items-center gap-3">
            <Users size={32} className="text-primary" />
            Employee Directory
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-semibold mt-2 text-sm max-w-lg leading-relaxed">
            Find and connect with your colleagues in the workspace.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-full text-slate-900 dark:text-white font-semibold transition-all"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-xl font-bold text-sm shadow-glow hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
          >
            <Plus size={18} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Grid of Employees */}
      {filteredEmployees.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800/40 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-8 shadow-sm">
          <Users size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Employees Found</h3>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">Try resetting your search query or add a new employee.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:gap-6">
          {filteredEmployees.map((emp, index) => {
            const colors = [
              "bg-blue-600",
              "bg-emerald-600",
              "bg-slate-600",
              "bg-indigo-600",
              "bg-rose-600",
              "bg-amber-600"
            ];
            const btnColors = [
              "bg-blue-600 hover:bg-blue-700",
              "bg-emerald-600 hover:bg-emerald-700",
              "bg-slate-600 hover:bg-slate-700",
              "bg-indigo-600 hover:bg-indigo-700",
              "bg-rose-600 hover:bg-rose-700",
              "bg-amber-600 hover:bg-amber-700"
            ];
            const colorIndex = index % colors.length;

            return (
              <div key={emp.id} className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-premium transition-all duration-300 flex flex-col group hover:-translate-y-1 relative">
                {/* Edit & Delete Actions Overlay */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20 opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleOpenEditModal(emp)}
                    title="Edit Profile"
                    className="p-2 rounded-xl bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light shadow-md hover:scale-105 transition-all"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                    title="Delete Profile"
                    className="p-2 rounded-xl bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-350 hover:text-rose-500 dark:hover:text-rose-400 shadow-md hover:scale-105 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Top Color Bar */}
                <div className={`h-20 ${colors[colorIndex]} w-full transition-all duration-300 group-hover:h-24`}></div>

                {/* Profile Image & Details */}
                <div className="px-6 pb-6 flex-1 flex flex-col items-center text-center -mt-10 relative z-10">
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-md bg-white mb-4 transition-transform duration-300 group-hover:scale-105"
                  />
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">{emp.name}</h3>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">{emp.role || "Team Member"}</p>
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">{emp.place || "Remote"}</p>

                  <div className="mt-auto pt-6 w-full">
                    <Link
                      to={`/directory/${emp.id}`}
                      className={`block w-full py-2.5 rounded-lg text-white text-sm font-bold transition-colors ${btnColors[colorIndex]}`}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Employee Glassmorphic Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] lg:rounded-[2.5rem] shadow-premium max-w-2xl w-full max-h-[95vh] overflow-y-auto p-4 sm:p-6 lg:p-8 animate-slide-up custom-scrollbar">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/50">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus className="text-primary" size={24} />
                  Add New Employee
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">Fill in the workspace details for the new team member.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-4 lg:space-y-6">
              {/* Photo Upload Section */}
              <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50 dark:bg-slate-900/40 p-5 rounded-3xl border border-slate-150 dark:border-slate-700/30">
                <div
                  className="relative group cursor-pointer shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-white dark:ring-slate-800 shadow-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    {avatar ? (
                      <img src={avatar} alt="Preview" className="w-full h-full object-cover" />
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
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Profile Photo</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Upload a profile picture or leave blank to auto-generate a sleek fallback.</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. john@company.com"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-semibold transition-all"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 ml-1">Password *</label>
                  <input
                    type="text"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="e.g. password123"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-semibold transition-all"
                  />
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 ml-1">Role / Job Title</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-semibold transition-all appearance-none"
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

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 ml-1">Place / Location</label>
                  <select
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-semibold transition-all appearance-none"
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

                {/* Bio ID */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 ml-1">Bio ID / Employee ID</label>
                  <input
                    type="text"
                    value={bioId}
                    onChange={(e) => setBioId(e.target.value)}
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
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="e.g. 9876543210"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-semibold transition-all"
                  />
                </div>

                {/* Aadhar Number */}
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 ml-1">Aadhar Number</label>
                  <input
                    type="text"
                    required
                    maxLength={12}
                    value={aadharNumber}
                    onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                    placeholder="XXXX-XXXX-XXXX"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-semibold transition-all"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl font-bold text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm shadow-glow transition-all"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 ml-1">Password</label>
                  <input
                    type="text"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Leave blank to keep unchanged"
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
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 ml-1">Aadhar Number</label>
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

