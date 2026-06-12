import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { taskService } from "../services/taskService";
import apiClient from "../services/apiClient";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  PlayCircle,
  ListTodo,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  User,
  Users,
  Calendar,
  ArrowUpRight,
  BarChart3,
  Wallet,
  ArrowRight,
  RefreshCw
} from "lucide-react";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [workloads, setWorkloads] = useState([]);
  const [teams, setTeams] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSelectingDate, setIsSelectingDate] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const loadApiData = async (showIndicator = false) => {
    if (showIndicator) setIsRefreshing(true);
    try {
      const [tasksRes, activitiesRes, categoriesRes, workloadsRes] = await Promise.all([
        taskService.getTasks(),
        taskService.getActivities(),
        taskService.getDepartments(),
        taskService.getEmployees()
      ]);

      setTasks(tasksRes || []);
      setActivities(activitiesRes || []);
      setCategories(categoriesRes || []);
      setWorkloads(workloadsRes || []);

      const storedTeamsStr = localStorage.getItem("navanala_teams");
      let activeTeams = [];
      if (storedTeamsStr) {
        try {
          activeTeams = JSON.parse(storedTeamsStr);
        } catch (e) {
          console.error("Failed to parse teams", e);
        }
      }

      if (activeTeams.length === 0) {
        activeTeams = [
          {
            id: "team-1",
            name: "Creative & Brand Operations",
            description: "Responsible for brand guidelines, marketing campaigns, and visual identity updates.",
            leadId: "emp-1",
            memberIds: ["emp-3", "emp-5"],
            categories: ["Branding Identity", "Marketing", "Legal", "HR"]
          },
          {
            id: "team-2",
            name: "Systems Engineering & Quality Assurance",
            description: "Focuses on building reliable web services, performance optimization, and automated testing.",
            leadId: "emp-2",
            memberIds: ["emp-4"],
            categories: ["Engineering", "Finance"]
          }
        ];
        localStorage.setItem("navanala_teams", JSON.stringify(activeTeams));
      }

      setTeams(activeTeams);
    } catch (err) {
      console.error("Failed to fetch data from API", err);
    } finally {
      if (showIndicator) {
        setTimeout(() => setIsRefreshing(false), 800); // Small delay to make the refresh visually apparent
      }
    }
  };

  useEffect(() => {
    setCurrentUser(taskService.getCurrentUser());
    loadApiData(false);

    const intervalId = setInterval(() => {
      loadApiData(true);
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  // Compute stat card figures
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => ["completed", "done"].includes((t.status || "").toLowerCase().trim())).length;
  const processingCount = tasks.filter(t => ["in progress", "inprogress", "active", "processing"].includes((t.status || "").toLowerCase().trim())).length;
  const pendingCount = tasks.filter(t => ["pending", "task created", "taskcreated"].includes((t.status || "").toLowerCase().trim())).length;
  const onHoldCount = tasks.filter(t => ["on hold", "onhold", "testing", "review"].includes((t.status || "").toLowerCase().trim())).length;
  const delayedCount = tasks.filter(t => ["delayed"].includes((t.status || "").toLowerCase().trim())).length;
  const cancelledCount = tasks.filter(t => ["cancelled", "canceled"].includes((t.status || "").toLowerCase().trim())).length;

  // Status Chart Percentages
  const completedPct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
  const inProgressPct = totalCount ? Math.round((processingCount / totalCount) * 100) : 0;
  const pendingPct = totalCount ? Math.round((pendingCount / totalCount) * 100) : 0;
  const testingPct = totalCount ? Math.round((onHoldCount / totalCount) * 100) : 0;

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

  const categorySummary = {};

  // Pre-fill all departments so even those with 0 tasks appear
  categories.forEach(cat => {
    if (cat && cat.name) {
      categorySummary[cat.name] = { category: cat.name, pending: 0, completed: 0, processing: 0, onhold: 0, delayed: 0, cancelled: 0 };
    }
  });

  tasks.forEach((task) => {
    let category = task.category;

    if (!category || category.toLowerCase() === "uncategorized") return;

    if (!categorySummary[category]) {
      categorySummary[category] = { category, pending: 0, completed: 0, processing: 0, onhold: 0, delayed: 0, cancelled: 0 };
    }
    const status = (task.status || "").toLowerCase().trim();
    if (["completed", "done"].includes(status)) {
      categorySummary[category].completed++;
    } else if (["in progress", "inprogress", "active", "processing"].includes(status)) {
      categorySummary[category].processing++;
    } else if (["on hold", "onhold", "testing", "review"].includes(status)) {
      categorySummary[category].onhold++;
    } else if (["delayed"].includes(status)) {
      categorySummary[category].delayed++;
    } else if (["cancelled", "canceled"].includes(status)) {
      categorySummary[category].cancelled++;
    } else {
      categorySummary[category].pending++;
    }
  });

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
      case "delayed": return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  // Calendar Logic
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  // Combine tasks deadlines and mock events
  const mockEvents = [
    { id: 'ev1', title: 'Q3 Townhall Meeting', date: new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString().split('T')[0], type: 'Event' },
    { id: 'dl1', title: 'Urgent Client Submission', date: new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString().split('T')[0], type: 'Deadline' },
    { id: 'ev2', title: 'Client UX Presentation', date: new Date(new Date().getFullYear(), new Date().getMonth(), 22).toISOString().split('T')[0], type: 'Event' },
    { id: 'ev3', title: 'Team Outing', date: new Date(new Date().getFullYear(), new Date().getMonth(), 28).toISOString().split('T')[0], type: 'Event' },
  ];

  const allEvents = [
    ...mockEvents,
    ...tasks.filter(t => t.dueDate && t.status !== "Completed").map(t => ({
      id: t.id,
      title: t.name,
      date: new Date(t.dueDate).toISOString().split('T')[0],
      type: 'Deadline'
    }))
  ];

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];

    const todayStr = new Date().toISOString().split('T')[0];
    const selectedDateStr = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-[40px] aspect-square bg-slate-50/40 rounded-xl border border-transparent"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = new Date(Date.UTC(year, month, i)).toISOString().split('T')[0];
      const dayEvents = allEvents.filter(e => e.date === dateStr);
      const isSelected = selectedDateStr === dateStr;
      const isToday = todayStr === dateStr;
      const hasTask = dayEvents.some(ev => ev.type !== 'Event');
      const hasEvent = dayEvents.some(ev => ev.type === 'Event');

      let boxStyles = 'bg-white border border-slate-100 hover:shadow-floating hover:border-slate-200';
      if (isSelected) {
        boxStyles = 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-primary/30 ring-1 ring-primary/20 scale-[1.02] z-10';
      } else if (isToday) {
        boxStyles = 'bg-indigo-200/50 border border-indigo-300 hover:bg-white hover:shadow-floating hover:border-indigo-400';
      } else if (hasTask && hasEvent) {
        boxStyles = 'bg-gradient-to-br from-slate-200/80 to-slate-300/80 border border-slate-400 hover:from-slate-300/80 hover:to-slate-400/80 hover:shadow-floating hover:border-slate-500';
      } else if (hasTask) {
        boxStyles = 'bg-slate-200 border border-slate-300 hover:bg-slate-300/80 hover:shadow-floating hover:border-slate-400';
      } else if (hasEvent) {
        boxStyles = 'bg-slate-100 border border-slate-200 hover:bg-slate-200/80 hover:shadow-floating hover:border-slate-300';
      }

      days.push(
        <div
          key={i}
          onClick={() => setSelectedDate(new Date(year, month, i))}
          className={`group relative min-h-[44px] aspect-square p-1.5 flex items-start justify-start rounded-xl cursor-pointer transition-all duration-300 ${boxStyles}`}
        >
          <span className={`text-sm font-extrabold w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-300
            ${isToday ? 'bg-gradient-to-br from-indigo-500 to-primary text-white shadow-md' :
              isSelected ? 'bg-primary/10 text-primary' :
                (hasTask && hasEvent) ? 'text-slate-900 group-hover:bg-slate-300 group-hover:text-slate-900' :
                  hasTask ? 'text-slate-900 group-hover:bg-slate-200 group-hover:text-slate-900' :
                    hasEvent ? 'text-slate-800 group-hover:bg-slate-200 group-hover:text-slate-900' :
                      'text-slate-600 group-hover:bg-slate-100 group-hover:text-slate-800'}
          `}>
            {i}
          </span>
          {dayEvents.length > 0 && (
            <div className="absolute bottom-1 right-1">
              <span className="text-[8px] font-black text-slate-600 whitespace-nowrap bg-white/80 border border-slate-300 shadow-sm px-1 rounded">
                {dayEvents.length}
              </span>
            </div>
          )}
        </div>
      );
    }
    return days;
  };

  const selectedDateStr = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  const selectedDayEvents = allEvents.filter(e => e.date === selectedDateStr);

  return (
    <div className="space-y-6 lg:space-y-8 max-w-[2560px] mx-auto animate-fade-in pb-10 2xl:px-8 relative">

      {/* Global Refresh Indicator */}
      {isRefreshing && (
        <div className="fixed top-20 right-8 flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-full shadow-premium animate-fade-in z-[100] font-black tracking-widest text-xs uppercase border border-emerald-400">
          <RefreshCw size={14} className="animate-spin" />
          <span>Syncing...</span>
        </div>
      )}

      {/* Top Statistics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 lg:gap-4">

        {/* Total Tasks */}
        <div onClick={() => navigate("/tasks")} className="cursor-pointer bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-900/40 p-3 xl:p-4 rounded-2xl shadow-premium hover:shadow-floating transition-all duration-300 flex flex-col justify-between group h-full">
          <div className="flex justify-between items-start mb-2 gap-2">
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest truncate flex-1">Total</p>
            <ListTodo size={16} className="text-indigo-400 shrink-0" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">{totalCount}</h3>
        </div>

        {/* Completed Tasks */}
        <div onClick={() => navigate("/tasks?status=Completed")} className="cursor-pointer bg-gradient-to-br from-slate-900 to-emerald-950 border border-emerald-900/40 p-3 xl:p-4 rounded-2xl shadow-premium hover:shadow-floating transition-all duration-300 flex flex-col justify-between group h-full">
          <div className="flex justify-between items-start mb-2 gap-2">
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest truncate flex-1">Completed</p>
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">{completedCount}</h3>
        </div>

        {/* Processing Tasks */}
        <div onClick={() => navigate("/tasks?status=Processing")} className="cursor-pointer bg-gradient-to-br from-slate-900 to-amber-950 border border-amber-900/40 p-3 xl:p-4 rounded-2xl shadow-premium hover:shadow-floating transition-all duration-300 flex flex-col justify-between group h-full">
          <div className="flex justify-between items-start mb-2 gap-2">
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest truncate flex-1">Processing</p>
            <TrendingUp size={16} className="text-amber-400 shrink-0" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">{processingCount}</h3>
        </div>

        {/* Pending Tasks */}
        <div onClick={() => navigate("/tasks?status=Pending")} className="cursor-pointer bg-gradient-to-br from-slate-900 to-rose-950 border border-rose-900/40 p-3 xl:p-4 rounded-2xl shadow-premium hover:shadow-floating transition-all duration-300 flex flex-col justify-between group h-full">
          <div className="flex justify-between items-start mb-2 gap-2">
            <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest truncate flex-1">Pending</p>
            <Clock size={16} className="text-rose-400 shrink-0" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">{pendingCount}</h3>
        </div>

        {/* On Hold Tasks */}
        <div onClick={() => navigate("/tasks?status=On-Hold")} className="cursor-pointer bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/40 p-3 xl:p-4 rounded-2xl shadow-premium hover:shadow-floating transition-all duration-300 flex flex-col justify-between group h-full">
          <div className="flex justify-between items-start mb-2 gap-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate flex-1">On Hold</p>
            <AlertTriangle size={16} className="text-slate-400 shrink-0" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">{onHoldCount}</h3>
        </div>

        {/* Delayed Tasks */}
        <div onClick={() => navigate("/tasks?status=Delayed")} className="cursor-pointer bg-gradient-to-br from-slate-900 to-orange-950 border border-orange-900/40 p-3 xl:p-4 rounded-2xl shadow-premium hover:shadow-floating transition-all duration-300 flex flex-col justify-between group h-full">
          <div className="flex justify-between items-start mb-2 gap-2">
            <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest truncate flex-1">Delayed</p>
            <Clock size={16} className="text-orange-400 shrink-0" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">{delayedCount}</h3>
        </div>

        {/* Cancelled Tasks */}
        <div onClick={() => navigate("/tasks?status=Cancelled")} className="cursor-pointer bg-gradient-to-br from-slate-900 to-red-950 border border-red-900/40 p-3 xl:p-4 rounded-2xl shadow-premium hover:shadow-floating transition-all duration-300 flex flex-col justify-between group h-full">
          <div className="flex justify-between items-start mb-2 gap-2">
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest truncate flex-1">Cancelled</p>
            <AlertTriangle size={16} className="text-red-400 shrink-0" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">{cancelledCount}</h3>
        </div>

      </div>

      {/* 30% / 70% Layout for Calendar and Workload Summary */}
      <div className="grid grid-cols-1 xl:grid-cols-12 lg:grid-cols-1 gap-4 lg:gap-6">

        {/* Calendar & Details Column (30% -> col-span-4) */}
        <div className="xl:col-span-4 lg:col-span-1 bg-white border border-slate-200/50 p-5 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] shadow-premium flex flex-col gap-4 lg:gap-6">
          <div>
            <div className="flex flex-col mb-6">

              <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-1.5 rounded-2xl">
                <button onClick={prevMonth} className="p-1.5 hover:bg-white hover:shadow-sm rounded-xl text-slate-600 transition-all duration-300">
                  <ChevronLeft size={18} />
                </button>
                
                {isSelectingDate ? (
                  <div className="flex gap-2 items-center bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                    <select 
                      className="text-xs font-bold text-slate-700 bg-transparent outline-none cursor-pointer"
                      value={currentDate.getMonth()}
                      onChange={(e) => setCurrentDate(new Date(currentDate.getFullYear(), parseInt(e.target.value), 1))}
                    >
                      {Array.from({length: 12}).map((_, i) => (
                        <option key={i} value={i}>{new Date(2000, i, 1).toLocaleString('default', { month: 'short' })}</option>
                      ))}
                    </select>
                    <select
                      className="text-xs font-bold text-slate-700 bg-transparent outline-none cursor-pointer"
                      value={currentDate.getFullYear()}
                      onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth(), 1))}
                    >
                      {Array.from({length: 10}).map((_, i) => {
                        const yr = new Date().getFullYear() - 5 + i;
                        return <option key={yr} value={yr}>{yr}</option>
                      })}
                    </select>
                    <button onClick={() => setIsSelectingDate(false)} className="text-emerald-500 hover:text-emerald-600 ml-1">
                      <CheckCircle2 size={16} />
                    </button>
                  </div>
                ) : (
                  <div 
                    className="group cursor-pointer px-3 py-1.5 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl transition-all"
                    onClick={() => setIsSelectingDate(true)}
                  >
                    <h5 className="text-xs font-black text-slate-800 uppercase tracking-widest group-hover:text-primary transition-colors flex items-center gap-1.5">
                      {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                      <ChevronDown size={14} className="text-slate-400 group-hover:text-primary transition-colors" />
                    </h5>
                  </div>
                )}

                <button onClick={nextMonth} className="p-1.5 hover:bg-white hover:shadow-sm rounded-xl text-slate-600 transition-all duration-300">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="bg-slate-50/30 rounded-[1.5rem] p-4 lg:p-5 border border-slate-100">
              <div className="grid grid-cols-7 gap-1 text-center mb-3">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="text-[10px] font-black text-slate-400 uppercase bg-white py-1.5 rounded-lg border border-slate-100 shadow-sm">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {renderCalendar()}
              </div>

              {/* Calendar Legend */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-5 pt-4 border-t border-slate-200/60">

                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-br from-indigo-500 to-primary shadow-sm"></span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Today</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Date Details */}
          <div className="flex-1">
            <div className="flex flex-col gap-3">
              {selectedDayEvents.length > 0 ? (
                selectedDayEvents.map((ev, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border ${ev.type === 'Event' ? 'bg-slate-100/50 border-slate-200' : 'bg-slate-200/50 border-slate-300'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${ev.type === 'Event' ? 'bg-slate-500' : 'bg-slate-700'}`}></span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${ev.type === 'Event' ? 'text-slate-500' : 'text-slate-700'}`}>{ev.type}</span>
                    </div>
                    <p className={`text-sm font-bold text-slate-800`}>{ev.title}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                  <p className="text-sm font-medium text-slate-400">No events or deadlines for this date.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Workload Column (70% -> col-span-8) */}
        <div className="xl:col-span-8 lg:col-span-1 flex flex-col gap-4 lg:gap-6">
          {/* Category Workload Summary Card */}
          <div className="bg-white border border-slate-200/50 p-5 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] shadow-premium h-full flex-1">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-extrabold text-slate-900 text-base lg:text-lg">Category Workload Summary</h4>
                <Link to="/tasks" className="text-xs font-bold text-primary hover:text-primary-dark transition-all flex items-center gap-1">
                  <span>All Categories</span>
                  <ChevronRight size={14} />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <th className="pb-3.5 pl-4">Category Name</th>
                      <th className="pb-3.5 text-center">Completed</th>
                      <th className="pb-3.5 text-center">Processing</th>
                      <th className="pb-3.5 text-center">Pending</th>
                      <th className="pb-3.5 text-center">On Hold</th>
                      <th className="pb-3.5 text-center">Delayed</th>
                      <th className="pb-3.5 text-center">Cancelled</th>
                      <th className="pb-3.5 text-center text-indigo-500">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm font-semibold">
                    {categoryWorkloadArray.map((cat, idx) => (
                      <tr key={idx} className="even:bg-sky-50/60 hover:bg-sky-100/60 transition-colors">
                        <td className="py-4 pl-4">
                          <p className="font-bold text-slate-800">{cat.category}</p>
                        </td>
                        <td 
                          onClick={() => navigate(`/tasks?status=Completed&category=${encodeURIComponent(cat.category)}`)}
                          className="py-4 text-center text-emerald-600 font-bold text-base cursor-pointer hover:underline transition-all"
                        >
                          {cat.completed}
                        </td>
                        <td 
                          onClick={() => navigate(`/tasks?status=Processing&category=${encodeURIComponent(cat.category)}`)}
                          className="py-4 text-center text-amber-600 font-bold text-base cursor-pointer hover:underline transition-all"
                        >
                          {cat.processing}
                        </td>
                        <td 
                          onClick={() => navigate(`/tasks?status=Pending&category=${encodeURIComponent(cat.category)}`)}
                          className="py-4 text-center text-rose-600 font-bold text-base cursor-pointer hover:underline transition-all"
                        >
                          {cat.pending}
                        </td>
                        <td 
                          onClick={() => navigate(`/tasks?status=On-Hold&category=${encodeURIComponent(cat.category)}`)}
                          className="py-4 text-center text-slate-500 font-bold text-base cursor-pointer hover:underline transition-all"
                        >
                          {cat.onhold}
                        </td>
                        <td 
                          onClick={() => navigate(`/tasks?status=Delayed&category=${encodeURIComponent(cat.category)}`)}
                          className="py-4 text-center text-orange-600 font-bold text-base cursor-pointer hover:underline transition-all"
                        >
                          {cat.delayed}
                        </td>
                        <td 
                          onClick={() => navigate(`/tasks?status=Cancelled&category=${encodeURIComponent(cat.category)}`)}
                          className="py-4 text-center text-red-600 font-bold text-base cursor-pointer hover:underline transition-all"
                        >
                          {cat.cancelled}
                        </td>
                        <td 
                          onClick={() => navigate(`/tasks?category=${encodeURIComponent(cat.category)}`)}
                          className="py-4 text-center text-indigo-600 font-black text-lg cursor-pointer hover:underline transition-all"
                        >
                          {cat.completed + cat.processing + cat.pending + cat.onhold + cat.delayed + cat.cancelled}
                        </td>
                      </tr>
                    ))}
                    {categoryWorkloadArray.length === 0 && (
                      <tr>
                        <td colSpan="8" className="py-8 text-center text-slate-400 font-medium text-sm">No categories available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>


        </div>

      </div>

      {/* Middle Section: Task Analytics Charts & Category Progress */}
      <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-1 gap-4 lg:gap-6">

        {/* Action Needed: High Priority Tasks Card */}
        <div className="bg-white border border-slate-200/50 p-5 lg:p-8 rounded-[1.5rem] lg:rounded-3xl shadow-premium xl:col-span-1 lg:col-span-1 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-extrabold text-slate-900 text-base lg:text-lg flex items-center gap-2">
              <AlertTriangle size={20} className="text-rose-500" />
              Action Needed: High Priority
            </h4>
            <Link to="/tasks?priority=High" className="text-xs font-bold text-primary hover:text-primary-dark transition-all flex items-center gap-1">
              <span>View All</span>
              <ChevronRight size={14} />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {tasks.filter(t => (t.priority || "").toLowerCase() === "high" && !["completed", "done"].includes((t.status || "").toLowerCase().trim())).slice(0, 4).map((task, idx) => {
              const assignee = workloads.find(e => e.id === task.assignTo);
              return (
                <div key={idx} className="p-4 rounded-xl border border-rose-100 bg-rose-50/30 flex items-center justify-between hover:bg-rose-50/80 transition-colors">
                  <div className="flex items-center gap-4 flex-1 min-w-0 pr-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0"></div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-800 text-sm truncate">{task.name}</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">{task.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border bg-white border-rose-200 text-rose-600 whitespace-nowrap">
                      {task.status || "Pending"}
                    </span>
                    {assignee && (
                      <img src={assignee.avatar || "https://i.pravatar.cc/150?u=user"} alt={assignee.name} title={`Assigned to ${assignee.name}`} className="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
            {tasks.filter(t => (t.priority || "").toLowerCase() === "high" && !["completed", "done"].includes((t.status || "").toLowerCase().trim())).length === 0 && (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                <p className="text-sm font-medium text-slate-500 flex items-center justify-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  All caught up! No pending high priority tasks.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Team Projects Overview */}
        <div className="bg-white border border-slate-200/50 p-5 lg:p-8 rounded-[1.5rem] lg:rounded-3xl shadow-premium xl:col-span-2 lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-extrabold text-slate-900 text-lg">Team Projects Overview</h4>
              <Link to="/team-details" className="text-xs font-bold text-primary hover:text-primary-dark transition-all flex items-center gap-1">
                <span>Click More</span>
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
                    const lead = workloads.find(w => String(w.id) === String(team.leadId)) || { name: "Unassigned" };
                    const teamMembers = workloads.filter(w => (team.memberIds || []).map(String).includes(String(w.id)));

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
                    )
                  })}
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
                const assignedToObj = workloads.find(e => e.id === task.assignTo);
                const assignedByObj = workloads.find(e => e.id === task.assignedBy);
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
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5" title="Entered By">
                          <span className="text-[10px] text-slate-400 font-bold uppercase w-16">By:</span>
                          {assignedByObj ? (
                            <div className="flex items-center gap-1.5">
                              <img src={assignedByObj.avatar || "https://i.pravatar.cc/150?u=admin"} alt={assignedByObj.name} className="w-5 h-5 rounded-full object-cover" />
                              <span className="text-xs font-bold text-slate-700">{assignedByObj.name}</span>
                            </div>
                          ) : (
                            <span className="text-xs font-semibold text-slate-400 italic">Unknown</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5" title="Assigned To">
                          <span className="text-[10px] text-slate-400 font-bold uppercase w-16">To:</span>
                          {assignedToObj ? (
                            <div className="flex items-center gap-1.5">
                              <img src={assignedToObj.avatar || "https://i.pravatar.cc/150?u=user"} alt={assignedToObj.name} className="w-5 h-5 rounded-full object-cover" />
                              <span className="text-xs font-bold text-slate-700">{assignedToObj.name}</span>
                            </div>
                          ) : (
                            <span className="text-xs font-semibold text-slate-400 italic">Unassigned</span>
                          )}
                        </div>
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
