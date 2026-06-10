import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Save, Info, Users, Shield, Hash, X } from "lucide-react";
import { taskService } from "../services/taskService";
import apiClient from "../services/apiClient";

export default function CreateTeam() {
  const navigate = useNavigate();
  const { id } = useParams(); // 'id' for edit

  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [teamLeadId, setTeamLeadId] = useState("");
  const [teamMemberIds, setTeamMemberIds] = useState([]);
  const [teamCategories, setTeamCategories] = useState([]);
  const [teamProjectName, setTeamProjectName] = useState("");
  const [teamTaskName, setTeamTaskName] = useState("");

  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasksMaster, setTasksMaster] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const fetchedEmployees = await taskService.getEmployees();
        setEmployees(Array.isArray(fetchedEmployees) ? fetchedEmployees : []);
      } catch (err) {
        console.error("Error fetching employees", err);
      }

      try {
        const fetchedCategories = await taskService.getCategories();
        setCategories(Array.isArray(fetchedCategories) ? fetchedCategories : []);
      } catch (err) {
        console.error("Error fetching categories", err);
      }

      try {
        const fetchedProjects = await taskService.getAllProjects();
        setProjects(Array.isArray(fetchedProjects) ? fetchedProjects : []);
      } catch (err) {
        console.error("Error fetching projects", err);
      }

      try {
        const fetchedTasksMaster = await taskService.getTaskMaster();
        setTasksMaster(Array.isArray(fetchedTasksMaster) ? fetchedTasksMaster : []);
      } catch (err) {
        console.error("Error fetching task master", err);
      }

      try {
        const fetchedTasks = await taskService.getTasks();
        setTasks(Array.isArray(fetchedTasks) ? fetchedTasks : []);
      } catch (err) {
        console.error("Error fetching tasks", err);
      }
    };
    fetchLatestData();

    if (id) {
      const fetchTeamDetails = async () => {
        try {
          const team = await taskService.getTeamById(id);
          if (team) {
            setTeamName(team.name || "");
            setTeamDescription(team.description || "");
            setTeamLeadId(team.leadId || "");
            setTeamMemberIds(team.memberIds || []);
            setTeamCategories(team.categories || []);
            setTeamProjectName(team.projectName || "");
            setTeamTaskName(team.taskName || "");
          }
        } catch (err) {
          console.error("Error fetching team", err);
        }
      };
      fetchTeamDetails();
    }
    setLoading(false);
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!teamName.trim() || !teamLeadId || !teamProjectName || !teamTaskName) {
      alert("Team Name, Team Lead, Project Name, and Task Name are required.");
      return;
    }

    // Auto-add new projects and tasks to Master if they don't exist yet
    if (!projects.find(p => p?.name?.toLowerCase() === teamProjectName.trim().toLowerCase())) {
      try {
        const shortCode = teamProjectName.substring(0, 3).toUpperCase();
        await apiClient.post('/api/v1/project/create-project', { 
          ProjectName: teamProjectName.trim(), 
          ProjectShortCode: shortCode 
        });
      } catch (err) {
        console.error("Error auto-creating project:", err);
      }
    }

    if (!tasksMaster.find(t => t?.name?.toLowerCase() === teamTaskName.trim().toLowerCase())) {
      try {
        await taskService.addTaskMaster(teamTaskName.trim());
      } catch (err) {
        console.error("Error auto-creating task master:", err);
      }
    }

    const payload = {
      name: teamName,
      description: teamDescription,
      leadId: parseInt(teamLeadId, 10),
      memberIds: teamMemberIds,
      categories: teamCategories,
      projectName: teamProjectName,
      taskName: teamTaskName
    };

    try {
      if (id) {
        payload.id = parseInt(id, 10);
        await taskService.updateTeam(payload);
      } else {
        await taskService.createTeam(payload);
      }
    } catch (err) {
      console.error("Error saving team", err);
      alert("Failed to save team");
      return;
    }

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate("/team-details");
    }, 1500);
  };

  const handleMemberToggle = (memberId) => {
    setTeamMemberIds(prev =>
      prev.includes(memberId)
        ? prev.filter(m => m !== memberId)
        : [...prev, memberId]
    );
  };

  const handleCategoryToggle = (catName) => {
    setTeamCategories(prev =>
      prev.includes(catName)
        ? prev.filter(c => c !== catName)
        : [...prev, catName]
    );
  };

  if (loading) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 lg:space-y-8 animate-fade-in pb-8 lg:pb-12">
      {/* Header */}
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
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {id ? "Edit Team" : "Create New Team"}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-semibold text-sm">
              Setup your team's structure and assign responsibilities.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 lg:p-8 rounded-[2rem] shadow-premium border border-slate-100 dark:border-slate-700/50 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <form onSubmit={handleSave} className="space-y-10">

          {/* Section 1: Basic Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-black text-slate-800 dark:text-slate-200">
              <Info size={20} className="text-primary" /> Core Details
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Team Name *
                </label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white"
                />
              </div>

              {/* Project Name and Task Name Dropdowns */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Project Name *
                </label>
                <select
                  required
                  value={teamProjectName}
                  onChange={(e) => {
                    setTeamProjectName(e.target.value);
                    setTeamTaskName(""); // reset task name when project changes
                  }}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select Project Name</option>
                  {Array.from(new Set([
                    ...projects.map(p => p?.name),
                    ...tasks.map(t => t?.projectName)
                  ].filter(Boolean))).map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Task Name *
                </label>
                <input
                  list="task-names"
                  required
                  value={teamTaskName}
                  onChange={(e) => setTeamTaskName(e.target.value)}
                  disabled={!teamProjectName}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <datalist id="task-names">
                  {Array.from(new Set(tasksMaster.map(t => t?.name))).map(name => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Team Description
                </label>
                <textarea
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  rows={3}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Leadership */}
          <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-lg font-black text-slate-800 dark:text-slate-200">
              <Shield size={20} className="text-emerald-500" /> Leadership
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Team Lead *</label>
              <select
                required
                value={teamLeadId}
                onChange={(e) => setTeamLeadId(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-900 dark:text-white appearance-none cursor-pointer"
              >
                <option value="">Select Team Lead...</option>
                {employees.map(emp => (
                  <option key={emp?.id} value={emp?.id}>{emp?.name} ({emp?.role})</option>
                ))}
              </select>
              {teamLeadId && (() => {
                const selectedLead = employees.find(emp => String(emp.id) === String(teamLeadId));
                if (!selectedLead) return null;
                const avatar = selectedLead.avatar || selectedLead.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedLead.name.charAt(0))}&background=random`;
                return (
                  <div className="mt-3 p-4 bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-500/30 rounded-xl flex items-center gap-4 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <img src={avatar} alt={selectedLead.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-100 dark:border-emerald-900" />
                    <div>
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-0.5">TEAM LEAD</p>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{selectedLead.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{selectedLead.role}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Section 3: Members & Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            {/* Members */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-black text-slate-800 dark:text-slate-200">
                <Users size={20} className="text-indigo-500" /> Members
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 max-h-64 overflow-y-auto custom-scrollbar space-y-2">
                {employees.filter(emp => emp?.id && emp.id !== teamLeadId && !teamMemberIds.includes(emp.id)).map(emp => {
                  const avatar = emp.avatar || emp.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name.charAt(0))}&background=random`;
                  return (
                    <div key={emp.id} onClick={() => handleMemberToggle(emp.id)} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-500 transition-all group">
                      <div className="flex items-center gap-3">
                        <img src={avatar} alt={emp.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{emp.name}</p>
                          <p className="text-xs text-slate-500 font-medium">{emp.role}</p>
                        </div>
                      </div>
                      <div className="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-indigo-500 transition-colors">
                        <div className="w-3 h-3 rounded-full bg-transparent group-hover:bg-indigo-500 transition-colors" />
                      </div>
                    </div>
                  );
                })}
                {employees.filter(emp => emp.id !== teamLeadId && !teamMemberIds.includes(emp.id)).length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">No available employees to add.</p>
                )}
              </div>
            </div>

            {/* Selected Members */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-black text-slate-800 dark:text-slate-200">
                <Users size={20} className="text-blue-500" /> Selected Members
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 max-h-64 overflow-y-auto custom-scrollbar space-y-2">
                {/* Show Team Lead */}
                {teamLeadId && employees.find(emp => String(emp.id) === String(teamLeadId)) && (() => {
                  const lead = employees.find(emp => String(emp.id) === String(teamLeadId));
                  const avatar = lead.avatar || lead.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(lead.name.charAt(0))}&background=random`;
                  return (
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <img src={avatar} alt={lead.name} className="w-8 h-8 rounded-full object-cover border border-emerald-200" />
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{lead.name}</p>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase">Team Lead</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Show Selected Members */}
                {teamMemberIds.map(memberId => {
                  const member = employees.find(emp => emp.id === memberId);
                  if (!member) return null;
                  const avatar = member.avatar || member.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name.charAt(0))}&background=random`;
                  return (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl group hover:border-red-200 transition-all">
                      <div className="flex items-center gap-3">
                        <img src={avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{member.name}</p>
                          <p className="text-[10px] font-bold text-indigo-500 uppercase">Team Member</p>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => handleMemberToggle(member.id)}
                        className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Remove member"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  );
                })}

                {!teamLeadId && teamMemberIds.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">No members selected yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/team-details")}
              className="px-6 py-3.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl font-bold text-sm transition-all shadow-sm w-full sm:w-auto text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold text-sm shadow-glow transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Save size={18} />
              Save Team
            </button>
          </div>
        </form>
      </div>

      {showToast && (
        <div className="fixed bottom-8 right-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-2xl shadow-premium flex items-center gap-3 border border-slate-800 dark:border-slate-100 z-50 animate-slide-up">
          <div className="bg-emerald-500/20 p-1.5 rounded-full">
            <CheckCircle2 size={20} className="text-emerald-500" />
          </div>
          <span className="text-sm font-bold tracking-wide">Team saved successfully!</span>
        </div>
      )}
    </div>
  );
}
