import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Save, UserPlus, Search, Users, PlusCircle, User, Image as ImageIcon } from "lucide-react";
import { taskService } from "../services/taskService";

export default function AddTeamMember() {
  const navigate = useNavigate();
  const { teamId } = useParams();

  const [activeTab, setActiveTab] = useState("existing");
  const [employees, setEmployees] = useState([]);
  const [masterRoles, setMasterRoles] = useState([]);
  const [masterLocations, setMasterLocations] = useState([]);
  
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");
  const [newMemberPlace, setNewMemberPlace] = useState("");
  const [newMemberBioId, setNewMemberBioId] = useState("");
  const [newMemberMobileNumber, setNewMemberMobileNumber] = useState("");
  const [newMemberAadharNumber, setNewMemberAadharNumber] = useState("");
  const [newMemberAvatar, setNewMemberAvatar] = useState("");

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setEmployees(taskService.getEmployees() || []);
    setMasterRoles(taskService.getMasterRoles() || []);
    setMasterLocations(taskService.getMasterLocations() || []);
    setLoading(false);
  }, [teamId]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate("/team-details");
    }, 1500);
  };

  const addMemberToTeam = (empId) => {
    const storedTeams = localStorage.getItem("navanala_teams");
    if (!storedTeams) return;
    let updatedTeams = JSON.parse(storedTeams);
    updatedTeams = updatedTeams.map(t => {
      if (t.id === teamId) {
        const memberIds = [...(t.memberIds || [])];
        if (!memberIds.includes(empId)) {
          memberIds.push(empId);
        }
        return { ...t, memberIds };
      }
      return t;
    });
    localStorage.setItem("navanala_teams", JSON.stringify(updatedTeams));
  };

  const handleAddExistingMember = (emp) => {
    addMemberToTeam(emp.id);
    triggerToast(`"${emp.name}" added to team successfully!`);
  };

  const handleCreateAndAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) {
      alert("Name is required");
      return;
    }
    if (!newMemberEmail.trim() || !newMemberEmail.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }
    const mobileRegex = /^\d{10}$/;
    if (!newMemberMobileNumber || !mobileRegex.test(newMemberMobileNumber.replace(/[\s-]/g, ''))) {
      alert("Mobile number must be exactly 10 digits.");
      return;
    }
    const aadharRegex = /^\d{12}$/;
    if (!newMemberAadharNumber || !aadharRegex.test(newMemberAadharNumber.replace(/[\s-]/g, ''))) {
      alert("Aadhar number must be exactly 12 digits.");
      return;
    }

    const newEmp = taskService.addEmployee({
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole || "Team Member",
      place: newMemberPlace,
      bioId: newMemberBioId,
      mobileNumber: newMemberMobileNumber,
      aadharNumber: newMemberAadharNumber,
      avatar: newMemberAvatar
    });

    addMemberToTeam(newEmp.id);
    triggerToast(`Employee "${newEmp.name}" created and added to team!`);
  };

  const handleNewMemberPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMemberAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const searchFilteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
    emp.role.toLowerCase().includes(memberSearchQuery.toLowerCase())
  );

  if (loading) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8 animate-fade-in pb-8 lg:pb-12">
      <div className="bg-white dark:bg-slate-800 p-6 lg:p-8 rounded-[2rem] shadow-premium border border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-slide-up relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/team-details")}
            className="p-3 bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light rounded-2xl shadow-sm hover:shadow-md transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Add Team Member</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-semibold text-sm">Add an existing employee or create a new one.</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 lg:p-8 rounded-[2rem] shadow-premium border border-slate-100 dark:border-slate-700/50 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        
        <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900 rounded-[1.25rem] mb-8">
          <button
            onClick={() => setActiveTab("existing")}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[1rem] font-bold text-sm transition-all duration-300 ${
              activeTab === "existing" 
                ? "bg-white dark:bg-slate-800 text-primary shadow-sm" 
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
            }`}
          >
            <Users size={18} /> Existing Employee
          </button>
          <button
            onClick={() => setActiveTab("new")}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[1rem] font-bold text-sm transition-all duration-300 ${
              activeTab === "new" 
                ? "bg-white dark:bg-slate-800 text-primary shadow-sm" 
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
            }`}
          >
            <PlusCircle size={18} /> Add New Employee
          </button>
        </div>

        {activeTab === "existing" && (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={memberSearchQuery}
                onChange={(e) => setMemberSearchQuery(e.target.value)}
                className="w-full pl-11 pr-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
              {searchFilteredEmployees.map(emp => (
                <div key={emp.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-primary transition-colors bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold overflow-hidden">
                      {emp.avatar ? <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover" /> : emp.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{emp.name}</h4>
                      <p className="text-xs font-semibold text-slate-500">{emp.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddExistingMember(emp)}
                    className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl transition-colors"
                  >
                    <PlusCircle size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "new" && (
          <form onSubmit={handleCreateAndAddMember} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 flex flex-col items-center gap-4 border-r border-slate-100 dark:border-slate-800 pr-0 md:pr-6">
                <div className="relative group w-32 h-32 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900/50 hover:border-primary transition-all">
                  {newMemberAvatar ? (
                    <img src={newMemberAvatar} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User size={32} className="text-slate-400 group-hover:text-primary transition-colors" />
                  )}
                  <input type="file" accept="image/*" onChange={handleNewMemberPhotoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Profile Photo</span>
                  <span className="text-xs text-slate-400 font-medium">Click to upload image</span>
                </div>
              </div>
              <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
                  <input type="text" required value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address *</label>
                  <input type="email" required value={newMemberEmail} onChange={(e) => setNewMemberEmail(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Mobile Number *</label>
                  <input type="text" required value={newMemberMobileNumber} onChange={(e) => setNewMemberMobileNumber(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Aadhar Number *</label>
                  <input type="text" required value={newMemberAadharNumber} onChange={(e) => setNewMemberAadharNumber(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Role</label>
                  <select value={newMemberRole} onChange={(e) => setNewMemberRole(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white appearance-none cursor-pointer">
                    <option value="">Select Role...</option>
                    {masterRoles.map(role => <option key={role.id} value={role.name}>{role.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Location</label>
                  <select value={newMemberPlace} onChange={(e) => setNewMemberPlace(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white appearance-none cursor-pointer">
                    <option value="">Select Location...</option>
                    {masterLocations.map(loc => <option key={loc.id} value={loc.name}>{loc.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Biometric ID (Optional)</label>
                  <input type="text" value={newMemberBioId} onChange={(e) => setNewMemberBioId(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white" />
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button type="submit" className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm shadow-glow transition-all flex items-center gap-2">
                <UserPlus size={16} /> Create & Add to Team
              </button>
            </div>
          </form>
        )}
      </div>

      {showToast && (
        <div className="fixed bottom-8 right-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-2xl shadow-premium flex items-center gap-3 border border-slate-800 dark:border-slate-100 z-50 animate-slide-up">
          <div className="bg-emerald-500/20 p-1.5 rounded-full">
            <CheckCircle2 size={20} className="text-emerald-500" />
          </div>
          <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
