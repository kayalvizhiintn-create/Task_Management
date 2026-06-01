import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { taskService } from "../services/taskService";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  PlayCircle,
  ListTodo,
  TrendingUp,
  ChevronRight,
  User,
  Users,
  Calendar,
  ArrowUpRight,
  BarChart3,
  Wallet
} from "lucide-react";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [workloads, setWorkloads] = useState([]);
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentUser(taskService.getCurrentUser());
    setTasks(taskService.getTasks());
    setActivities(taskService.getActivities());
    setCategories(taskService.getCategories());
    setWorkloads(taskService.getEmployeeWorkload());
    
    // Load teams from localStorage or use defaults
    const storedTeams = localStorage.getItem("navanala_teams");
    if (storedTeams) {
      setTeams(JSON.parse(storedTeams));
    } else {
      setTeams([
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
      ]);
    }
  }, []);

  // Compute stat card figures
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => ["completed", "done"].includes((t.status || "").toLowerCase().trim())).length;
  const pendingCount = tasks.filter(t => ["pending", "task created"].includes((t.status || "").toLowerCase().trim())).length;
  const inProgressCount = tasks.filter(t => ["in progress", "inprogress", "active"].includes((t.status || "").toLowerCase().trim())).length;
  const testingCount = tasks.filter(t => ["testing", "review"].includes((t.status || "").toLowerCase().trim())).length;
  const highPriorityCount = tasks.filter(t => t.priority === "High").length;

  // Status Chart Percentages
  const completedPct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
  const inProgressPct = totalCount ? Math.round((inProgressCount / totalCount) * 100) : 0;
  const pendingPct = totalCount ? Math.round((pendingCount / totalCount) * 100) : 0;
  const testingPct = totalCount ? Math.round((testingCount / totalCount) * 100) : 0;

  // Deadlines filtering (Tasks that are due, sorted)
  const urgentTasks = [...tasks]
    .filter(t => t.status !== "Completed")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4);

  // SVG Chart Calculation
  const radius1 = 80;
  const circ1 = 2 * Math.PI * radius1;
  const strokeCompleted = circ1 - (completedPct / 100) * circ1;

  const radius2 = radius1 - 16;
  const circ2 = 2 * Math.PI * radius2;
  const strokeInProgress = circ2 - (inProgressPct / 100) * circ2;

  const radius3 = radius1 - 30;
  const circ3 = 2 * Math.PI * radius3;
  const strokePending = circ3 - (pendingPct / 100) * circ3;

  const categorySummary = tasks.reduce((acc, task) => {
    const category = task.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = { category, pending: 0, completed: 0, processing: 0, onhold: 0 };
    }
    const status = (task.status || "").toLowerCase().trim();
    if (["completed", "done"].includes(status)) {
      acc[category].completed++;
    } else if (["in progress", "inprogress", "active", "processing"].includes(status)) {
      acc[category].processing++;
    } else if (["on hold", "onhold", "testing", "review"].includes(status)) {
      acc[category].onhold++;
    } else {
      acc[category].pending++;
    }
    return acc;
  }, {});

  const categoryWorkloadArray = Object.values(categorySummary);

  // User Activity & Login Logs Data (Derived from Real Employees)
  const userActivityLogs = workloads.map((user, idx) => {
    // Generate deterministic stats to act as placeholder logs for real users
    const baseId = (user.id ? user.id.length : 5) + (user.name ? user.name.length : idx);
    const loginCount = (baseId * 7) % 60 + 12;

    // Calculate time based on their actual real tasks (e.g. 16h per completed task)
    const completedHours = (user.completedTasks || 0) * 16 + (baseId % 10) * 3 + 45;
    const minutes = (baseId * 13) % 60;
    const totalTime = `${completedHours}h ${minutes}m`;

    const statuses = ['online', 'away', 'offline'];
    const status = statuses[(baseId + idx) % 3];

    const times = ["Just now", "5m ago", "1h ago", "2h ago", "1d ago"];
    const lastActive = times[baseId % 5];

    return {
      name: user.name || user.displayName || "Unknown User",
      role: user.role || "Team Member",
      avatar: user.avatar,
      loginCount,
      totalTime,
      lastActive,
      status
    };
  });

  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase().replace(/\s+/g, "");
    switch (s) {
      case "completed": case "done": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "inprogress": case "active": return "bg-amber-100 text-amber-700 border-amber-200";
      case "testing": case "review": return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending": case "taskcreated": return "bg-rose-100 text-rose-700 border-rose-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8 max-w-[2560px] mx-auto animate-fade-in pb-10 2xl:px-8">



      {/* Top Statistics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-4">

        {/* Total Tasks */}
        <div onClick={() => navigate("/tasks")} className="cursor-pointer bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-900/40 p-4 rounded-2xl shadow-premium hover:shadow-floating transition-all duration-300 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Total</p>
            <ListTodo size={16} className="text-indigo-400" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">{totalCount}</h3>
        </div>

        {/* Completed Tasks */}
        <div onClick={() => navigate("/tasks?status=Completed")} className="cursor-pointer bg-gradient-to-br from-slate-900 to-emerald-950 border border-emerald-900/40 p-4 rounded-2xl shadow-premium hover:shadow-floating transition-all duration-300 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Completed</p>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">{completedCount}</h3>
        </div>

        {/* In Progress Tasks */}
        <div onClick={() => navigate("/tasks?status=In Progress")} className="cursor-pointer bg-gradient-to-br from-slate-900 to-amber-950 border border-amber-900/40 p-4 rounded-2xl shadow-premium hover:shadow-floating transition-all duration-300 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">In Progress</p>
            <PlayCircle size={16} className="text-amber-400" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">{inProgressCount}</h3>
        </div>

        {/* Testing Phase Tasks */}
        <div onClick={() => navigate("/tasks?status=Testing")} className="cursor-pointer bg-gradient-to-br from-slate-900 to-blue-950 border border-blue-900/40 p-4 rounded-2xl shadow-premium hover:shadow-floating transition-all duration-300 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Testing</p>
            <CheckCircle2 size={16} className="text-blue-400" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">{testingCount}</h3>
        </div>

        {/* Pending Tasks */}
        <div onClick={() => navigate("/tasks?status=Pending")} className="cursor-pointer bg-gradient-to-br from-slate-900 to-rose-950 border border-rose-900/40 p-4 rounded-2xl shadow-premium hover:shadow-floating transition-all duration-300 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Pending</p>
            <Clock size={16} className="text-rose-400" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">{pendingCount}</h3>
        </div>

        {/* High Priority Tasks */}
        <div onClick={() => navigate("/tasks?priority=High")} className="cursor-pointer bg-gradient-to-br from-slate-900 to-purple-950 border border-purple-900/40 p-4 rounded-2xl shadow-premium hover:shadow-floating transition-all duration-300 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">High Priority</p>
            <AlertTriangle size={16} className="text-purple-400" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">{highPriorityCount}</h3>
        </div>

      </div>

      {/* Bottom Section: Employee Workloads & (Recent Activity + Deadlines) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">

        {/* Category Workload Summary */}
        <div className="bg-white border border-slate-200/50 p-5 lg:p-8 rounded-[1.5rem] lg:rounded-3xl shadow-premium lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-extrabold text-slate-900 text-base">Category Workload Summary</h4>
              <Link to="/tasks" className="text-xs font-bold text-primary hover:text-primary-dark transition-all flex items-center gap-1">
                <span>All Categories</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="pb-3.5">Category Name</th>
                    <th className="pb-3.5 text-center">Pending</th>
                    <th className="pb-3.5 text-center">Processing</th>
                    <th className="pb-3.5 text-center">On Hold</th>
                    <th className="pb-3.5 text-center">Completed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-semibold">
                  {categoryWorkloadArray.map((cat, idx) => (
                    <tr key={idx} className="even:bg-sky-50/60 hover:bg-sky-100/60 transition-colors">
                      <td className="py-3.5">
                        <p className="font-bold text-slate-800">{cat.category}</p>
                      </td>
                      <td className="py-3.5 text-center text-rose-600 font-bold">{cat.pending}</td>
                      <td className="py-3.5 text-center text-amber-600 font-bold">{cat.processing}</td>
                      <td className="py-3.5 text-center text-slate-500 font-bold">{cat.onhold}</td>
                      <td className="py-3.5 text-center text-emerald-600 font-bold">{cat.completed}</td>
                    </tr>
                  ))}
                  {categoryWorkloadArray.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-400 font-medium text-sm">No categories available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Side Widget column (Deadlines & Activity Log) */}
        <div className="space-y-4 lg:space-y-6">

          {/* Upcoming Deadlines Widget */}
          <div className="bg-white border border-slate-200/50 p-5 lg:p-6 rounded-[1.5rem] lg:rounded-3xl shadow-premium">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-extrabold text-slate-900 text-sm">Urgent Deadlines</h4>
              <span className="text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                <Calendar size={10} /> Active Alerts
              </span>
            </div>

            <div className="space-y-3.5">
              {urgentTasks.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs">No urgent deadlines.</div>
              ) : (
                urgentTasks.map((task) => {
                  const today = new Date();
                  const due = new Date(task.dueDate);
                  const diffTime = due - today;
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                  let urgencyBg = "bg-slate-50 border-slate-100 text-slate-600";
                  if (diffDays <= 2) urgencyBg = "bg-rose-50 border-rose-100 text-rose-600";
                  else if (diffDays <= 5) urgencyBg = "bg-amber-50 border-amber-100 text-amber-600";

                  return (
                    <Link
                      key={task.id}
                      to={`/tasks`}
                      className={`block p-3.5 border rounded-2xl hover:border-primary/30 transition-all duration-200 ${urgencyBg}`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <span className="font-bold text-xs truncate max-w-[180px] text-slate-800">{task.name}</span>
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-inherit shrink-0">
                          {diffDays <= 0 ? "Overdue" : `${diffDays}d left`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2.5 text-[10px] font-semibold text-slate-400">
                        <span className="uppercase tracking-wider">{task.category}</span>
                        <span>Due: {task.dueDate}</span>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>



        </div>

      </div>

      {/* Middle Section: Task Analytics Charts & Category Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">

        {/* Team Projects Overview */}
        <div className="bg-white border border-slate-200/50 p-5 lg:p-8 rounded-[1.5rem] lg:rounded-3xl shadow-premium lg:col-span-3 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-extrabold text-slate-900 text-lg">Team Projects Overview</h4>
              <Link to="/teams" className="text-xs font-bold text-primary hover:text-primary-dark transition-all flex items-center gap-1">
                <span>View All Teams</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="pb-3.5">Team Name</th>
                    <th className="pb-3.5">Team Lead Name</th>
                    <th className="pb-3.5">Project Name</th>
                    <th className="pb-3.5">Team Members Name</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-semibold">
                  {teams.map((team, idx) => {
                    const lead = workloads.find(w => w.id === team.leadId) || { name: "Unassigned" };
                    const teamMembers = workloads.filter(w => (team.memberIds || []).includes(w.id));
                    
                    // Find a relevant project name based on team categories
                    const teamTasks = tasks.filter(t => (team.categories || []).includes(t.category));
                    const project = teamTasks.length > 0 ? teamTasks[0].name : (team.categories || []).join(", ") || "General Operations";

                    return (
                    <tr key={team.id || idx} className="even:bg-sky-50/60 hover:bg-sky-100/60 transition-colors">
                      <td className="py-4">
                        <p className="font-bold text-slate-800">{team.name}</p>
                      </td>
                      <td className="py-4">
                        <span className="bg-amber-50 text-amber-600 border border-amber-100 px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap">
                          {lead.name}
                        </span>
                      </td>
                      <td className="py-4">
                        <p className="text-slate-600 font-medium text-xs truncate max-w-[200px]" title={project}>{project}</p>
                      </td>
                      <td className="py-4 flex items-center gap-3">
                        <div className="flex -space-x-2 shrink-0">
                          {teamMembers.map((m, i) => (
                            <img 
                              key={m.id || i} 
                              src={m.avatar} 
                              title={m.name}
                              alt={m.name} 
                              className="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover hover:z-10 hover:scale-110 transition-transform" 
                            />
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-slate-700 whitespace-normal leading-relaxed" title={teamMembers.map(m => m.name).join(", ")}>
                          {teamMembers.map(m => m.name).join(", ")}
                          {teamMembers.length === 0 && <span className="text-slate-400 italic">No members</span>}
                        </span>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* NEW SECTION: Detailed Task Breakdown */}
      <div className="bg-white border border-slate-200/50 p-5 lg:p-8 rounded-[1.5rem] lg:rounded-3xl shadow-premium">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-extrabold text-slate-900 text-lg">Detailed Task Breakdown</h4>
          <Link to="/tasks" className="text-xs font-bold text-primary hover:text-primary-dark transition-all flex items-center gap-1">
            <span>View All Tasks</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="pb-3.5 pl-2">Task Description</th>
                <th className="pb-3.5">Category</th>
                <th className="pb-3.5">Entered By / Assigned To</th>
                <th className="pb-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {tasks.map((task) => {
                const assignee = workloads.find(e => e.id === task.assigneeId);
                return (
                  <tr key={task.id} className="even:bg-sky-50/60 hover:bg-sky-100/60 transition-colors">
                    <td className="py-4 pl-2">
                      <p className="font-bold text-slate-800">{task.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5 line-clamp-1">{task.description}</p>
                    </td>
                    <td className="py-4">
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">{task.category}</span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        {assignee ? (
                          <>
                            <img src={assignee.avatar} alt={assignee.name} className="w-7 h-7 rounded-full object-cover" />
                            <span className="font-semibold text-slate-700">{assignee.name}</span>
                          </>
                        ) : (
                          <span className="font-semibold text-slate-400 italic">Unassigned</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border ${getStatusBadge(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-400 font-medium text-sm">No tasks available to display.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
