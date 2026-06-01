import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { taskService } from "../services/taskService";
import {
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  UserCheck,
  AlertCircle,
  X,
  Image as ImageIcon
} from "lucide-react";

export default function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "All");
  const [priorityFilter, setPriorityFilter] = useState(searchParams.get("priority") || "All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("dueDate-asc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Edit modal state removed, using EditTask.jsx page

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const status = searchParams.get("status");
    if (status) setStatusFilter(status);
    
    const priority = searchParams.get("priority");
    if (priority) setPriorityFilter(priority);

    const search = searchParams.get("search");
    if (search !== null) {
      setSearchTerm(search);
    }
  }, [searchParams]);
  function loadData() {
    setTasks(taskService.getTasks());
    setEmployees(taskService.getEmployees());
    setCategories(taskService.getCategories());
    setStatuses(taskService.getStatuses());
    setPriorities(taskService.getPriorities());
  }

  // Delete handler
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      taskService.deleteTask(id);
      loadData();
    }
  };

  // Edit handlers removed, using EditTask.jsx page

  // Inline Status quick toggling
  const handleQuickStatusChange = (id, newStatus) => {
    taskService.updateTask(id, { status: newStatus });
    loadData();
  };

  // Inline Assignee quick change
  const handleQuickAssign = (id, newAssignTo) => {
    taskService.updateTask(id, { assignTo: newAssignTo });
    loadData();
  };

  // Filtering & Sorting calculations
  const filteredTasks = tasks.filter(task => {
    const assignee = employees.find(e => e.id === task.assignTo || e.id === task.assigneeId);
    const assigneeName = assignee ? assignee.name : "unassigned";

    const matchesSearch =
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assigneeName.toLowerCase().includes(searchTerm.toLowerCase());

    const normalizedTaskStatus = (task.status || "").toLowerCase().replace(/\s+/g, "");
    const normalizedFilterStatus = (statusFilter || "").toLowerCase().replace(/\s+/g, "");
    const matchesStatus = statusFilter === "All" || normalizedTaskStatus === normalizedFilterStatus;
    const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter;
    const matchesCategory = categoryFilter === "All" || task.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Sort
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "dueDate-asc") return new Date(a.dueDate) - new Date(b.dueDate);
    if (sortBy === "dueDate-desc") return new Date(b.dueDate) - new Date(a.dueDate);
    if (sortBy === "priority-high") {
      const priorityWeights = { High: 3, Medium: 2, Low: 1 };
      return priorityWeights[b.priority] - priorityWeights[a.priority];
    }
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    return 0;
  });

  // Pagination calculations
  const totalPages = Math.ceil(sortedTasks.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedTasks.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Badge stylings
  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase().replace(/\s+/g, "");
    switch (s) {
      case "completed": case "done":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      case "inprogress": case "active":
        return "bg-amber-50 text-amber-700 border-amber-200/80";
      case "testing": case "review":
        return "bg-violet-50 text-violet-700 border-violet-200/80";
      case "pending": case "taskcreated":
        return "bg-rose-50 text-rose-700 border-rose-200/80";
      case "hold": case "onhold":
      default:
        return "bg-slate-50 text-slate-700 border-slate-200/80";
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "Medium":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Low":
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8 max-w-[2560px] mx-auto animate-fade-in 2xl:px-8">

      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Task Directory</h2>
          <p className="text-slate-500 font-medium mt-1">Audit, modify, assign, and sort standard operational goals.</p>
        </div>
        <button
          onClick={() => navigate("/create-task")}
          className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold shadow-glow hover:shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter and Search Panel */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search tasks, categories, or employees..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200/80 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap lg:flex-nowrap gap-3">
          <div className="flex items-center bg-white border border-slate-200/80 rounded-2xl px-4 py-2 shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary hover:border-slate-300">
            <Filter size={16} className="text-slate-400 mr-2" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-sm font-bold text-slate-700 focus:outline-none appearance-none cursor-pointer flex-1"
            >
              <option value="All">All Statuses</option>
              {statuses.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          
          <div className="flex items-center bg-white border border-slate-200/80 rounded-2xl px-4 py-2 shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary hover:border-slate-300">
            <AlertCircle size={16} className="text-slate-400 mr-2" />
            <select
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-sm font-bold text-slate-700 focus:outline-none appearance-none cursor-pointer flex-1"
            >
              <option value="All">All Priorities</option>
              {priorities.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>
          </div>

          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); }}
            className="px-4 py-3 bg-white border border-slate-200/80 rounded-2xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer hover:border-slate-300 transition-all"
          >
            <option value="dueDate-asc">Sort: Deadline (Earliest)</option>
            <option value="dueDate-desc">Sort: Deadline (Latest)</option>
            <option value="priority-high">Sort: Priority (Highest)</option>
            <option value="name-asc">Sort: Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Hyper-Minimalist Table View */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <th className="px-8 py-6 font-semibold">Task</th>
              <th className="px-8 py-6 font-semibold">Assigned To</th>
              <th className="px-8 py-6 font-semibold">Status</th>
              <th className="px-8 py-6 font-semibold">Due</th>
              <th className="px-8 py-6 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-24 text-slate-400">
                  <div className="flex flex-col items-center justify-center">
                    <Search size={32} className="mb-4 text-slate-200" />
                    <p className="font-semibold text-sm">No tasks found matching your filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentItems.map(task => {
                const assignee = employees.find(e => e.id === task.assignTo || e.id === task.assigneeId);
                return (
                  <tr key={task.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full shadow-sm ${task.priority === 'High' ? 'bg-rose-500 shadow-rose-200' : task.priority === 'Medium' ? 'bg-amber-500 shadow-amber-200' : 'bg-blue-500 shadow-blue-200'}`}></div>
                        <div>
                          <p className="font-extrabold text-slate-800 text-sm">{task.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{task.projectName || "General Project"} &bull; {task.category || "General"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {assignee ? (
                        <div className="flex items-center gap-3">
                          <img src={assignee.avatar} className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm" alt="" />
                          <span className="text-xs font-bold text-slate-700">{assignee.name}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 border-dashed flex items-center justify-center">
                            <UserCheck size={12} className="text-slate-300" />
                          </div>
                          <span className="text-xs font-bold text-slate-400 italic">Unassigned</span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full ${getStatusBadge(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold text-slate-500">{task.dueDate}</span>
                    </td>
                    <td className="px-8 py-6 text-left">
                      <div className="flex justify-start gap-2">
                        {task.attachment && (
                          <button onClick={() => navigate(`/task/${task.id}/attachment`)} className="p-2 bg-white border border-slate-200 hover:border-indigo-200 rounded-xl text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all shadow-sm"><ImageIcon size={14}/></button>
                        )}
                        <button onClick={() => navigate(`/task/${task.id}`)} className="p-2 bg-white border border-slate-200 hover:border-blue-200 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all shadow-sm"><Eye size={14}/></button>
                        <button onClick={() => navigate(`/edit-task/${task.id}`)} className="p-2 bg-white border border-slate-200 hover:border-amber-200 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-all shadow-sm"><Edit3 size={14}/></button>
                        <button onClick={() => handleDelete(task.id)} className="p-2 bg-white border border-slate-200 hover:border-rose-200 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all shadow-sm"><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination bar */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-semibold text-slate-500">
            Showing <span className="text-slate-800 font-black">{indexOfFirstItem + 1}</span> to <span className="text-slate-800 font-black">{Math.min(indexOfLastItem, sortedTasks.length)}</span> of <span className="text-slate-800 font-black">{sortedTasks.length}</span> tasks
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
              className="p-2.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-slate-500 disabled:opacity-40 disabled:hover:bg-white transition-colors shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => paginate(idx + 1)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all shadow-sm ${currentPage === idx + 1
                  ? "bg-primary text-white shadow-glow"
                  : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                  }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => paginate(currentPage + 1)}
              className="p-2.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-slate-500 disabled:opacity-40 disabled:hover:bg-white transition-colors shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
