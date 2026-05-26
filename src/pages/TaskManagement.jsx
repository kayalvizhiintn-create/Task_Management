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
  CheckCircle,
  AlertCircle,
  X
} from "lucide-react";

export default function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("dueDate-asc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Edit Modal State
  const [editingTask, setEditingTask] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    category: "",
    assigneeId: "",
    priority: "",
    status: "",
    dueDate: "",
    description: "",
    remarks: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    setTasks(taskService.getTasks());
    setEmployees(taskService.getEmployees());
    setCategories(taskService.getCategories());
  }

  // Delete handler
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      taskService.deleteTask(id);
      loadData();
    }
  };

  // Open Edit Modal
  const startEdit = (task) => {
    setEditingTask(task);
    setEditFormData({
      name: task.name,
      category: task.category,
      assigneeId: task.assigneeId,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      description: task.description || "",
      remarks: task.remarks || ""
    });
  };

  // Save Edit
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editFormData.name || !editFormData.dueDate) {
      alert("Please fill in required fields.");
      return;
    }
    taskService.updateTask(editingTask.id, editFormData);
    setEditingTask(null);
    loadData();
  };

  // Inline Status quick toggling
  const handleQuickStatusChange = (id, newStatus) => {
    taskService.updateTask(id, { status: newStatus });
    loadData();
  };

  // Inline Assignee quick change
  const handleQuickAssign = (id, newAssigneeId) => {
    taskService.updateTask(id, { assigneeId: newAssigneeId });
    loadData();
  };

  // Filtering & Sorting calculations
  const filteredTasks = tasks.filter(task => {
    const assignee = employees.find(e => e.id === task.assigneeId);
    const assigneeName = assignee ? assignee.name : "unassigned";

    const matchesSearch =
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assigneeName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || task.status === statusFilter;
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
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      case "In Progress":
        return "bg-amber-50 text-amber-700 border-amber-200/80";
      case "Testing":
        return "bg-violet-50 text-violet-700 border-violet-200/80";
      case "Pending":
        return "bg-rose-50 text-rose-700 border-rose-200/80";
      case "Hold":
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
      <div className="bg-white border border-slate-200/50 p-4 lg:p-6 rounded-[1.5rem] lg:rounded-3xl shadow-premium space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">

          {/* Search bar */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Search</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search by task, category or employee name..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-slate-800"
              />
            </div>
          </div>

          {/* Status selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Testing">Testing</option>
              <option value="Completed">Completed</option>
              <option value="Hold">Hold</option>
            </select>
          </div>

          {/* Priority selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-700"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Sort selection */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-700"
            >
              <option value="dueDate-asc">Deadline (Earliest)</option>
              <option value="dueDate-desc">Deadline (Latest)</option>
              <option value="priority-high">Priority (Highest)</option>
              <option value="name-asc">Task Alphabetical</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Table view */}
      <div className="bg-white border border-slate-200/50 rounded-[1.5rem] lg:rounded-3xl shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Task Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Assigned Employee</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Deadline</th>
                <th className="px-6 py-4 text-center">Action Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400">
                    No matching tasks found. Adjust filters or search parameters.
                  </td>
                </tr>
              ) : (
                currentItems.map((task) => {
                  const assignee = employees.find(e => e.id === task.assigneeId);

                  return (
                    <tr key={task.id} className="hover:bg-slate-50/40 transition-colors">
                      {/* Name */}
                      <td className="px-6 py-4 max-w-[280px]">
                        <p className="font-extrabold text-slate-800 tracking-tight truncate">{task.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate font-medium">{task.description}</p>
                      </td>

                      {/* Category tag */}
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-xl text-xs font-bold">
                          {task.category}
                        </span>
                      </td>

                      {/* Assigned Employee Avatar & Selector */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          {assignee ? (
                            <>
                              <img src={assignee.avatar} alt={assignee.name} className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200" />
                              <div>
                                <p className="font-bold text-xs text-slate-800">{assignee.name}</p>
                                <select
                                  value={task.assigneeId}
                                  onChange={(e) => handleQuickAssign(task.id, e.target.value)}
                                  className="text-[9px] font-bold text-primary hover:underline bg-transparent border-none p-0 cursor-pointer focus:ring-0"
                                >
                                  {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                                  ))}
                                </select>
                              </div>
                            </>
                          ) : (
                            <span className="text-xs text-slate-400 font-bold italic">Unassigned</span>
                          )}
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md border ${getPriorityBadge(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>

                      {/* Status select/badge */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md border ${getStatusBadge(task.status)}`}>
                            {task.status}
                          </span>
                          <select
                            value={task.status}
                            onChange={(e) => handleQuickStatusChange(task.id, e.target.value)}
                            className="w-5 h-5 opacity-0 absolute cursor-pointer"
                            title="Quick Change Status"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Testing">Testing</option>
                            <option value="Completed">Completed</option>
                            <option value="Hold">Hold</option>
                          </select>
                        </div>
                      </td>

                      {/* Due Date */}
                      <td className="px-6 py-4 text-xs font-bold text-slate-600">
                        {task.dueDate}
                      </td>

                      {/* Action buttons */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => navigate(`/task/${task.id}`)}
                            title="View Details"
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-primary transition-all duration-150"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => startEdit(task)}
                            title="Edit Task"
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-amber-600 transition-all duration-150"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            title="Delete Task"
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-rose-600 transition-all duration-150"
                          >
                            <Trash2 size={16} />
                          </button>
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
          <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedTasks.length)} of {sortedTasks.length} tasks
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
                className="p-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-slate-500 disabled:opacity-40 disabled:hover:bg-white transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => paginate(idx + 1)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${currentPage === idx + 1
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
                className="p-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-slate-500 disabled:opacity-40 disabled:hover:bg-white transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-[1.5rem] lg:rounded-3xl w-full max-w-lg shadow-floating overflow-hidden animate-slide-up">
            <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/65 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Modify Enterprise Task</h3>
                <p className="text-xs text-slate-400 font-medium">Task ID: {editingTask.id}</p>
              </div>
              <button
                onClick={() => setEditingTask(null)}
                className="p-2 hover:bg-slate-200 rounded-xl text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-4 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar">

              {/* Task Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Task Name</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-700"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Assignee */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Assign To</label>
                  <select
                    value={editFormData.assigneeId}
                    onChange={(e) => setEditFormData({ ...editFormData, assigneeId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-700"
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Priority */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Priority</label>
                  <select
                    value={editFormData.priority}
                    onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-700"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-700"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Testing">Testing</option>
                    <option value="Completed">Completed</option>
                    <option value="Hold">Hold</option>
                  </select>
                </div>

                {/* Due Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Due Date</label>
                  <input
                    type="date"
                    value={editFormData.dueDate}
                    onChange={(e) => setEditFormData({ ...editFormData, dueDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-700"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Description</label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  rows="3"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 font-semibold"
                />
              </div>

              {/* Remarks */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Notes / Remarks</label>
                <input
                  type="text"
                  value={editFormData.remarks}
                  onChange={(e) => setEditFormData({ ...editFormData, remarks: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 font-semibold"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3.5 pt-4 border-t border-slate-100 justify-end">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-xs shadow-glow transition-all"
                >
                  Save Modifications
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
