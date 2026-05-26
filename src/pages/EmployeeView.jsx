import React, { useState, useEffect } from "react";
import { taskService } from "../services/taskService";
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  ClipboardList, 
  ChevronRight,
  TrendingUp,
  Sliders,
  MapPin
} from "lucide-react";
import { Link } from "react-router-dom";

export default function EmployeeView() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [employeeTasks, setEmployeeTasks] = useState([]);
  
  useEffect(() => {
    const emps = taskService.getEmployees();
    setEmployees(emps);
    if (emps.length > 0) {
      setSelectedEmpId(emps[0].id);
    }
  }, []);

  useEffect(() => {
    if (selectedEmpId) {
      const allTasks = taskService.getTasks();
      const filtered = allTasks.filter(t => t.assigneeId === selectedEmpId);
      setEmployeeTasks(filtered);
    }
  }, [selectedEmpId]);

  function loadData() {
    const allTasks = taskService.getTasks();
    const filtered = allTasks.filter(t => t.assigneeId === selectedEmpId);
    setEmployeeTasks(filtered);
  }

  const activeEmployee = employees.find(e => e.id === selectedEmpId);

  // Compute metrics for active employee
  const totalCount = employeeTasks.length;
  const completedCount = employeeTasks.filter(t => t.status === "Completed").length;
  const testingCount = employeeTasks.filter(t => t.status === "Testing").length;
  const pendingCount = employeeTasks.filter(t => t.status === "Pending" || t.status === "In Progress" || t.status === "Hold" || t.status === "Testing").length;
  const highPriorityCount = employeeTasks.filter(t => t.priority === "High" && t.status !== "Completed").length;
  
  // Due today calculation
  const todayStr = new Date().toISOString().split("T")[0];
  const dueTodayCount = employeeTasks.filter(t => t.dueDate === todayStr && t.status !== "Completed").length;

  const handleStatusChange = (taskId, newStatus) => {
    taskService.updateTask(taskId, { status: newStatus });
    loadData();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Testing": return "bg-violet-50 text-violet-700 border-violet-200";
      case "In Progress": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Pending": return "bg-rose-50 text-rose-700 border-rose-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High": return "bg-rose-100 text-rose-800";
      case "Medium": return "bg-amber-100 text-amber-800";
      case "Low":
      default: return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto animate-fade-in">
      
      {/* Page Header and Employee Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Employee Task Planner</h2>
          <p className="text-slate-500 font-medium mt-1">Review operational scopes sorted by specific human resources.</p>
        </div>
        
        {/* Employee Switcher Selector */}
        <div className="flex items-center gap-3 bg-white border border-slate-200/50 px-4 py-2.5 rounded-2xl shadow-sm w-fit shrink-0">
          <Users size={16} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-500">Resource:</span>
          <select
            value={selectedEmpId}
            onChange={(e) => setSelectedEmpId(e.target.value)}
            className="text-xs font-extrabold text-slate-800 bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
          >
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Employee Profile Summary card */}
      {activeEmployee && (
        <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-premium flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <div className="flex items-center gap-4">
            <img src={activeEmployee.avatar} alt={activeEmployee.name} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-primary/10 shrink-0" />
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{activeEmployee.name}</h3>
                <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md uppercase tracking-wider">{activeEmployee.role}</span>
              </div>
              <p className="text-xs text-slate-400 font-semibold mt-1 flex items-center gap-1">
                <span>{activeEmployee.email}</span>
                <span>•</span>
                <span className="text-emerald-500 font-bold">Standard Workload Allocation Active</span>
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200/20 shrink-0">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">Total Scope</span>
              <span className="text-lg font-black text-slate-800 mt-1 block">{totalCount}</span>
            </div>
            <div className="text-center bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200/20 shrink-0">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">Completed</span>
              <span className="text-lg font-black text-emerald-600 mt-1 block">{completedCount}</span>
            </div>
            <div className="text-center bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200/20 shrink-0">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">Active Tasks</span>
              <span className="text-lg font-black text-amber-600 mt-1 block">{pendingCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        
        {/* Total Tasks */}
        <div className="bg-white border border-slate-200/50 p-5 rounded-3xl shadow-premium flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">My Total Tasks</p>
            <h4 className="text-2xl font-black text-slate-800">{totalCount}</h4>
          </div>
          <div className="p-3 bg-slate-100 text-slate-600 rounded-2xl"><ClipboardList size={18} /></div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white border border-slate-200/50 p-5 rounded-3xl shadow-premium flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active & Pending</p>
            <h4 className="text-2xl font-black text-slate-800">{pendingCount}</h4>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Clock size={18} /></div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white border border-slate-200/50 p-5 rounded-3xl shadow-premium flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completed Scope</p>
            <h4 className="text-2xl font-black text-emerald-600">{completedCount}</h4>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><CheckCircle2 size={18} /></div>
        </div>

        {/* Testing Tasks */}
        <div className="bg-white border border-slate-200/50 p-5 rounded-3xl shadow-premium flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Testing Phase</p>
            <h4 className="text-2xl font-black text-violet-600">{testingCount}</h4>
          </div>
          <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl"><CheckCircle2 size={18} /></div>
        </div>

        {/* Due Today */}
        <div className="bg-white border border-slate-200/50 p-5 rounded-3xl shadow-premium flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Due Today</p>
            <h4 className={`text-2xl font-black ${dueTodayCount > 0 ? "text-rose-600 animate-pulse" : "text-slate-800"}`}>{dueTodayCount}</h4>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl"><Calendar size={18} /></div>
        </div>

        {/* High Priority Tasks */}
        <div className="bg-white border border-slate-200/50 p-5 rounded-3xl shadow-premium flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">High Priority Scope</p>
            <h4 className="text-2xl font-black text-indigo-600">{highPriorityCount}</h4>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><AlertTriangle size={18} /></div>
        </div>

      </div>

      {/* Card Layout Section for employee tasks */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-extrabold text-slate-900 text-lg">Assigned Project Workload</h4>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{totalCount} Tasks registered</span>
        </div>

        {employeeTasks.length === 0 ? (
          <div className="bg-white border border-slate-200/50 rounded-3xl p-16 text-center text-slate-400 font-semibold shadow-premium">
            <ClipboardList size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm">No tasks assigned to this employee workspace.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employeeTasks.map((task) => (
              <div 
                key={task.id} 
                className="bg-white border border-slate-200/50 rounded-3xl shadow-premium p-6 flex flex-col justify-between hover:shadow-floating transition-all duration-300 group"
              >
                <div>
                  {/* Category & Priority Row */}
                  <div className="flex justify-between items-center gap-4">
                    <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider">
                      {task.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${getPriorityBadge(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="mt-4 space-y-2">
                    <h5 className="font-extrabold text-slate-900 text-base leading-tight group-hover:text-primary transition-colors">
                      {task.name}
                    </h5>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                      {task.description || "No description provided."}
                    </p>
                  </div>

                  {/* Date fields */}
                  <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-400">
                    <div>
                      <span className="block uppercase tracking-wider">Start Date</span>
                      <span className="text-slate-700 font-bold mt-0.5 block">{task.startDate}</span>
                    </div>
                    <div>
                      <span className="block uppercase tracking-wider">Due Date</span>
                      <span className="text-slate-700 font-bold mt-0.5 block">{task.dueDate}</span>
                    </div>
                  </div>
                </div>

                {/* Status Toggler Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  
                  {/* Current Status display */}
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${
                      task.status === 'Completed' ? 'bg-emerald-500' :
                      task.status === 'Testing' ? 'bg-violet-500' :
                      task.status === 'In Progress' ? 'bg-amber-500' :
                      task.status === 'Pending' ? 'bg-rose-500' : 'bg-slate-500'
                    }`} />
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className="text-xs font-bold text-slate-700 bg-transparent border-none p-0 cursor-pointer focus:ring-0 hover:underline"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Testing">Testing</option>
                      <option value="Completed">Completed</option>
                      <option value="Hold">Hold</option>
                    </select>
                  </div>

                  {/* Details Navigation */}
                  <Link
                    to={`/task/${task.id}`}
                    className="text-xs font-extrabold text-primary hover:text-primary-dark transition-all flex items-center gap-1"
                  >
                    <span>Overview</span>
                    <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
