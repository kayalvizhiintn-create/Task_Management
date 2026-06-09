import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { taskService } from "../services/taskService";
import TaskForum from "../components/TaskForum";
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
  const [employees, setEmployees] = useState([]);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    loadTaskDetails();
  }, [id]);

  async function loadTaskDetails() {
    try {
      const allTasks = await taskService.getTasks();
      let fetchedTask = (allTasks || []).find(t => t.id && t.id.toString() === id.toString());

      if (!fetchedTask) {
        const rawTaskRes = await taskService.getTaskById(id);
        const rawTask = rawTaskRes?.data || rawTaskRes;
        if (rawTask) {
          const [projects, depts, priorities, statuses, zones] = await Promise.all([
            taskService.getProjects(),
            taskService.getDepartments(),
            taskService.getPriorities(),
            taskService.getStatuses(),
            taskService.getZoneMaster()
          ]);
          fetchedTask = {
            id: rawTask.taskID || rawTask.taskId || rawTask.TaskId || rawTask.id,
            name: rawTask.taskName || rawTask.TaskName || rawTask.name,
            projectName: projects.find(p => p.id === (rawTask.projectId || rawTask.ProjectId))?.name || "",
            department: depts.find(d => d.id === (rawTask.deptId || rawTask.DeptId))?.name || "",
            zone: zones.find(z => z.id === (rawTask.zoneId || rawTask.ZoneId))?.name || "",
            assignTo: rawTask.assignedToBioId || rawTask.AssignedToBioId,
            assignedBy: rawTask.assignedByBioId || rawTask.AssignedByBioId,
            priority: priorities.find(p => p.id === (rawTask.priorityId || rawTask.PriorityId))?.name || "",
            status: statuses.find(s => s.id === (rawTask.statusId || rawTask.StatusId))?.name || "",
            startDate: rawTask.startDate || rawTask.StartDate,
            dueDate: rawTask.endDate || rawTask.EndDate || rawTask.dueDate,
            description: rawTask.detailedDescription || rawTask.DetailedDescription,
            category: depts.find(d => d.id === (rawTask.deptId || rawTask.DeptId))?.name || ""
          };
        }
      }

      if (!fetchedTask) {
        setTask(null);
        return;
      }
      
      setTask(fetchedTask);
      setTimeline(fetchedTask.timeline || []);

      const emps = await taskService.getEmployees();
      setEmployees(emps);
      setAssignedToEmp(emps.find(e => e.id === fetchedTask.assignTo || e.id === fetchedTask.assigneeId));
      setAssignedByEmp(emps.find(e => e.id === fetchedTask.assignedBy));
    } catch (err) {
      console.error("Error loading task details", err);
      setTask(null);
    }
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
  const handleMarkCompleted = async () => {
    try {
      const [projects, depts, priorities, statuses, zones] = await Promise.all([
        taskService.getProjects(),
        taskService.getDepartments(),
        taskService.getPriorities(),
        taskService.getStatuses(),
        taskService.getZoneMaster()
      ]);

      const completedStatus = statuses.find(s => s.name.toLowerCase() === "completed");
      
      // Attempt to resolve IDs from masters to ensure the payload is completely valid
      const proj = projects.find(p => p.name === task.projectName) || projects.find(p => p.id === task.projectId || p.id === task.ProjectId);
      const dept = depts.find(d => d.name === task.department) || depts.find(d => d.id === task.deptId || d.id === task.DeptId);
      const zn = zones.find(z => z.name === task.zone) || zones.find(z => z.id === task.zoneId || z.id === task.ZoneId);
      const pri = priorities.find(p => p.name === task.priority) || priorities.find(p => p.id === task.priorityId || p.id === task.PriorityId);

      if (completedStatus) {
        const finalData = {
          TaskID: task.id || task.taskId || task.TaskId,
          TaskName: task.name || task.taskName || task.TaskName,
          ProjectId: proj ? proj.id : (task.projectId || task.ProjectId || 0),
          DeptId: dept ? dept.id : (task.deptId || task.DeptId || null),
          ZoneId: zn ? zn.id : (task.zoneId || task.ZoneId || 0),
          DetailedDescription: task.description || task.detailedDescription || task.DetailedDescription || "",
          AssignedByBioId: task.assignedBy || task.assignedByBioId || task.AssignedByBioId || null,
          AssignedToBioId: task.assignTo || task.assignedToBioId || task.AssignedToBioId || null,
          PriorityId: pri ? pri.id : (task.priorityId || task.PriorityId || null),
          StatusId: completedStatus.id,
          StartDate: task.startDate || task.StartDate || null,
          EndDate: task.dueDate || task.endDate || task.EndDate || null,
          Remark: task.remarks || task.remark || task.Remark || ""
        };
        await taskService.updateTask(finalData);
      }
    } catch (err) {
      console.error("Error marking task as completed", err);
    }

    await loadTaskDetails();
    setShowCompletedModal(true);
  };

  // Comment logic moved to TaskForum component

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

          {/* Forum Component */}
          <TaskForum 
            currentUser={taskService.getCurrentUser()} 
            employees={employees} 
          />

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

      {showToast && (
        <div className="fixed bottom-8 right-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-2xl shadow-premium flex items-center gap-3 border border-slate-800 dark:border-slate-100 z-50 animate-slide-up">
          <div className="bg-emerald-500/20 p-1.5 rounded-full">
            <CheckCircle2 size={20} className="text-emerald-500" />
          </div>
          <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Completion Confirmation Modal */}
      {showCompletedModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-scale-up text-center border border-slate-200">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Task Completed!</h3>
            <p className="text-slate-500 font-medium mb-8"> Do you want to create a new task now?</p>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowCompletedModal(false);
                  alert("Task Completed successfully!");
                }}
                className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors"
              >
                No, Stay Here
              </button>
              <button
                onClick={() => {
                  setShowCompletedModal(false);
                  navigate("/create-task");
                }}
                className="flex-1 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all"
              >
                Yes, Create New
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
