import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { taskService } from "../services/taskService";
import {
  ArrowLeft,
  User,
  Calendar,
  Tag,
  Flag,
  Activity,
  FileSpreadsheet,
  MessageSquarePlus,
  CheckCircle2,
  Clock,
  FileText,
  Briefcase,
  MapPin,
  Layers,
  Image as ImageIcon,
  X,
  Eye
} from "lucide-react";

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [assignedToEmp, setAssignedToEmp] = useState(null);
  const [assignedByEmp, setAssignedByEmp] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    loadTaskDetails();
  }, [id]);

  function loadTaskDetails() {
    const fetchedTask = taskService.getTaskById(id);
    if (!fetchedTask) {
      setTask(null);
      return;
    }
    setTask(fetchedTask);
    setTimeline(fetchedTask.timeline || []);

    const emps = taskService.getEmployees();
    setAssignedToEmp(emps.find(e => e.id === fetchedTask.assignTo || e.id === fetchedTask.assigneeId));
    setAssignedByEmp(emps.find(e => e.id === fetchedTask.assignedBy));
  }

  if (!task) {
    return (
      <div className="text-center py-12 space-y-4 max-w-md mx-auto">
        <h3 className="text-xl font-extrabold text-slate-800">Task Not Found</h3>
        <p className="text-slate-500 text-sm">The task identifier may be invalid or it has been deleted.</p>
        <Link to="/tasks" className="inline-block px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-glow">
          Back to Tasks
        </Link>
      </div>
    );
  }

  // Quick mark completed
  const handleMarkCompleted = () => {
    taskService.updateTask(task.id, { status: "Completed" });
    loadTaskDetails();
  };

  // Add Comment/Remark to Timeline
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const today = new Date().toISOString().split("T")[0];
    const updatedTimeline = [
      ...timeline,
      { date: today, type: "Comment", message: `Comment: "${newComment}"` }
    ];

    taskService.updateTask(task.id, {
      timeline: updatedTimeline,
      remarks: newComment
    });

    setNewComment("");
    loadTaskDetails();
  };

  // Badges styling
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-emerald-500 text-white";
      case "Testing": return "bg-violet-500 text-white";
      case "In Progress": return "bg-amber-500 text-white";
      case "Pending": return "bg-rose-500 text-white";
      case "Hold":
      default: return "bg-slate-500 text-white";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "bg-rose-50 border-rose-200 text-rose-700";
      case "Medium": return "bg-amber-50 border-amber-200 text-amber-700";
      case "Low":
      default: return "bg-blue-50 border-blue-200 text-blue-700";
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 lg:space-y-8 animate-fade-in">

      {/* Top Navigation Row */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 hover:shadow-sm transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Scope details</h2>
            <p className="text-slate-500 font-medium mt-1">Audit task progress, team activity tracking, and project comments.</p>
          </div>
        </div>

        {task.status !== "Completed" && (
          <button
            onClick={handleMarkCompleted}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg hover:shadow-emerald-500/10 transition-all flex items-center gap-2"
          >
            <CheckCircle2 size={16} />
            <span>Mark as Completed</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">

        {/* Left Columns: Task Information & Employee Card */}
        <div className="lg:col-span-2 space-y-4 lg:space-y-8">

          {/* Main Info Card */}
          <div className="bg-white border border-slate-200/50 rounded-[1.5rem] lg:rounded-3xl shadow-premium p-5 lg:p-8 space-y-4 lg:space-y-6">

            {/* Headers: Badges + ID */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Task ID: {task.id}</span>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-xl text-xs font-bold ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${getPriorityColor(task.priority)}`}>
                  {task.priority} Priority
                </span>
              </div>
            </div>

            {/* Task Name */}
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{task.name}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/5 border border-primary/10 px-3 py-1 rounded-xl w-fit">
                  <Tag size={12} />
                  <span>{task.category}</span>
                </div>
                {task.projectName && (
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-xl w-fit">
                    <Briefcase size={12} />
                    <span>Project: {task.projectName}</span>
                  </div>
                )}
                {task.zone && (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-xl w-fit">
                    <MapPin size={12} />
                    <span>Zone: {task.zone}</span>
                  </div>
                )}
                {task.department && (
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-xl w-fit">
                    <Layers size={12} />
                    <span>Dept: {task.department}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Purchase Info */}
            {task.zone === "Purchase" && task.purchaseType && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 mt-4">
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Purchase Details: {task.purchaseType}</h4>
                <div className="grid grid-cols-3 gap-4">
                  {task.purchaseType === "Hardware" && task.hardwareDetails && (
                    <>
                      <div><span className="block text-[10px] text-slate-400 font-bold uppercase">What</span><span className="text-sm font-bold text-slate-700">{task.hardwareDetails.what || "N/A"}</span></div>
                      <div><span className="block text-[10px] text-slate-400 font-bold uppercase">Use</span><span className="text-sm font-bold text-slate-700">{task.hardwareDetails.use || "N/A"}</span></div>
                      <div><span className="block text-[10px] text-slate-400 font-bold uppercase">Need</span><span className="text-sm font-bold text-slate-700">{task.hardwareDetails.need || "N/A"}</span></div>
                    </>
                  )}
                  {task.purchaseType === "Software" && task.softwareDetails && (
                    <>
                      <div><span className="block text-[10px] text-slate-400 font-bold uppercase">What</span><span className="text-sm font-bold text-slate-700">{task.softwareDetails.what || "N/A"}</span></div>
                      <div><span className="block text-[10px] text-slate-400 font-bold uppercase">Use</span><span className="text-sm font-bold text-slate-700">{task.softwareDetails.use || "N/A"}</span></div>
                      <div><span className="block text-[10px] text-slate-400 font-bold uppercase">Need</span><span className="text-sm font-bold text-slate-700">{task.softwareDetails.need || "N/A"}</span></div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2 mt-4">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Detailed Description</h4>
              <p className="text-slate-700 text-sm leading-relaxed bg-slate-50/50 p-4 border border-slate-200/30 rounded-2xl">
                {task.description || "No description provided for this task."}
              </p>
            </div>

            {/* Attachments */}
            {task.attachment && (
              <div className="space-y-2 mt-4">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Attached Image</h4>
                <div className="relative group rounded-xl overflow-hidden border border-slate-200 inline-block">
                  <img src={task.attachment} alt="Task Attachment" className="max-h-64 object-contain bg-slate-900" />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button
                      type="button"
                      onClick={() => navigate(`/task/${task.id}/attachment`)}
                      className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg transition-transform hover:scale-110 flex items-center gap-2 font-bold text-sm"
                    >
                      <Eye size={16} /> View Full Screen
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline info fields */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 mt-4">
              <div className="flex items-center gap-3.5 bg-slate-50 p-3.5 rounded-2xl">
                <Calendar className="text-slate-400" size={20} />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Start Date</p>
                  <p className="text-sm font-bold text-slate-700 mt-0.5">{task.startDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3.5 bg-slate-50 p-3.5 rounded-2xl">
                <Clock className="text-slate-400" size={20} />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Due Date / Deadline</p>
                  <p className="text-sm font-bold text-slate-700 mt-0.5">{task.dueDate || "N/A"}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Comment input form */}
          <div className="bg-white border border-slate-200/50 rounded-[1.5rem] lg:rounded-3xl shadow-premium p-5 lg:p-8 space-y-4">
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <MessageSquarePlus size={18} className="text-slate-400" />
              <span>Add Progress Remarks</span>
            </h4>
            <form onSubmit={handleAddComment} className="flex gap-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 font-semibold"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all shadow-glow"
              >
                Send Note
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Assigned Employee & Timeline Activity */}
        <div className="space-y-8">

          {/* Assigned Employee Card */}
          <div className="bg-white border border-slate-200/50 rounded-[1.5rem] lg:rounded-3xl shadow-premium p-5 lg:p-6 space-y-6">
            
            {/* Assign To */}
            <div>
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <User size={14} /> Assigned To
              </h4>
              {assignedToEmp ? (
                <div className="flex items-center gap-4">
                  <img src={assignedToEmp.avatar} alt={assignedToEmp.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100" />
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-sm">{assignedToEmp.name}</h5>
                    <p className="text-xs font-bold text-slate-400 uppercase mt-0.5">{assignedToEmp.role}</p>
                  </div>
                </div>
              ) : (
                <div className="text-slate-400 italic text-xs font-bold">Unassigned</div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <User size={14} /> Assigned By
              </h4>
              {assignedByEmp ? (
                <div className="flex items-center gap-4">
                  <img src={assignedByEmp.avatar} alt={assignedByEmp.name} className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 opacity-80" />
                  <div>
                    <h5 className="font-bold text-slate-700 text-sm">{assignedByEmp.name}</h5>
                    <p className="text-xs font-semibold text-slate-400 uppercase mt-0.5">{assignedByEmp.role}</p>
                  </div>
                </div>
              ) : (
                <div className="text-slate-400 italic text-xs font-bold">Unknown</div>
              )}
            </div>
            
          </div>

          {/* Timeline Activity Widget */}
          <div className="bg-white border border-slate-200/50 rounded-[1.5rem] lg:rounded-3xl shadow-premium p-5 lg:p-6">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-1.5">
              <Activity size={14} /> Timeline Activity
            </h4>

            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
              {timeline.map((event, idx) => {
                let bulletBg = "bg-slate-200 ring-slate-100";
                if (event.type === "Created") bulletBg = "bg-blue-500 ring-blue-100";
                else if (event.type === "Status Change") bulletBg = "bg-amber-500 ring-amber-100";
                else if (event.type === "Assigned") bulletBg = "bg-purple-500 ring-purple-100";
                else if (event.type === "Comment") bulletBg = "bg-indigo-500 ring-indigo-100";

                return (
                  <div key={idx} className="relative text-xs">
                    <span className={`absolute left-[-21px] top-1 w-3 h-3 rounded-full ring-4 ${bulletBg} z-10`} />
                    <div className="flex flex-col gap-1 text-left">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-slate-800 text-xs">{event.type}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{event.date}</span>
                      </div>
                      <p className="text-slate-500 leading-relaxed font-semibold mt-0.5">{event.message}</p>
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
