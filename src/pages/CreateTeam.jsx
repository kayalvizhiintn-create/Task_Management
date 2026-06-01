import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Save, Info, Users, Shield, Hash } from "lucide-react";
import { taskService } from "../services/taskService";

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
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setEmployees(taskService.getEmployees() || []);
    setCategories(taskService.getCategories() || []);
    setProjects(taskService.getProjects() || []);
    setTasksMaster(taskService.getTaskMaster() || []);

    const fetchLatestData = async () => {
      const fetchedProjects = await taskService.fetchProjectsAsync();
      setProjects(fetchedProjects || []);

      const fetchedTasksMaster = await taskService.fetchTasksMasterAsync();
      setTasksMaster(fetchedTasksMaster || []);
    };
    fetchLatestData();

    if (id) {
      const storedTeams = localStorage.getItem("navanala_teams");
      if (storedTeams) {
        const parsed = JSON.parse(storedTeams);
        const team = parsed.find(t => t.id === id);
        if (team) {
          setTeamName(team.name || "");
          setTeamDescription(team.description || "");
          setTeamLeadId(team.leadId || "");
          setTeamMemberIds(team.memberIds || []);
          setTeamCategories(team.categories || []);
          setTeamProjectName(team.projectName || "");
          setTeamTaskName(team.taskName || "");
        }
      }
    }
    setLoading(false);
  }, [id]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!teamName.trim() || !teamLeadId || !teamProjectName || !teamTaskName) {
      alert("Team Name, Team Lead, Project Name, and Task Name are required.");
      return;
    }

    const storedTeams = localStorage.getItem("navanala_teams");
    let updatedTeams = storedTeams ? JSON.parse(storedTeams) : [];

    if (id) {
      updatedTeams = updatedTeams.map(t => {
        if (t.id === id) {
          return {
            ...t,
            name: teamName,
            description: teamDescription,
            leadId: teamLeadId,
            memberIds: teamMemberIds,
            categories: teamCategories,
            projectName: teamProjectName,
            taskName: teamTaskName
          };
        }
        return t;
      });
    } else {
      const newTeam = {
        id: `team-${Date.now()}`,
        name: teamName,
        description: teamDescription,
        leadId: teamLeadId,
        memberIds: teamMemberIds,
        categories: teamCategories,
        projectName: teamProjectName,
        taskName: teamTaskName
      };
      updatedTeams.push(newTeam);
    }

    // Auto-add new projects and tasks to Master if they don't exist yet
    const localProjects = taskService.getProjects();
    if (!localProjects.find(p => p.name.toLowerCase() === teamProjectName.trim().toLowerCase())) {
      taskService.addProject({ name: teamProjectName.trim(), description: "", environment: "Indoor", bioIds: [] });
    }
    const localTasks = taskService.getTaskMaster();
    if (!localTasks.find(t => t.name.toLowerCase() === teamTaskName.trim().toLowerCase())) {
      taskService.addTaskMaster(teamTaskName.trim());
    }

    localStorage.setItem("navanala_teams", JSON.stringify(updatedTeams));

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
                  placeholder="e.g. Frontend Engineering"
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white"
                />
              </div>

              {/* Project Name and Task Name Dropdowns */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Project Name *
                </label>
                <input
                  list="project-names"
                  required
                  value={teamProjectName}
                  onChange={(e) => {
                    setTeamProjectName(e.target.value);
                    setTeamTaskName(""); // reset task name when project changes
                  }}
                  placeholder="Select or type new project..."
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white"
                />
                <datalist id="project-names">
                  {Array.from(new Set([
                    ...projects.map(p => p.name),
                    ...taskService.getTasks().map(t => t.projectName).filter(Boolean)
                  ])).map(name => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
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
                  placeholder="Select or type new task..."
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <datalist id="task-names">
                  {Array.from(new Set([
                    ...tasksMaster.map(t => t.name),
                    ...taskService.getTasks().map(t => t.name).filter(Boolean)
                  ])).map(name => (
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
                  placeholder="Briefly describe what this team does..."
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
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                ))}
              </select>
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
                {employees.filter(emp => emp.id !== teamLeadId).map(emp => (
                  <label key={emp.id} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-500 transition-all">
                    <input
                      type="checkbox"
                      checked={teamMemberIds.includes(emp.id)}
                      onChange={() => handleMemberToggle(emp.id)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{emp.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{emp.role}</p>
                    </div>
                  </label>
                ))}
                {employees.filter(emp => emp.id !== teamLeadId).length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">No available employees to add.</p>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-black text-slate-800 dark:text-slate-200">
                <Hash size={20} className="text-blue-500" /> Focus Categories
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 max-h-64 overflow-y-auto custom-scrollbar space-y-2">
                {categories.map(cat => (
                  <label key={cat.id} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl cursor-pointer hover:border-blue-300 dark:hover:border-blue-500 transition-all">
                    <input
                      type="checkbox"
                      checked={teamCategories.includes(cat.name)}
                      onChange={() => handleCategoryToggle(cat.name)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{cat.name}</p>
                    </div>
                  </label>
                ))}
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
