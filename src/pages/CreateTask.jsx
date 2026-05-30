import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { taskService } from "../services/taskService";
import {
  FilePlus,
  UserPlus,
  Calendar,
  FileText,
  Bookmark,
  ArrowLeft,
  CheckCircle2,
  LayoutGrid,
  Camera,
  Upload,
  X,
  Image as ImageIcon
} from "lucide-react";

export default function CreateTask() {
  const navigate = useNavigate();

  // Database options
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasksMaster, setTasksMaster] = useState([]);
  const [zones, setZones] = useState([]);
  const [statuses, setStatuses] = useState([]);

  // Form Fields State
  const [name, setName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [assignedBy, setAssignedBy] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("Task Created");
  const [startDate, setStartDate] = useState(new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16));
  const [dueDate, setDueDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [zone, setZone] = useState("Marketing");
  const [purchaseType, setPurchaseType] = useState("");
  const [hardwareDetails, setHardwareDetails] = useState({ what: "", use: "", need: "" });
  const [softwareDetails, setSoftwareDetails] = useState({ what: "", use: "", need: "" });
  const [department, setDepartment] = useState("");

  // Attachment & Camera State
  const [attachment, setAttachment] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);

  // Feedback State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const loadDependencies = async () => {
      try {
        let emps = await taskService.fetchEmployeesAsync();
        if (!Array.isArray(emps)) emps = [];
        const depts = taskService.getDepartments();
        const prios = taskService.getPriorities();
        const projs = taskService.getProjects();
        const tasks = taskService.getTaskMaster();
        const zns = taskService.getZoneMaster();
        const stats = taskService.getStatuses();
        
        setEmployees(emps);
        setDepartments(depts);
        setPriorities(prios);
        setProjects(projs);
        setTasksMaster(tasks);
        setZones(zns);
        setStatuses(stats);
        
        if (tasks.length > 0 && !name) setName(tasks[0].name);
        if (projs.length > 0 && !projectName) setProjectName(projs[0].name);
        if (zns.length > 0 && !zone) setZone(zns[0].name);
        if (stats.length > 0 && !status) setStatus(stats[0].name);
        
        // Set default department if none selected
        if (depts.length > 0 && !department) {
          setDepartment(depts[0].name);
        }
        
        // Set default priority if none selected
        if (prios.length > 0 && !priority) {
          setPriority(prios[0].name);
        }
        
        if (emps.length > 0) {
          setAssignedBy(emps[0].id);
          setAssignTo(emps[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadDependencies();
  }, []);

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setCameraStream(stream);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Unable to access the camera. Please check permissions.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg");
    setAttachment(dataUrl);
    stopCamera();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setAttachment(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const clearAttachment = () => {
    setAttachment(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name) {
      alert("Please fill in required fields: Task Name.");
      return;
    }

    const newTask = {
      name,
      projectName,
      category: department,
      description,
      assignedBy,
      assignTo,
      priority,
      status,
      startDate,
      dueDate,
      remarks,
      zone,
      purchaseType,
      hardwareDetails,
      softwareDetails,
      department
    };

    taskService.createTask(newTask);

    setToastMessage("Task successfully created & synchronized!");
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
      navigate("/tasks");
    }, 3000);
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    if (!name) {
      alert("Please enter a Task Name to save a draft.");
      return;
    }
    setToastMessage("Draft saved in temporary workspace!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="w-full space-y-4 lg:space-y-8 animate-fade-in pb-8 lg:pb-12">
      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 z-50 animate-slide-up">
          <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
          <span className="text-sm font-bold tracking-wide mr-6">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-5">
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-slate-900 hover:shadow-lg transition-all hover:scale-105"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Create New Task</h2>
          <p className="text-slate-500 font-medium mt-1">Configure parameters and assign responsibilities for your new objective.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/60 rounded-[1.5rem] lg:rounded-[2rem] shadow-2xl overflow-hidden relative">

        {/* Subtle top gradient */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-indigo-500 to-purple-500" />

        <div className="p-5 sm:p-6 lg:p-10 space-y-6 lg:space-y-12">

          {/* Section 1: Basic Information */}
          <div className="space-y-6">
            <h4 className="text-lg font-extrabold text-slate-900 flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <FileText size={18} />
              </div>
              <span>Task Details</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <span>Task Name</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary text-slate-700 appearance-none shadow-inner"
                    required
                  >
                    <option value="" disabled>Select Task Name</option>
                    {tasksMaster.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                    {name && !tasksMaster.find(t => t.name === name) && <option value={name}>{name}</option>}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <LayoutGrid size={16} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Project Name</label>
                <div className="relative">
                  <input
                    type="text"
                    list="create-project-names"
                    placeholder="Enter or select Project Name (Optional)"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary text-slate-700 shadow-inner"
                  />
                  <datalist id="create-project-names">
                    {projects.map(p => (
                      <option key={p.id} value={p.name} />
                    ))}
                  </datalist>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <LayoutGrid size={16} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Zone</label>
                <div className="relative">
                  <select
                    value={zone}
                    onChange={(e) => {
                      setZone(e.target.value);
                      if (e.target.value !== "Purchase") {
                        setPurchaseType("");
                      }
                    }}
                    className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary text-slate-700 appearance-none shadow-inner"
                  >
                    <option value="">Select Zone</option>
                    {zones.map(z => (
                      <option key={z.id} value={z.name}>{z.name}</option>
                    ))}
                    {zone && !zones.find(z => z.name === zone) && <option value={zone}>{zone}</option>}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <LayoutGrid size={16} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Department</label>
                <div className="relative">
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary text-slate-700 appearance-none shadow-inner"
                  >
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <LayoutGrid size={16} />
                  </div>
                </div>
              </div>

              {zone === "Purchase" && (
                <div className="md:col-span-2 space-y-4 p-5 border border-slate-200/80 rounded-2xl bg-white shadow-sm">
                  <label className="text-sm font-bold text-slate-700">Purchase Type</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="radio"
                        name="purchaseType"
                        value="Hardware"
                        checked={purchaseType === "Hardware"}
                        onChange={(e) => setPurchaseType(e.target.value)}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-bold text-slate-700">Hardware</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="radio"
                        name="purchaseType"
                        value="Software"
                        checked={purchaseType === "Software"}
                        onChange={(e) => setPurchaseType(e.target.value)}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-bold text-slate-700">Software</span>
                    </label>
                  </div>

                  {purchaseType === "Hardware" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700">What Hardware</label>
                        <input
                          type="text"
                          placeholder="e.g. Laptops"
                          value={hardwareDetails.what}
                          onChange={(e) => setHardwareDetails({ ...hardwareDetails, what: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700">Use</label>
                        <input
                          type="text"
                          placeholder="e.g. Office work"
                          value={hardwareDetails.use}
                          onChange={(e) => setHardwareDetails({ ...hardwareDetails, use: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700">Need</label>
                        <input
                          type="text"
                          placeholder="e.g. High performance"
                          value={hardwareDetails.need}
                          onChange={(e) => setHardwareDetails({ ...hardwareDetails, need: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 font-medium"
                        />
                      </div>
                    </div>
                  )}

                  {purchaseType === "Software" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700">What Software</label>
                        <input
                          type="text"
                          placeholder="e.g. Adobe Suite"
                          value={softwareDetails.what}
                          onChange={(e) => setSoftwareDetails({ ...softwareDetails, what: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700">Use</label>
                        <input
                          type="text"
                          placeholder="e.g. Design"
                          value={softwareDetails.use}
                          onChange={(e) => setSoftwareDetails({ ...softwareDetails, use: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700">Need</label>
                        <input
                          type="text"
                          placeholder="e.g. 5 licenses"
                          value={softwareDetails.need}
                          onChange={(e) => setSoftwareDetails({ ...softwareDetails, need: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 font-medium"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700">Detailed Description</label>
                <textarea
                  rows="4"
                  placeholder="Elaborate on the task details, desired outputs, references, and standard guidelines to assist the assignee..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-base focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary text-slate-800 font-medium placeholder:text-slate-400 shadow-inner resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Core Metrics & Assignee */}
          <div className="space-y-6">
            <h4 className="text-lg font-extrabold text-slate-900 flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500">
                <UserPlus size={18} />
              </div>
              <span>Assignment & Priority</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Assigned By</label>
                <select
                  value={assignedBy}
                  onChange={(e) => setAssignedBy(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-700 shadow-inner"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Assign To</label>
                <select
                  value={assignTo}
                  onChange={(e) => setAssignTo(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-700 shadow-inner"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 text-slate-700 shadow-inner"
                >
                  {priorities.map(prio => (
                    <option key={prio.id} value={prio.name}>{prio.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-slate-700 shadow-inner"
                >
                  <option value="Task Created">Task Created</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Timeframes & Remarks */}
          <div className="space-y-6">
            <h4 className="text-lg font-extrabold text-slate-900 flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                <Calendar size={18} />
              </div>
              <span>Timeframe & Notes</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Start Date</label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-slate-700 shadow-inner"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <span>Due Date</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-slate-700 shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Remarks / Side Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Requires coordination with QA team"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-base focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-slate-800 font-medium placeholder:text-slate-400 shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Attachments */}
          <div className="space-y-6">
            <h4 className="text-lg font-extrabold text-slate-900 flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                <ImageIcon size={18} />
              </div>
              <span>Attachments (Optional)</span>
            </h4>

            <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 shadow-inner">
              {attachment ? (
                <div className="relative group rounded-xl overflow-hidden border border-slate-200 inline-block">
                  <img src={attachment} alt="Task Attachment" className="max-h-64 object-contain bg-slate-900" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button
                      type="button"
                      onClick={clearAttachment}
                      className="p-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-lg transition-transform hover:scale-110 flex items-center gap-2 font-bold text-sm"
                    >
                      <X size={16} /> Remove Picture
                    </button>
                  </div>
                </div>
              ) : isCameraActive ? (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video max-w-2xl mx-auto shadow-xl">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-sm transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={captureSnapshot}
                      className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl text-sm shadow-lg flex items-center gap-2 transition-transform hover:-translate-y-0.5"
                    >
                      <Camera size={16} /> Take Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <label className="flex-1 flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-300 rounded-xl hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all w-full max-w-xs group">
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 group-hover:text-primary group-hover:scale-110 transition-all shadow-sm">
                      <Upload size={24} />
                    </div>
                    <span className="text-sm font-bold text-slate-600 group-hover:text-primary">Upload Picture</span>
                  </label>
                  <div className="text-slate-400 font-bold text-sm">OR</div>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="flex-1 flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-300 rounded-xl hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all w-full max-w-xs group"
                  >
                    <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 group-hover:text-indigo-500 group-hover:scale-110 transition-all shadow-sm">
                      <Camera size={24} />
                    </div>
                    <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-500">Take Photo</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-5 sm:px-6 lg:px-10 py-4 lg:py-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-slate-500 font-semibold flex items-center gap-2">
            <Bookmark size={16} />
            Data is securely stored
          </span>
          <div className="flex gap-4">
            <button
              onClick={handleSaveDraft}
              type="button"
              className="px-8 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold rounded-2xl text-sm transition-all shadow-sm hover:shadow"
            >
              Save Draft
            </button>
            <button
              type="submit"
              className="px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              <FilePlus size={18} />
              Publish Task
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
