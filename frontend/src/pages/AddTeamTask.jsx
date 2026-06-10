import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Save, Info } from "lucide-react";
import { taskService } from "../services/taskService";

export default function AddTeamTask() {
  const navigate = useNavigate();
  const { teamId } = useParams();

  const [taskName, setTaskName] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [taskAssigneeId, setTaskAssigneeId] = useState("");
  const [taskPriority, setTaskPriority] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const [employees, setEmployees] = useState([]);
  const [teamCategories, setTeamCategories] = useState([]);
  const [tasksMaster, setTasksMaster] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [zones, setZones] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [allEmp, tasksMasterData, priosData, deptsData, projsData, zonesData, statsData] = await Promise.all([
        taskService.getEmployees(),
        taskService.getTaskMaster(),
        taskService.getPriorities(),
        taskService.getDepartments(),
        taskService.getProjects(),
        taskService.getZoneMaster(),
        taskService.getStatuses()
      ]);

      try {
        const team = await taskService.getTeamById(teamId);
        if (team) {
          setTeamCategories(team.categories || []);

          // Only allow assignment to team members or team lead
          const teamEmp = (allEmp || []).filter(e => e.id === team.leadId || (team.memberIds && team.memberIds.includes(e.id)));
          setEmployees(teamEmp);
        }
      } catch (err) {
        console.error("Error fetching team", err);
      }
      
      setTasksMaster(tasksMasterData || []);
      setPriorities(priosData || []);
      if (priosData && priosData.length > 0) setTaskPriority(priosData[0].name);

      setDepartments(deptsData || []);
      setProjects(projsData || []);
      setZones(zonesData || []);
      setStatuses(statsData || []);
      
      setLoading(false);
    };
    
    loadData();
  }, [teamId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskName.trim() || !taskCategory || !taskAssigneeId || !taskDueDate) {
      alert("All required fields must be filled.");
      return;
    }

    const formData = new FormData();
    formData.append("TaskName", taskName);

    const dept = departments.find(d => d.name === taskCategory);
    if (dept) formData.append("DeptId", dept.id);

    const pri = priorities.find(p => p.name === taskPriority);
    if (pri) formData.append("PriorityId", pri.id);

    const stat = statuses.find(s => s.name.toLowerCase() === "pending" || s.name.toLowerCase() === "task create");
    if (stat) {
      formData.append("StatusId", stat.id);
    } else if (statuses.length > 0) {
      formData.append("StatusId", statuses[0].id);
    }

    formData.append("AssignedToBioId", taskAssigneeId);

    try {
      const currentUser = taskService.getCurrentUser ? await taskService.getCurrentUser() : null;
      if (currentUser && currentUser.id) {
        formData.append("AssignedByBioId", currentUser.id);
      } else {
        formData.append("AssignedByBioId", taskAssigneeId);
      }
    } catch (e) {
      formData.append("AssignedByBioId", taskAssigneeId);
    }

    formData.append("EndDate", taskDueDate);
    
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 16);
    formData.append("StartDate", localISOTime);

    let finalDescription = taskDescription || "";
    formData.append("DetailedDescription", finalDescription);

    if (projects.length > 0) formData.append("ProjectId", projects[0].id);
    if (zones.length > 0) formData.append("ZoneId", zones[0].id);

    try {
      await taskService.createTask(formData);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate("/team-details");
      }, 1500);
    } catch (error) {
      console.error(error);
      alert("Failed to create task");
    }
  };

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
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Create Team Task</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-semibold text-sm">Assign a new task to a team member</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 lg:p-8 rounded-[2rem] shadow-premium border border-slate-100 dark:border-slate-700/50 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <form onSubmit={handleCreateTask} className="space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-black text-slate-800 dark:text-slate-200">
              <Info size={20} className="text-primary" /> Task Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Task Name *</label>
                <select
                  required
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select Task Name...</option>
                  {tasksMaster.map(t => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                  {taskName && !tasksMaster.find(t => t.name === taskName) && <option value={taskName}>{taskName}</option>}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Category *</label>
                <select
                  required
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="">Select Category...</option>
                  {teamCategories.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Assign To *</label>
                <select
                  required
                  value={taskAssigneeId}
                  onChange={(e) => setTaskAssigneeId(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="">Select Team Member...</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Priority</label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white appearance-none cursor-pointer"
                >
                  {priorities.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                  {taskPriority && !priorities.find(p => p.name === taskPriority) && <option value={taskPriority}>{taskPriority}</option>}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Due Date *</label>
                <input
                  type="date"
                  required
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Task Description</label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  rows={4}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row justify-end gap-4">
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
              Assign Task
            </button>
          </div>
        </form>
      </div>

      {showToast && (
        <div className="fixed bottom-8 right-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-2xl shadow-premium flex items-center gap-3 border border-slate-800 dark:border-slate-100 z-50 animate-slide-up">
          <div className="bg-emerald-500/20 p-1.5 rounded-full">
            <CheckCircle2 size={20} className="text-emerald-500" />
          </div>
          <span className="text-sm font-bold tracking-wide">Task created successfully!</span>
        </div>
      )}
    </div>
  );
}
