import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Save } from "lucide-react";
import { taskService } from "../services/taskService";

export default function EditTask() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [employees, setEmployees] = useState([]);
  const [tasksMaster, setTasksMaster] = useState([]);
  const [projects, setProjects] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);

  const [editFormData, setEditFormData] = useState({
    name: "",
    category: "",
    assignTo: "",
    assignedBy: "",
    priority: "",
    status: "",
    dueDate: "",
    description: "",
    remarks: "",
    projectName: "",
    zone: "",
    department: "",
    purchaseType: "",
    hardwareDetails: { what: "", use: "", need: "" },
    softwareDetails: { what: "", use: "", need: "" }
  });

  useEffect(() => {
    setEmployees(taskService.getEmployees() || []);
    setTasksMaster(taskService.getTaskMaster() || []);
    setProjects(taskService.getProjects() || []);
    setPriorities(taskService.getPriorities() || []);
    setStatuses(taskService.getStatuses() || []);
    setDepartments(taskService.getDepartments() || []);

    const task = taskService.getTaskById(id) || taskService.getTasks().find(t => t.id.toString() === id);
    if (task) {
      setEditFormData({
        name: task.name || "",
        category: task.category || "",
        assignTo: task.assignTo || task.assigneeId || "",
        assignedBy: task.assignedBy || "",
        priority: task.priority || "",
        status: (task.status && task.status.toLowerCase() === "task created") ? "Pending" : (task.status || ""),
        dueDate: task.dueDate || "",
        description: task.description || "",
        remarks: task.remarks || "",
        projectName: task.projectName || "",
        zone: task.zone || "",
        department: task.department || "",
        purchaseType: task.purchaseType || "",
        hardwareDetails: task.hardwareDetails || { what: "", use: "", need: "" },
        softwareDetails: task.softwareDetails || { what: "", use: "", need: "" }
      });
    }
    setLoading(false);
  }, [id]);

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editFormData.name || !editFormData.dueDate) {
      alert("Please fill in required fields.");
      return;
    }
    taskService.updateTask(id, editFormData);
    
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate(-1); // Navigate back to where they came from
    }, 1500);
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8 animate-fade-in pb-8 lg:pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 lg:p-8 rounded-[2rem] shadow-premium border border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-slide-up relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light rounded-2xl shadow-sm hover:shadow-md transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Modify Enterprise Task</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-semibold text-sm">Update the details and assignments for this task.</p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white dark:bg-slate-800 p-6 lg:p-8 rounded-[2rem] shadow-premium border border-slate-100 dark:border-slate-700/50 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <form onSubmit={handleSaveEdit} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-extrabold text-slate-700 dark:text-slate-300 ml-1">Task Name *</label>
              <select 
                required 
                value={editFormData.name} 
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} 
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white font-semibold transition-all appearance-none cursor-pointer" 
              >
                <option value="" disabled>Select Task Name</option>
                {tasksMaster.map(t => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
                {editFormData.name && !tasksMaster.find(t => t.name === editFormData.name) && <option value={editFormData.name}>{editFormData.name}</option>}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-700 dark:text-slate-300 ml-1">Category (Department)</label>
              <select 
                value={editFormData.category} 
                onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })} 
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white font-semibold transition-all appearance-none cursor-pointer"
              >
                <option value="">Select Category</option>
                {departments.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-700 dark:text-slate-300 ml-1">Assign To</label>
              <select 
                value={editFormData.assignTo} 
                onChange={(e) => setEditFormData({ ...editFormData, assignTo: e.target.value })} 
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white font-semibold transition-all appearance-none cursor-pointer"
              >
                <option value="">Unassigned</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                ))}
                {editFormData.assignTo && !employees.find(e => e.id === editFormData.assignTo) && (
                  <option value={editFormData.assignTo}>Unknown Employee ID ({editFormData.assignTo})</option>
                )}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-700 dark:text-slate-300 ml-1">Project Name</label>
              <input
                type="text"
                list="edit-project-names"
                placeholder="Enter or select Project Name (Optional)"
                value={editFormData.projectName}
                onChange={(e) => setEditFormData({ ...editFormData, projectName: e.target.value })}
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white font-semibold transition-all"
              />
              <datalist id="edit-project-names">
                {projects.map(p => (
                  <option key={p.id} value={p.name} />
                ))}
              </datalist>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-700 dark:text-slate-300 ml-1">Department</label>
              <select 
                value={editFormData.department} 
                onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })} 
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white font-semibold transition-all appearance-none cursor-pointer"
              >
                <option value="">Select Department</option>
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-700 dark:text-slate-300 ml-1">Priority</label>
              <select 
                value={editFormData.priority} 
                onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })} 
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white font-semibold transition-all appearance-none cursor-pointer"
              >
                {priorities.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
                {editFormData.priority && !priorities.find(p => p.name === editFormData.priority) && <option value={editFormData.priority}>{editFormData.priority}</option>}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-700 dark:text-slate-300 ml-1">Status</label>
              <select 
                value={editFormData.status} 
                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })} 
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white font-semibold transition-all appearance-none cursor-pointer"
              >
                {statuses
                  .filter(s => s.name.toLowerCase() !== "task created")
                  .map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
                {!statuses.find(s => s.name.toLowerCase() === "pending") && <option value="Pending">Pending</option>}
                {!statuses.find(s => s.name.toLowerCase() === "inprogress") && <option value="Inprogress">Inprogress</option>}
                {!statuses.find(s => s.name.toLowerCase() === "testing") && <option value="Testing">Testing</option>}
                {!statuses.find(s => s.name.toLowerCase() === "onhold") && <option value="Onhold">Onhold</option>}
                {!statuses.find(s => s.name.toLowerCase() === "completed") && <option value="Completed">Completed</option>}
                {editFormData.status && !statuses.find(s => s.name === editFormData.status) && !["Pending", "Inprogress", "Testing", "Onhold", "Completed"].includes(editFormData.status) && <option value={editFormData.status}>{editFormData.status}</option>}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-700 dark:text-slate-300 ml-1">Due Date *</label>
              <input 
                type="date" 
                required 
                value={editFormData.dueDate} 
                onChange={(e) => setEditFormData({ ...editFormData, dueDate: e.target.value })} 
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white font-semibold transition-all" 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-extrabold text-slate-700 dark:text-slate-300 ml-1">Description</label>
              <textarea 
                value={editFormData.description} 
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })} 
                rows="3" 
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white font-semibold transition-all" 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-extrabold text-slate-700 dark:text-slate-300 ml-1">Notes / Remarks</label>
              <input 
                type="text" 
                value={editFormData.remarks} 
                onChange={(e) => setEditFormData({ ...editFormData, remarks: e.target.value })} 
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white font-semibold transition-all" 
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl font-bold text-sm transition-all shadow-sm w-full sm:w-auto text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold text-sm shadow-glow transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Save size={18} />
              Save Modifications
            </button>
          </div>
        </form>
      </div>

      {showToast && (
        <div className="fixed bottom-8 right-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-2xl shadow-premium flex items-center gap-3 border border-slate-800 dark:border-slate-100 z-50 animate-slide-up">
          <div className="bg-emerald-500/20 p-1.5 rounded-full">
            <CheckCircle2 size={20} className="text-emerald-500" />
          </div>
          <span className="text-sm font-bold tracking-wide">Task modified successfully!</span>
        </div>
      )}
    </div>
  );
}
