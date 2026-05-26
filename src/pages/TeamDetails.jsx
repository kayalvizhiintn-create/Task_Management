import React, { useState, useEffect } from "react";
import { taskService } from "../services/taskService";
import { 
  Check,
  Users, 
  User, 
  Briefcase, 
  Calendar, 
  Folder, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  ChevronRight, 
  X, 
  AlertCircle, 
  PlusCircle, 
  UserPlus, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  ClipboardList,
  Upload,
  Camera,
  Search,
  Mail,
  MapPin,
  Phone,
  CreditCard,
  UserCheck
} from "lucide-react";
import { Link } from "react-router-dom";

const DEFAULT_TEAMS = [
  {
    id: "team-1",
    name: "Creative & Brand Operations",
    description: "Responsible for brand guidelines, marketing campaigns, and visual identity updates.",
    leadId: "emp-1", // Emma Thompson
    memberIds: ["emp-3", "emp-5"], // Priya Patel, Sofia Rodriguez
    categories: ["Branding Identity", "Marketing", "Legal", "HR"]
  },
  {
    id: "team-2",
    name: "Systems Engineering & Quality Assurance",
    description: "Focuses on building reliable web services, performance optimization, and automated testing.",
    leadId: "emp-2", // Michael Chen
    memberIds: ["emp-4"], // James Wilson
    categories: ["Engineering", "Finance"]
  }
];

