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
  Calendar,
  ArrowUpRight,
  BarChart3
} from "lucide-react";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [workloads, setWorkloads] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentUser(taskService.getCurrentUser());
    setTasks(taskService.getTasks());
    setActivities(taskService.getActivities());
    setCategories(taskService.getCategories());
    setWorkloads(taskService.getEmployeeWorkload());
  }, []);

  // Compute stat card figures
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.status === "Completed").length;
  const pendingCount = tasks.filter(t => t.status === "Pending").length;
  const inProgressCount = tasks.filter(t => t.status === "In Progress").length;
  const highPriorityCount = tasks.filter(t => t.priority === "High").length;

  // Status Chart Percentages
  const completedPct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
  const inProgressPct = totalCount ? Math.round((inProgressCount / totalCount) * 100) : 0;
  const pendingPct = totalCount ? Math.round((pendingCount / totalCount) * 100) : 0;
  const holdPct = totalCount ? Math.round((tasks.filter(t => t.status === "Hold").length / totalCount) * 100) : 0;

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

  return (
    <div className="space-y-6 lg:space-y-8 max-w-[1600px] mx-auto animate-fade-in">

      {/* Top Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome, {currentUser ? currentUser.name : "User"}!
          </h2>
          <p className="text-slate-500 font-medium mt-1">Real-time enterprise operations and task orchestration metrics.</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/create-task"
            className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold shadow-glow hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <span>Create Task</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {/* Top Statistics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">

        {/* Total Tasks */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-900/40 p-4 lg:p-6 rounded-2xl lg:rounded-3xl shadow-premium hover:shadow-floating transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest">Total Tasks</p>
            <h3 className="text-3xl font-black text-white tracking-tight">{totalCount}</h3>
          </div>
          <div className="p-4 bg-indigo-400 text-indigo-950 rounded-2xl transition-all duration-300 group-hover:scale-105 shadow-lg shadow-indigo-500/20">
            <ListTodo size={24} className="stroke-[2.5]" />
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-gradient-to-br from-slate-900 to-emerald-950 border border-emerald-900/40 p-4 lg:p-6 rounded-2xl lg:rounded-3xl shadow-premium hover:shadow-floating transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">Completed</p>
            <h3 className="text-3xl font-black text-white tracking-tight">{completedCount}</h3>
          </div>
          <div className="p-4 bg-emerald-400 text-emerald-950 rounded-2xl transition-all duration-300 group-hover:scale-105 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 size={24} className="stroke-[2.5]" />
          </div>
        </div>

        {/* In Progress Tasks */}
        <div className="bg-gradient-to-br from-slate-900 to-amber-950 border border-amber-900/40 p-4 lg:p-6 rounded-2xl lg:rounded-3xl shadow-premium hover:shadow-floating transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">In Progress</p>
            <h3 className="text-3xl font-black text-white tracking-tight">{inProgressCount}</h3>
          </div>
          <div className="p-4 bg-amber-400 text-amber-950 rounded-2xl transition-all duration-300 group-hover:scale-105 shadow-lg shadow-amber-500/20">
            <PlayCircle size={24} className="stroke-[2.5]" />
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-gradient-to-br from-slate-900 to-rose-950 border border-rose-900/40 p-4 lg:p-6 rounded-2xl lg:rounded-3xl shadow-premium hover:shadow-floating transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-rose-400 uppercase tracking-widest">Pending</p>
            <h3 className="text-3xl font-black text-white tracking-tight">{pendingCount}</h3>
          </div>
          <div className="p-4 bg-rose-400 text-rose-950 rounded-2xl transition-all duration-300 group-hover:scale-105 shadow-lg shadow-rose-500/20">
            <Clock size={24} className="stroke-[2.5]" />
          </div>
        </div>

        {/* High Priority Tasks */}
        <div className="bg-gradient-to-br from-slate-900 to-purple-950 border border-purple-900/40 p-4 lg:p-6 rounded-2xl lg:rounded-3xl shadow-premium hover:shadow-floating transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-purple-400 uppercase tracking-widest">High Priority</p>
            <h3 className="text-3xl font-black text-white tracking-tight">{highPriorityCount}</h3>
          </div>
          <div className="p-4 bg-purple-400 text-purple-950 rounded-2xl transition-all duration-300 group-hover:scale-105 shadow-lg shadow-purple-500/20">
            <AlertTriangle size={24} className="stroke-[2.5]" />
          </div>
        </div>

      </div>

      {/* Middle Section: Task Analytics Charts & Category Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">

        {/* Status Donut Chart Card */}
        <div className="bg-white border border-slate-200/50 p-5 lg:p-8 rounded-[1.5rem] lg:rounded-3xl shadow-premium flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-extrabold text-slate-900 text-base">Task Status Analytics</h4>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-wider">Live Metrics</span>
          </div>

          <div className="relative flex justify-center items-center py-4">
            {/* SVG Visual Circle representing multiple states */}
            <svg width="220" height="220" className="transform -rotate-90">
              {/* Outer grey background track */}
              <circle cx="110" cy="110" r={radius1} stroke="#f1f5f9" strokeWidth="18" fill="transparent" />

              {/* Completed stroke (Emerald) */}
              <circle
                cx="110"
                cy="110"
                r={radius1}
                stroke="#10b981"
                strokeWidth="18"
                fill="transparent"
                strokeDasharray={circ1}
                strokeDashoffset={strokeCompleted}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              {/* In Progress stroke (Amber) - shifted to simulate stacked donut */}
              <circle
                cx="110"
                cy="110"
                r={radius2}
                stroke="#f59e0b"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circ2}
                strokeDashoffset={strokeInProgress}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              {/* Pending stroke (Rose) */}
              <circle
                cx="110"
                cy="110"
                r={radius3}
                stroke="#ef4444"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circ3}
                strokeDashoffset={strokePending}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col justify-center items-center text-center">
              <span className="text-3xl font-black text-slate-800">{totalCount}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Scope</span>
            </div>
          </div>

          {/* Donut Legend Info */}
          <div className="grid grid-cols-3 gap-2 text-center mt-6 pt-6 border-t border-slate-100">
            <div>
              <div className="flex items-center gap-1.5 justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-slate-800">{completedPct}%</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase tracking-wider">Done</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-xs font-bold text-slate-800">{inProgressPct}%</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase tracking-wider">Active</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-xs font-bold text-slate-800">{pendingPct}%</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase tracking-wider">Queue</p>
            </div>
          </div>
        </div>

        {/* Task Velocity Analytics Widget */}
        <div className="bg-white border border-slate-200/50 p-5 lg:p-8 rounded-[1.5rem] lg:rounded-3xl shadow-premium flex flex-col justify-between lg:col-span-2 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-indigo-50/50 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                  <BarChart3 size={18} />
                </div>
                <h4 className="font-extrabold text-slate-900 text-lg tracking-tight">Task Velocity</h4>
              </div>
              <p className="text-sm text-slate-500 font-medium">7-day task completion volume vs targets</p>
            </div>

            <div className="text-right">
              <h3 className="text-3xl font-black text-indigo-600">151</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total this week</p>
            </div>
          </div>

          <div className="relative z-10 flex-1 flex items-end gap-2 sm:gap-4 h-48 mt-8">
            {/* CSS Bar Chart */}
            {[
              { day: 'Mon', count: 18, height: '45%', active: false },
              { day: 'Tue', count: 24, height: '60%', active: false },
              { day: 'Wed', count: 15, height: '35%', active: false },
              { day: 'Thu', count: 32, height: '80%', active: false },
              { day: 'Fri', count: 40, height: '100%', active: true },
              { day: 'Sat', count: 12, height: '30%', active: false },
              { day: 'Sun', count: 10, height: '25%', active: false }
            ].map((stat, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end items-center group h-full">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-md mb-2 whitespace-nowrap shadow-lg translate-y-2 group-hover:translate-y-0 absolute bottom-[calc(100%+8px)] z-20 pointer-events-none">
                  {stat.count} tasks
                </div>
                {/* Bar */}
                <div className="w-full max-w-[48px] bg-slate-100 rounded-t-xl relative overflow-hidden group-hover:bg-indigo-50 transition-colors duration-300 flex-1 flex flex-col justify-end">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-1000 ease-out group-hover:bg-indigo-600 relative overflow-hidden shadow-inner ${stat.active ? 'bg-indigo-500' : 'bg-slate-300'}`}
                    style={{ height: stat.height }}
                  >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/30 to-transparent" />
                  </div>
                </div>
                {/* Label */}
                <span className={`text-xs font-bold mt-3 transition-colors ${stat.active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'}`}>{stat.day}</span>
              </div>
            ))}
          </div>

          <div className="relative z-10 mt-8 pt-6 border-t border-slate-100 grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Avg. Duration</span>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-slate-800">2.4</span>
                <span className="text-xs font-semibold text-slate-500">days</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center ml-1">
                  <TrendingUp size={10} className="mr-0.5" /> 12%
                </span>
              </div>
            </div>
            <div className="flex flex-col border-l border-slate-100 pl-4">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">On-Time Rate</span>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-slate-800">94%</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center ml-1">
                  <TrendingUp size={10} className="mr-0.5" /> 3%
                </span>
              </div>
            </div>
            <div className="flex flex-col border-l border-slate-100 pl-4">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Critical Fixes</span>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-slate-800">4.5</span>
                <span className="text-xs font-semibold text-slate-500">hrs</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section: Employee Workloads & (Recent Activity + Deadlines) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">

        {/* Employee Workload Summary */}
        <div className="bg-white border border-slate-200/50 p-5 lg:p-8 rounded-[1.5rem] lg:rounded-3xl shadow-premium lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-extrabold text-slate-900 text-base">Employee Workload Summary</h4>
              <Link to="/employees" className="text-xs font-bold text-primary hover:text-primary-dark transition-all flex items-center gap-1">
                <span>All Employees</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="pb-3.5">Employee Name</th>
                    <th className="pb-3.5 text-center">Assigned Tasks</th>
                    <th className="pb-3.5 text-center">Pending / Active</th>
                    <th className="pb-3.5 text-center">Completed</th>
                    <th className="pb-3.5 text-center">Workload Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-semibold">
                  {workloads.map((emp) => {
                    let ratingLabel = "Light";
                    let ratingColor = "bg-sky-50 text-sky-600 border-sky-100";
                    if (emp.assignedTasks >= 4) {
                      ratingLabel = "Critical";
                      ratingColor = "bg-rose-50 text-rose-600 border-rose-100";
                    } else if (emp.assignedTasks >= 2) {
                      ratingLabel = "Optimal";
                      ratingColor = "bg-indigo-50 text-indigo-600 border-indigo-100";
                    }

                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 flex items-center gap-3">
                          <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <p className="font-bold text-slate-800">{emp.name}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">{emp.role}</p>
                          </div>
                        </td>
                        <td className="py-3.5 text-center text-slate-800 font-bold">{emp.assignedTasks}</td>
                        <td className="py-3.5 text-center text-amber-600 font-bold">{emp.pendingTasks}</td>
                        <td className="py-3.5 text-center text-emerald-600 font-bold">{emp.completedTasks}</td>
                        <td className="py-3.5 text-center">
                          <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border ${ratingColor}`}>
                            {ratingLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
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

          {/* Recent Activity Panel */}
          <div className="bg-white border border-slate-200/50 p-5 lg:p-6 rounded-[1.5rem] lg:rounded-3xl shadow-premium">
            <h4 className="font-extrabold text-slate-900 text-sm mb-4">Recent Activity Panel</h4>
            <div className="space-y-4">
              {activities.slice(0, 4).map((act) => {
                let dotColor = "bg-blue-500";
                if (act.type === "complete") dotColor = "bg-emerald-500";
                else if (act.type === "delete") dotColor = "bg-rose-500";
                else if (act.type === "assign") dotColor = "bg-purple-500";

                return (
                  <div key={act.id} className="flex gap-3 text-xs leading-relaxed">
                    <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${dotColor}`} />
                    <div className="flex flex-col">
                      <p className="font-medium text-slate-700">{act.text}</p>
                      <span className="text-[10px] text-slate-400 font-semibold mt-0.5">{act.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