export default function TeamDetails() {
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  
  // Modal states
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Add Member Modal & Form states
  const [activeMemberTab, setActiveMemberTab] = useState("existing");
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");
  const [newMemberPlace, setNewMemberPlace] = useState("");
  const [newMemberBioId, setNewMemberBioId] = useState("");
  const [newMemberMobileNumber, setNewMemberMobileNumber] = useState("");
  const [newMemberAadharNumber, setNewMemberAadharNumber] = useState("");
  const [newMemberAvatar, setNewMemberAvatar] = useState("");

  const [masterRoles, setMasterRoles] = useState([]);
  const [masterLocations, setMasterLocations] = useState([]);

  // Create Team form state
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [teamLeadId, setTeamLeadId] = useState("");
  const [teamMemberIds, setTeamMemberIds] = useState([]);
  const [teamCategories, setTeamCategories] = useState([]);
  const [editingTeamId, setEditingTeamId] = useState(null);

  // Create Task form state
  const [taskName, setTaskName] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [taskAssigneeId, setTaskAssigneeId] = useState("");
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  // Initialize and load data
  useEffect(() => {
    // Seed default teams if none exist
    const storedTeams = localStorage.getItem("navanala_teams");
    if (!storedTeams) {
      localStorage.setItem("navanala_teams", JSON.stringify(DEFAULT_TEAMS));
      setTeams(DEFAULT_TEAMS);
      if (DEFAULT_TEAMS.length > 0) {
        setSelectedTeamId(DEFAULT_TEAMS[0].id);
      }
    } else {
      const parsed = JSON.parse(storedTeams);
      setTeams(parsed);
      if (parsed.length > 0) {
        setSelectedTeamId(parsed[0].id);
      }
    }

    setEmployees(taskService.getEmployees());
    setCategories(taskService.getCategories());
    setTasks(taskService.getTasks());
    setMasterRoles(taskService.getMasterRoles());
    setMasterLocations(taskService.getMasterLocations());
  }, []);

  // Reload local tasks and employees when state updates
  const refreshData = () => {
    setTasks(taskService.getTasks());
    setEmployees(taskService.getEmployees());
    setCategories(taskService.getCategories());
    setMasterRoles(taskService.getMasterRoles());
    setMasterLocations(taskService.getMasterLocations());
    const storedTeams = localStorage.getItem("navanala_teams");
    if (storedTeams) {
      setTeams(JSON.parse(storedTeams));
    }
  };

  // Find active team details
  const activeTeam = teams.find(t => t.id === selectedTeamId) || null;
  const teamLead = activeTeam ? employees.find(e => e.id === activeTeam.leadId) : null;
  const teamMembers = activeTeam ? employees.filter(e => activeTeam.memberIds.includes(e.id)) : [];

  // Filter tasks that belong to active team's categories
  const teamTasks = activeTeam 
    ? tasks.filter(t => activeTeam.categories.includes(t.category)) 
    : [];

  // Task statistics under the active team
  const totalTasksCount = teamTasks.length;
  const completedTasksCount = teamTasks.filter(t => t.status === "Completed").length;
  const inProgressTasksCount = teamTasks.filter(t => t.status === "In Progress").length;
  const pendingTasksCount = teamTasks.filter(t => t.status === "Pending").length;
  const holdTasksCount = teamTasks.filter(t => t.status === "Hold").length;
  
  const completionRate = totalTasksCount 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 0;

  // Handle task reassignment
  const handleReassignTask = (taskId, newAssigneeId) => {
    taskService.updateTask(taskId, { assigneeId: newAssigneeId });
    refreshData();
    triggerToast("Task reassigned successfully!");
  };

  // Trigger popup alerts
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Create or update Team
  const handleSaveTeam = (e) => {
    e.preventDefault();
    if (!teamName.trim() || !teamLeadId) {
      alert("Team Name and Team Lead are required.");
      return;
    }

    let updatedTeams = [...teams];
    if (editingTeamId) {
      // Edit mode
      updatedTeams = updatedTeams.map(t => {
        if (t.id === editingTeamId) {
          return {
            ...t,
            name: teamName,
            description: teamDescription,
            leadId: teamLeadId,
            memberIds: teamMemberIds,
            categories: teamCategories
          };
        }
        return t;
      });
      triggerToast(`Team "${teamName}" updated successfully!`);
    } else {
      // Create mode
      const newTeam = {
        id: `team-${Date.now()}`,
        name: teamName,
        description: teamDescription,
        leadId: teamLeadId,
        memberIds: teamMemberIds,
        categories: teamCategories
      };
      updatedTeams.push(newTeam);
      setSelectedTeamId(newTeam.id);
      triggerToast(`Team "${teamName}" created successfully!`);
    }

    localStorage.setItem("navanala_teams", JSON.stringify(updatedTeams));
    setTeams(updatedTeams);
    closeTeamModal();
  };

  // Delete Team
  const handleDeleteTeam = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the team "${name}"?`)) {
      const updated = teams.filter(t => t.id !== id);
      localStorage.setItem("navanala_teams", JSON.stringify(updated));
      setTeams(updated);
      triggerToast(`Team "${name}" has been deleted.`);
      if (updated.length > 0) {
        setSelectedTeamId(updated[0].id);
      } else {
        setSelectedTeamId("");
      }
    }
  };

  const openEditTeamModal = (team) => {
    setEditingTeamId(team.id);
    setTeamName(team.name);
    setTeamDescription(team.description || "");
    setTeamLeadId(team.leadId);
    setTeamMemberIds(team.memberIds || []);
    setTeamCategories(team.categories || []);
    setIsTeamModalOpen(true);
  };

  const closeTeamModal = () => {
    setIsTeamModalOpen(false);
    setEditingTeamId(null);
    setTeamName("");
    setTeamDescription("");
    setTeamLeadId("");
    setTeamMemberIds([]);
    setTeamCategories([]);
  };

  // Toggle member inclusion in checklist
  const handleToggleMember = (empId) => {
    if (teamMemberIds.includes(empId)) {
      setTeamMemberIds(teamMemberIds.filter(id => id !== empId));
    } else {
      setTeamMemberIds([...teamMemberIds, empId]);
    }
  };

  // Toggle category inclusion in checklist
  const handleToggleCategory = (catName) => {
    if (teamCategories.includes(catName)) {
      setTeamCategories(teamCategories.filter(c => c !== catName));
    } else {
      setTeamCategories([...teamCategories, catName]);
    }
  };

  // Handle task creation
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskName.trim() || !taskCategory || !taskAssigneeId || !taskDueDate) {
      alert("All fields are required.");
      return;
    }

    taskService.createTask({
      name: taskName,
      category: taskCategory,
      assigneeId: taskAssigneeId,
      priority: taskPriority,
      dueDate: taskDueDate,
      description: taskDescription,
      status: "Pending"
    });

    // Reset task form
    setTaskName("");
    setTaskCategory("");
    setTaskAssigneeId("");
    setTaskPriority("Medium");
    setTaskDueDate("");
    setTaskDescription("");
    setIsTaskModalOpen(false);

    refreshData();
    triggerToast("Task created and assigned successfully!");
  };

  // Handle adding an existing employee to the team
  const handleAddExistingMember = (empId, empName) => {
    if (!activeTeam) return;
    
    let updatedTeams = [...teams];
    updatedTeams = updatedTeams.map(t => {
      if (t.id === activeTeam.id) {
        const memberIds = [...(t.memberIds || [])];
        if (!memberIds.includes(empId)) {
          memberIds.push(empId);
        }
        return { ...t, memberIds };
      }
      return t;
    });

    localStorage.setItem("navanala_teams", JSON.stringify(updatedTeams));
    setTeams(updatedTeams);
    refreshData();
    triggerToast(`"${empName}" added to team successfully!`);
  };

  // Handle removing a member from the team
  const handleRemoveMember = (empId, empName) => {
    if (!activeTeam) return;
    
    if (window.confirm(`Are you sure you want to remove ${empName} from this team?`)) {
      let updatedTeams = [...teams];
      updatedTeams = updatedTeams.map(t => {
        if (t.id === activeTeam.id) {
          return {
            ...t,
            memberIds: (t.memberIds || []).filter(id => id !== empId)
          };
        }
        return t;
      });

      localStorage.setItem("navanala_teams", JSON.stringify(updatedTeams));
      setTeams(updatedTeams);
      refreshData();
      triggerToast(`"${empName}" has been removed from the team.`);
    }
  };

  // Handle creating a new employee and adding to the team
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

    // Add employee to DB
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

    // Add to current team
    let updatedTeams = [...teams];
    updatedTeams = updatedTeams.map(t => {
      if (t.id === activeTeam.id) {
        const memberIds = [...(t.memberIds || [])];
        if (!memberIds.includes(newEmp.id)) {
          memberIds.push(newEmp.id);
        }
        return { ...t, memberIds };
      }
      return t;
    });

    localStorage.setItem("navanala_teams", JSON.stringify(updatedTeams));
    setTeams(updatedTeams);

    // Clear form state
    setNewMemberName("");
    setNewMemberEmail("");
    setNewMemberRole("");
    setNewMemberPlace("");
    setNewMemberBioId("");
    setNewMemberMobileNumber("");
    setNewMemberAadharNumber("");
    setNewMemberAvatar("");
    setIsAddMemberModalOpen(false);

    refreshData();
    triggerToast(`Employee "${newEmp.name}" created and added to team!`);
  };

  // Handle new member photo upload
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

  // Color mapper for department headers
  const getGradientForIndex = (index) => {
    const gradients = [
      "from-blue-500 to-indigo-500",
      "from-emerald-500 to-teal-500",
      "from-violet-500 to-fuchsia-500",
      "from-amber-500 to-orange-500",
      "from-cyan-500 to-blue-600",
      "from-rose-500 to-pink-500"
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 max-w-[1600px] mx-auto animate-fade-in relative min-h-screen z-0 overflow-hidden">
      {/* Visual background accents */}
      <div className="fixed top-0 right-0 w-full h-full overflow-hidden -z-10 pointer-events-none" />
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-8 right-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-2xl shadow-premium flex items-center gap-3 border border-slate-800 dark:border-slate-100 z-50 animate-slide-up">
          <div className="bg-emerald-500/20 p-1.5 rounded-full">
            <CheckCircle2 size={20} className="text-emerald-500" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Success</h4>
            <p className="text-xs text-slate-350 dark:text-slate-650 font-semibold">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Page Header with Team Switcher */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 lg:gap-6 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-5 md:p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] shadow-premium relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative z-10 space-y-1.5">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Users size={32} className="text-primary" />
            Team Operations Hub
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm max-w-lg leading-relaxed">
            Monitor organizational structures, assign department categories to leads, and delegate tasks to team members.
          </p>
        </div>

        {/* Team Selectors & Operations */}
        <div className="relative z-10 flex flex-col xl:flex-row gap-3 items-center w-full lg:w-auto mt-4 md:mt-0">
          {teams.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* By Team */}
              <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-2xl w-full sm:w-44">
                <Users size={16} className="text-slate-400 shrink-0" />
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="text-sm font-extrabold text-slate-800 dark:text-white bg-transparent border-none p-0 focus:ring-0 cursor-pointer w-full focus:outline-none truncate"
                >
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* By Team Lead */}
              <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-2xl w-full sm:w-44">
                <UserCheck size={16} className="text-slate-400 shrink-0" />
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="text-sm font-extrabold text-slate-800 dark:text-white bg-transparent border-none p-0 focus:ring-0 cursor-pointer w-full focus:outline-none truncate"
                >
                  <option value="" disabled>Select Lead</option>
                  {teams.map(t => {
                    const lead = employees.find(e => e.id === t.leadId);
                    return (
                      <option key={`lead-${t.id}`} value={t.id}>
                        {lead ? lead.name : "No Lead"}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* By Project */}
              <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-2xl w-full sm:w-44">
                <Briefcase size={16} className="text-slate-400 shrink-0" />
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="text-sm font-extrabold text-slate-800 dark:text-white bg-transparent border-none p-0 focus:ring-0 cursor-pointer w-full focus:outline-none truncate"
                >
                  <option value="" disabled>Select Project</option>
                  {teams.flatMap(t => t.categories.map(cat => (
                    <option key={`proj-${t.id}-${cat}`} value={t.id}>{cat}</option>
                  )))}
                </select>
              </div>
            </div>
          )}
          <button 
            onClick={() => setIsTeamModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-3.5 rounded-2xl font-bold text-sm shadow-glow hover:scale-[1.02] transition-all duration-200 w-full sm:w-auto shrink-0"
          >
            <Plus size={16} />
            Create Team
          </button>
        </div>
      </div>

      {activeTeam ? (
        <>
          {/* Active Team Visual Overview Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-[1.5rem] lg:rounded-[2.5rem] p-5 sm:p-6 lg:p-10 shadow-2xl relative overflow-hidden">
            {/* Ambient gradients */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

            <div className="relative z-10 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <span className="bg-primary/20 text-primary-light border border-primary/30 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase">
                    ACTIVE WORKSPACE
                  </span>
                  <h3 className="text-3xl font-black tracking-tight mt-2 text-white">{activeTeam.name}</h3>
                  <p className="text-slate-400 text-sm font-medium mt-2 max-w-xl leading-relaxed">
                    {activeTeam.description || "Core collaborative division managing tasks, operational strategies, and targets."}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditTeamModal(activeTeam)}
                    className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:text-primary-light rounded-xl font-bold text-sm transition-all"
                    title="Edit Team Structure"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(activeTeam.id, activeTeam.name)}
                    className="p-3 bg-white/5 hover:bg-rose-500/10 border border-white/10 text-white hover:text-rose-400 rounded-xl font-bold text-sm transition-all"
                    title="Delete Team"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Roster profiles */}
              <div className="flex flex-wrap items-center gap-6">
                {/* Team Lead display */}
                {teamLead && (
                  <div className="flex items-center gap-3 bg-white/5 border border-white/15 px-4 py-2.5 rounded-2xl backdrop-blur-md">
                    <img src={teamLead.avatar} alt={teamLead.name} className="w-9 h-9 rounded-xl object-cover ring-2 ring-emerald-500/30" />
                    <div>
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">TEAM LEAD</span>
                      <span className="text-sm font-extrabold text-white block leading-tight">{teamLead.name}</span>
                    </div>
                  </div>
                )}

                {/* Team Members List */}
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Members:</span>
                  <div className="flex -space-x-3.5 overflow-hidden">
                    {teamMembers.map(member => (
                      <img
                        key={member.id}
                        src={member.avatar}
                        alt={member.name}
                        title={`${member.name} - ${member.role}`}
                        className="inline-block h-10 w-10 rounded-xl object-cover ring-2 ring-slate-900 bg-slate-800 transition-transform hover:scale-110 cursor-pointer"
                      />
                    ))}
                    {teamMembers.length === 0 && (
                      <span className="text-xs font-semibold text-slate-500 italic">No assigned members</span>
                    )}
                  </div>
                </div>

                {/* Categories badges */}
                <div className="flex flex-wrap items-center gap-2 ml-auto">
                  {activeTeam.categories.map((cat, idx) => (
                    <span key={cat} className="bg-white/5 border border-white/10 text-slate-300 px-3 py-1 rounded-xl text-xs font-bold">
                      {cat}
                    </span>
                  ))}
                  {activeTeam.categories.length === 0 && (
                    <span className="text-xs text-slate-500 italic">No project categories assigned</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 lg:p-6 rounded-[1.5rem] shadow-premium hover:-translate-y-1 transition-transform group flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">SLA Resolution Rate</p>
                <h4 className="text-2xl font-black text-slate-800 dark:text-white">{completionRate}%</h4>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-2xl"><TrendingUp size={18} /></div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-5 rounded-3xl shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Scope</p>
                <h4 className="text-2xl font-black text-slate-800 dark:text-white">{totalTasksCount} tasks</h4>
              </div>
              <div className="p-3 bg-primary/10 text-primary rounded-2xl"><ClipboardList size={18} /></div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-5 rounded-3xl shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">In Progress</p>
                <h4 className="text-2xl font-black text-amber-600">{inProgressTasksCount} tasks</h4>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-500/10 text-amber-600 rounded-2xl"><Clock size={18} /></div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-5 rounded-3xl shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Pending</p>
                <h4 className="text-2xl font-black text-rose-600">{pendingTasksCount} tasks</h4>
              </div>
              <div className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 rounded-2xl"><AlertCircle size={18} /></div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-5 rounded-3xl shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">On Hold</p>
                <h4 className="text-2xl font-black text-slate-500">{holdTasksCount} tasks</h4>
              </div>
              <div className="p-3 bg-slate-150 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 rounded-2xl"><CheckCircle2 size={18} /></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Team Lead Card Spotlight */}
            <div className="lg:col-span-1 space-y-8">
              {teamLead ? (
                <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-[2rem] p-6 md:p-8 shadow-premium flex flex-col items-center text-center relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-emerald-600 to-teal-600" />
                  
                  <div className="relative z-10 pt-8 flex flex-col items-center">
                    <img 
                      src={teamLead.avatar} 
                      alt={teamLead.name} 
                      className="w-32 h-40 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-800 shadow-lg bg-white mb-4 group-hover:scale-105 transition-transform" 
                    />
                    <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                      TEAM LEAD
                    </span>
                    <h4 className="text-xl font-extrabold text-slate-900 dark:text-white mt-3 leading-tight">{teamLead.name}</h4>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">{teamLead.role}</p>
                    <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">{teamLead.email}</p>
                  </div>

                  <div className="w-full pt-6 mt-6 border-t border-slate-100 dark:border-slate-700/50 space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-500">Active Responsibilities</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">{activeTeam.categories.length} Projects</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-500">Overall Team Load</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">{totalTasksCount} Active Tasks</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-500">Office Location</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">{teamLead.place || "Remote / Corporate Office"}</span>
                    </div>
                  </div>

                  <Link 
                    to={`/directory/${teamLead.id}`}
                    className="mt-6 flex items-center justify-center gap-1.5 w-full py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350 text-xs font-bold rounded-xl transition-all"
                  >
                    <span>View Professional Profile</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-[2rem] p-8 text-center text-slate-400 font-semibold shadow-premium">
                  <User size={36} className="mx-auto mb-2 text-slate-300" />
                  <p>No Team Lead selected for this team.</p>
                </div>
              )}

              {/* Team Members Workload Roster moved to a separate section below */}
            </div>

            {/* Project Categories received list */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-[2.5rem] p-6 md:p-8 shadow-premium space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-lg">Assigned Project Categories</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">Departments managed under this team lead's command.</p>
                  </div>
                  <span className="text-[10px] font-black text-primary bg-primary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {activeTeam.categories.length} Areas
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {activeTeam.categories.map((catName, idx) => {
                    const catTasks = tasks.filter(t => t.category === catName);
                    const completed = catTasks.filter(t => t.status === "Completed").length;
                    const inProgress = catTasks.filter(t => t.status === "In Progress").length;
                    
                    const progress = catTasks.length 
                      ? Math.round((completed / catTasks.length) * 100) 
                      : 0;

                    const gradient = getGradientForIndex(idx);

                    return (
                      <div key={catName} className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200/70 dark:border-slate-700/50 rounded-3xl p-5 hover:shadow-md transition-all relative overflow-hidden flex flex-col h-full group">
                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient}`} />
                        
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                            <Folder size={16} />
                          </div>
                          <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase">
                            {catTasks.length} Scope items
                          </span>
                        </div>

                        <h5 className="font-extrabold text-slate-800 dark:text-white text-base truncate group-hover:text-primary transition-colors">{catName}</h5>
                        
                        <div className="mt-auto pt-6 space-y-3">
                          <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                            <span>Done: {completed}</span>
                            <span>Doing: {inProgress}</span>
                          </div>
                          
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-slate-500">Progress</span>
                              <span className="font-extrabold text-slate-900 dark:text-white">{progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className={`h-full bg-gradient-to-r ${gradient} transition-all duration-1000`} 
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {activeTeam.categories.length === 0 && (
                    <div className="col-span-2 py-16 text-center text-slate-400 font-semibold italic border border-dashed border-slate-200 rounded-3xl">
                      No project categories linked. Click Edit Team to assign categories.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Team Members Grid Dashboard */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-[2.5rem] p-6 md:p-8 shadow-premium space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-xl">Team Members</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">Team personnel, project assignments and workload overview.</p>
              </div>
              <button
                onClick={() => {
                  setActiveMemberTab("existing");
                  setMemberSearchQuery("");
                  setIsAddMemberModalOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl font-extrabold text-sm shadow-glow hover:scale-[1.02] transition-all self-start sm:self-auto"
              >
                <Plus size={16} /> Add Member
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map(member => {
                const memberProjects = [...new Set(tasks.filter(t => t.assigneeId === member.id && activeTeam.categories.includes(t.category)).map(t => t.category))];
                
                return (
                  <div key={member.id} className="flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100/60 dark:hover:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50 rounded-[2rem] transition-all group/member relative">
                    <button
                      onClick={() => handleRemoveMember(member.id, member.name)}
                      title="Remove Member from Team"
                      className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 opacity-0 group-hover/member:opacity-100 transition-all z-10 bg-white dark:bg-slate-800 shadow-sm"
                    >
                      <Trash2 size={16} />
                    </button>

                    <img src={member.avatar} alt={member.name} className="w-32 h-40 rounded-[1.5rem] object-cover shadow-md ring-4 ring-white dark:ring-slate-800 bg-white mb-5 group-hover/member:scale-[1.02] transition-transform" />
                    
                    <h5 className="text-lg font-black text-slate-800 dark:text-white leading-tight">{member.name}</h5>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 block">{member.role}</span>
                    
                    <div className="w-full mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-700/60">
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-3">Assigned Projects</span>
                      {memberProjects.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-2">
                          {memberProjects.map((proj, idx) => (
                            <span key={idx} className="bg-primary/10 text-primary px-2.5 py-1 rounded-lg text-[10px] font-bold border border-primary/20">
                              {proj}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic font-medium">No projects assigned</span>
                      )}
                    </div>
                  </div>
                );
              })}
              {teamMembers.length === 0 && (
                <div className="col-span-full text-center py-16 text-slate-400 dark:text-slate-500 text-sm font-semibold italic border border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem]">
                  No members assigned to this team.
                </div>
              )}
            </div>
          </div>

          {/* Task Delegation Dashboard */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-[2.5rem] p-6 md:p-8 shadow-premium space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-lg">Task Delegation Matrix</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">Reassign projects or add new tasks directly under this team's scope.</p>
              </div>

              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-850 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-xl font-bold text-xs shadow-premium hover:scale-[1.02] transition-all self-start sm:self-auto"
              >
                <PlusCircle size={15} />
                Delegate New Task
              </button>
            </div>

            {teamTasks.length === 0 ? (
              <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-700/50 rounded-3xl p-16 text-center text-slate-400 font-semibold">
                <ClipboardList size={40} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                <p className="text-sm">No tasks found inside this team's project categories.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-250/60 dark:border-slate-700/60">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/70 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-wider border-b border-slate-150 dark:border-slate-700/60">
                      <th className="px-6 py-4">Task Name & Project</th>
                      <th className="px-6 py-4">Current Delegated Assignee</th>
                      <th className="px-6 py-4">Priority</th>
                      <th className="px-6 py-4">Due Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-slate-700 dark:text-slate-350 text-xs font-semibold">
                    {teamTasks.map((task) => {
                      const assignee = employees.find(e => e.id === task.assigneeId);
                      
                      // Priority color codes
                      const getPriorityStyle = (priority) => {
                        switch (priority) {
                          case "High": return "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300";
                          case "Medium": return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";
                          default: return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300";
                        }
                      };

                      // Status color codes
                      const getStatusBadgeStyle = (status) => {
                        switch (status) {
                          case "Completed": return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50";
                          case "In Progress": return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50";
                          case "Pending": return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50";
                          default: return "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800";
                        }
                      };

                      return (
                        <tr key={task.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4.5 space-y-1">
                            <span className="font-extrabold text-slate-900 dark:text-white block text-sm leading-tight hover:text-primary cursor-pointer">
                              <Link to={`/task/${task.id}`}>{task.name}</Link>
                            </span>
                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-450 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider inline-block">
                              {task.category}
                            </span>
                          </td>
                          <td className="px-6 py-4.5">
                            {/* Delegate Selector Dropdown */}
                            <div className="flex items-center gap-2">
                              <img 
                                src={assignee ? assignee.avatar : "https://ui-avatars.com/api/?name=Unassigned"} 
                                alt={assignee ? assignee.name : "Unassigned"} 
                                className="w-8 h-8 rounded-lg object-cover bg-white shadow-sm ring-1 ring-slate-100 dark:ring-slate-800" 
                              />
                              <select
                                value={task.assigneeId || ""}
                                onChange={(e) => handleReassignTask(task.id, e.target.value)}
                                className="bg-transparent border-none p-0 text-xs font-bold text-slate-800 dark:text-white cursor-pointer focus:ring-0 focus:outline-none hover:underline"
                              >
                                <option value="" disabled>Select Assignee</option>
                                {/* Limit to team lead + team members */}
                                {teamLead && (
                                  <option key={teamLead.id} value={teamLead.id}>
                                    {teamLead.name} (Lead)
                                  </option>
                                )}
                                {teamMembers.map(member => (
                                  <option key={member.id} value={member.id}>
                                    {member.name}
                                  </option>
                                ))}
                                {/* Allow assigning to other company resources as fallback */}
                                <option disabled>──────────</option>
                                {employees
                                  .filter(e => e.id !== teamLead?.id && !activeTeam.memberIds.includes(e.id))
                                  .map(otherEmp => (
                                    <option key={otherEmp.id} value={otherEmp.id}>
                                      {otherEmp.name} (External)
                                    </option>
                                  ))}
                              </select>
                            </div>
                          </td>
                          <td className="px-6 py-4.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${getPriorityStyle(task.priority)}`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4.5 font-bold text-slate-500 dark:text-slate-400">
                            {task.dueDate}
                          </td>
                          <td className="px-6 py-4.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeStyle(task.status)}`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="px-6 py-4.5 text-right">
                            <Link 
                              to={`/task/${task.id}`}
                              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark transition-colors"
                            >
                              <span>Overview</span>
                              <ChevronRight size={14} />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-[2.5rem] p-16 text-center text-slate-400 font-semibold shadow-premium">
          <Users size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-700" />
          <h3 className="text-xl font-black text-slate-900 dark:text-white">No Teams Available</h3>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">
            Create a collaborative workgroup to unlock team assignment workflows.
          </p>
          <button 
            onClick={() => setIsTeamModalOpen(true)}
            className="mt-6 inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-xl font-bold text-sm shadow-glow transition-all"
          >
            <Plus size={16} /> Create Team
          </button>
        </div>
      )}

      {/* TEAM CREATION & EDIT MODAL */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] lg:rounded-[2.5rem] shadow-premium max-w-2xl w-full max-h-[95vh] overflow-y-auto p-4 sm:p-6 md:p-8 animate-slide-up">
            <div className="flex justify-between items-center mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-100 dark:border-slate-700/50">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <UserPlus className="text-primary" size={24} />
                  {editingTeamId ? "Edit Team Profile" : "Create Workspace Team"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">Define the name, lead representative, team members, and departments.</p>
              </div>
              <button 
                onClick={closeTeamModal}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTeam} className="space-y-4 sm:space-y-6 lg:space-y-8 mt-2">
              <div className="space-y-4 sm:space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Team Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest ml-1">Team Name *</label>
                    <input
                      type="text"
                      required
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="e.g. Creative & Product Suite"
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary text-slate-900 dark:text-white font-semibold transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* Team Lead */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest ml-1">Team Lead *</label>
                    <div className="relative">
                      <select
                        required
                        value={teamLeadId}
                        onChange={(e) => setTeamLeadId(e.target.value)}
                        className="w-full px-5 py-3.5 appearance-none bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary text-slate-900 dark:text-white font-semibold transition-all cursor-pointer"
                      >
                        <option value="" disabled>-- Assign Team Lead Representative --</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" size={16} />
                    </div>
                  </div>
                </div>

                {/* Team Description */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest ml-1">Short Description</label>
                  <textarea
                    value={teamDescription}
                    onChange={(e) => setTeamDescription(e.target.value)}
                    placeholder="Provide overview details of this team's corporate mission..."
                    rows={2}
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary text-slate-900 dark:text-white font-semibold transition-all resize-none placeholder:text-slate-400"
                  />
                </div>

                {/* Team Members Selection Grid */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Team Members Roster</label>
                    <span className="text-[10px] font-bold text-slate-400">{teamMemberIds.length} Selected</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-56 overflow-y-auto p-1 custom-scrollbar">
                    {employees.map(emp => {
                      const isSelected = teamMemberIds.includes(emp.id);
                      return (
                        <label 
                          key={emp.id} 
                          className={`relative cursor-pointer group flex flex-col items-center text-center p-4 rounded-[1.5rem] border-2 transition-all duration-200 ${
                            isSelected 
                              ? "bg-primary/5 border-primary shadow-glow shadow-primary/20" 
                              : "bg-white dark:bg-slate-800 border-slate-150 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleMember(emp.id)}
                            className="hidden"
                          />
                          
                          <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected ? "bg-primary border-primary scale-100" : "border-slate-200 dark:border-slate-600 scale-90 opacity-50 group-hover:opacity-100"
                          }`}>
                            {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                          </div>

                          <img src={emp.avatar} alt={emp.name} className={`w-14 h-14 rounded-2xl object-cover mb-3 transition-transform duration-300 ${isSelected ? "ring-4 ring-primary/20 scale-105" : "ring-1 ring-slate-200 dark:ring-slate-700 group-hover:scale-105"}`} />
                          
                          <span className={`text-sm font-black leading-tight transition-colors ${isSelected ? "text-primary dark:text-primary-light" : "text-slate-800 dark:text-white"}`}>{emp.name}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">{emp.role}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Project Categories Badges */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Project Categories</label>
                    <span className="text-[10px] font-bold text-slate-400">{teamCategories.length} Selected</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5 p-1">
                    {categories.map(cat => {
                      const isSelected = teamCategories.includes(cat.name);
                      return (
                        <label 
                          key={cat.id} 
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer select-none text-xs font-bold transition-all duration-200 ${
                            isSelected 
                              ? "bg-primary text-white border-primary shadow-glow shadow-primary/30 scale-105" 
                              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-900"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleCategory(cat.name)}
                            className="hidden"
                          />
                          {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                          <span className="truncate">{cat.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end items-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-700/50 mt-8">
                <button
                  type="button"
                  onClick={closeTeamModal}
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-2xl font-extrabold text-sm shadow-glow shadow-primary/30 hover:scale-[1.02] transition-all"
                >
                  {editingTeamId ? "Save Profile Changes" : "Assemble Team"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TASK DELEGATION INLINE MODAL */}
      {isTaskModalOpen && activeTeam && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2.5rem] shadow-premium max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 animate-slide-up">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/50">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <PlusCircle className="text-primary" size={24} />
                  Delegate Team Scope
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">Assign new operational projects to your roster.</p>
              </div>
              <button 
                onClick={() => setIsTaskModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-5">
              <div className="space-y-4">
                {/* Task Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 ml-1">Task Scope Title *</label>
                  <input
                    type="text"
                    required
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="e.g. Design Brand Identity System"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-semibold transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 ml-1">Project Category *</label>
                    <select
                      required
                      value={taskCategory}
                      onChange={(e) => setTaskCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-semibold transition-all cursor-pointer"
                    >
                      <option value="" disabled>-- Select Project --</option>
                      {activeTeam.categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Assignee */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 ml-1">Delegate Assignee *</label>
                    <select
                      required
                      value={taskAssigneeId}
                      onChange={(e) => setTaskAssigneeId(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-semibold transition-all cursor-pointer"
                    >
                      <option value="" disabled>-- Choose Roster Resource --</option>
                      {teamLead && (
                        <option value={teamLead.id}>{teamLead.name} (Team Lead)</option>
                      )}
                      {teamMembers.map(member => (
                        <option key={member.id} value={member.id}>{member.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Priority */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 ml-1">Priority Scale</label>
                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-semibold transition-all cursor-pointer"
                    >
                      <option value="High">High / Critical</option>
                      <option value="Medium">Medium / Standard</option>
                      <option value="Low">Low / Tactical</option>
                    </select>
                  </div>

                  {/* Due Date */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 ml-1">Due Date *</label>
                    <input
                      type="date"
                      required
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-semibold transition-all cursor-pointer"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 ml-1">Detailed Description</label>
                  <textarea
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Enter granular details and criteria of this project..."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-semibold transition-all resize-none"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-5 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl font-bold text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm shadow-glow transition-all"
                >
                  Delegate Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD MEMBER TO TEAM MODAL */}
      {isAddMemberModalOpen && activeTeam && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2.5rem] shadow-premium max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 animate-slide-up">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/50">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <UserPlus className="text-primary" size={24} />
                  Add Member to Team
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                  Select an existing employee or register a new one to join "{activeTeam.name}".
                </p>
              </div>
              <button 
                onClick={() => setIsAddMemberModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Glassmorphic Tab Selector */}
            <div className="flex border-b border-slate-150 dark:border-slate-700/50 mb-6 gap-2">
              <button
                type="button"
                onClick={() => setActiveMemberTab("existing")}
                className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
                  activeMemberTab === "existing"
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                }`}
              >
                <UserCheck size={16} />
                Add Existing Employee
              </button>
              <button
                type="button"
                onClick={() => setActiveMemberTab("new")}
                className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
                  activeMemberTab === "new"
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                }`}
              >
                <PlusCircle size={16} />
                Create & Add New Employee
              </button>
            </div>

            {activeMemberTab === "existing" ? (
              <div className="space-y-4">
                {/* Search existing directory */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search employees by name, role, email..." 
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                    className="pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 w-full text-slate-900 dark:text-white font-semibold transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto pr-1">
                  {employees
                    .filter(emp => {
                      // Filter: exclude lead and current members
                      const isNotAlreadyInTeam = emp.id !== activeTeam.leadId && !(activeTeam.memberIds || []).includes(emp.id);
                      const matchesSearch = emp.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) || 
                                            (emp.role && emp.role.toLowerCase().includes(memberSearchQuery.toLowerCase())) ||
                                            (emp.email && emp.email.toLowerCase().includes(memberSearchQuery.toLowerCase()));
                      return isNotAlreadyInTeam && matchesSearch;
                    })
                    .map(emp => (
                      <div 
                        key={emp.id} 
                        className="p-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700/60 rounded-2xl flex flex-col justify-between hover:shadow-md hover:border-primary/45 dark:hover:border-primary/40 transition-all group"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <img src={emp.avatar} alt={emp.name} className="w-11 h-11 rounded-xl object-cover ring-2 ring-white dark:ring-slate-800 shadow-sm bg-white" />
                            <div>
                              <h5 className="text-sm font-extrabold text-slate-800 dark:text-white leading-tight">{emp.name}</h5>
                              <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 block">{emp.role}</span>
                            </div>
                          </div>

                          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-left">
                            {emp.email && (
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-semibold truncate">
                                <Mail size={12} className="shrink-0 text-slate-400" />
                                <span className="truncate">{emp.email}</span>
                              </div>
                            )}
                            {emp.place && (
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                                <MapPin size={12} className="shrink-0 text-slate-400" />
                                <span>{emp.place}</span>
                              </div>
                            )}
                            {emp.bioId && (
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                                <CreditCard size={12} className="shrink-0 text-slate-400" />
                                <span>ID: {emp.bioId}</span>
                              </div>
                            )}
                            {emp.mobileNumber && (
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                                <Phone size={12} className="shrink-0 text-slate-400" />
                                <span>{emp.mobileNumber}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleAddExistingMember(emp.id, emp.name)}
                          className="mt-4 flex items-center justify-center gap-1.5 w-full py-2 bg-slate-900 hover:bg-slate-850 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl shadow-premium transition-all hover:scale-[1.02]"
                        >
                          <Plus size={13} />
                          <span>Add to Team</span>
                        </button>
                      </div>
                    ))}

                  {employees.filter(emp => {
                    const isNotAlreadyInTeam = emp.id !== activeTeam.leadId && !(activeTeam.memberIds || []).includes(emp.id);
                    const matchesSearch = emp.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) || 
                                          (emp.role && emp.role.toLowerCase().includes(memberSearchQuery.toLowerCase())) ||
                                          (emp.email && emp.email.toLowerCase().includes(memberSearchQuery.toLowerCase()));
                    return isNotAlreadyInTeam && matchesSearch;
                  }).length === 0 && (
                    <div className="col-span-2 py-12 text-center text-slate-400 font-semibold italic">
                      No matching employees found in the directory.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateAndAddMember} className="space-y-5 text-left">
                {/* Photo Upload Section */}
                <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-3xl border border-slate-150 dark:border-slate-700/30">
                  <div 
                    className="relative group cursor-pointer shrink-0"
                    onClick={() => {
                      const input = document.getElementById("new-member-file-input");
                      if (input) input.click();
                    }}
                  >
                    <div className="w-18 h-18 rounded-2xl overflow-hidden ring-4 ring-white dark:ring-slate-800 shadow-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      {newMemberAvatar ? (
                        <img src={newMemberAvatar} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Camera size={22} className="text-slate-400" />
                      )}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-2xl">
                      <Camera size={16} className="text-white" />
                    </div>
                    <input 
                      id="new-member-file-input"
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleNewMemberPhotoUpload} 
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">Profile Photo</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium leading-relaxed">
                      Upload a profile picture or leave blank to auto-generate a sleek avatar.
                    </p>
                    <button 
                      type="button"
                      onClick={() => {
                        const input = document.getElementById("new-member-file-input");
                        if (input) input.click();
                      }}
                      className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] font-black text-primary hover:text-primary-dark transition-colors"
                    >
                      <Upload size={12} /> Select Image
                    </button>
                  </div>
                </div>

                {/* Form fields identical to EmployeeDirectory */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-355 ml-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      placeholder="e.g. Rachel Green"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white font-semibold transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-355 ml-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      placeholder="e.g. rachel@company.com"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white font-semibold transition-all"
                    />
                  </div>

                  {/* Role */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 ml-1">Role / Job Title</label>
                    <select
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-semibold transition-all appearance-none"
                    >
                      <option value="" disabled>Select Role</option>
                      {masterRoles.map(r => (
                        <option key={r.id} value={r.name}>{r.name}</option>
                      ))}
                      {newMemberRole && !masterRoles.find(r => r.name === newMemberRole) && (
                        <option value={newMemberRole}>{newMemberRole}</option>
                      )}
                    </select>
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 ml-1">Place / Location</label>
                    <select
                      value={newMemberPlace}
                      onChange={(e) => setNewMemberPlace(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-semibold transition-all appearance-none"
                    >
                      <option value="" disabled>Select Location</option>
                      {masterLocations.map(l => (
                        <option key={l.id} value={l.name}>{l.name}</option>
                      ))}
                      {newMemberPlace && !masterLocations.find(l => l.name === newMemberPlace) && (
                        <option value={newMemberPlace}>{newMemberPlace}</option>
                      )}
                    </select>
                  </div>

                  {/* Bio ID */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-355 ml-1">Bio ID / Employee ID</label>
                    <input
                      type="text"
                      value={newMemberBioId}
                      onChange={(e) => setNewMemberBioId(e.target.value)}
                      placeholder="e.g. BIO-34984"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white font-semibold transition-all"
                    />
                  </div>

                  {/* Mobile */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-355 ml-1">Mobile Number</label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      value={newMemberMobileNumber}
                      onChange={(e) => setNewMemberMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="e.g. 9876543210"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-semibold transition-all"
                    />
                  </div>

                  {/* Aadhar */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-355 ml-1">Aadhar Number</label>
                    <input
                      type="text"
                      value={newMemberAadharNumber}
                      onChange={(e) => setNewMemberAadharNumber(e.target.value)}
                      placeholder="XXXX-XXXX-XXXX"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white font-semibold transition-all"
                    />
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex justify-end items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                  <button
                    type="button"
                    onClick={() => setIsAddMemberModalOpen(false)}
                    className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl font-bold text-xs transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-xs shadow-glow transition-all"
                  >
                    Create & Add to Team
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
