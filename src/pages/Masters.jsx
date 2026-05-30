import React, { useState, useEffect } from "react";
import axios from "axios";
import { taskService } from "../services/taskService";
import { Shield, MapPin, Plus, Edit2, Trash2, Check, X, Users, Menu as MenuIcon, Lock, Briefcase, Code, FileCode2, Layers, CheckCircle2, Building, Flag } from "lucide-react";

export default function Masters() {
  const [activeTab, setActiveTab] = useState("roles");

  // Basic lists
  const [roles, setRoles] = useState([]);
  const [locations, setLocations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [tasksMaster, setTasksMaster] = useState([]);
  const [taskFiles, setTaskFiles] = useState([]);
  const [taskRoles, setTaskRoles] = useState([]);
  const [userMaster, setUserMaster] = useState([]);
  const [zoneMaster, setZoneMaster] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [menus, setMenus] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  
  // Project Master Lists
  const [projects, setProjects] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [frameworks, setFrameworks] = useState([]);

  // Shared form state for Roles & Locations
  const [newItemName, setNewItemName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  // Employee Form State
  const initialEmpForm = { name: "", bioId: "", role: "User", displayName: "", mobileNumber: "", email: "", password: "", img: "" };
  const [empForm, setEmpForm] = useState(initialEmpForm);
  const [editingEmpId, setEditingEmpId] = useState(null);

  // Menu Form State
  const parentMenuOptions = ["Dashboard", "Tasks", "Directory", "Reports", "Settings", "Profile", "Project"];
  const [menuForm, setMenuForm] = useState({ parent: parentMenuOptions[0], child: "" });

  // Privileges Form State
  const [privRole, setPrivRole] = useState("");
  const [privMenu, setPrivMenu] = useState("");
  const [privPerms, setPrivPerms] = useState({ view: false, create: false, update: false, delete: false });

  // Project Master Inner Tab State
  const [projectTab, setProjectTab] = useState("projects"); // "projects", "languages", "frameworks"

  // Project Form State
  const initialProjForm = { name: "", description: "", environment: "Indoor", bioIds: [] };
  const [projForm, setProjForm] = useState(initialProjForm);
  const [editingProjectId, setEditingProjectId] = useState(null);
  
  // Language Form State
  const [langForm, setLangForm] = useState({ name: "" });
  
  // Framework Form State
  const [fwForm, setFwForm] = useState({ name: "" });

  useEffect(() => {
    loadData();
  }, []);

  const fetchDepartmentsFromAPI = async () => {
    try {
      const res = await axios.get("http://192.23.2.19:1012/api/v1/dpt/get-all-department");
      const data = res.data;
      
      let apiDepts = [];
      if (Array.isArray(data)) apiDepts = data;
      else if (data.data && Array.isArray(data.data)) apiDepts = data.data;
      else if (data.departments && Array.isArray(data.departments)) apiDepts = data.departments;

      const formatted = apiDepts.map(d => ({
        id: d._id || d.id || d.departmentId,
        name: d.name || d.departmentName || d.dpt_name || d.department_name || d.DepartmentName
      })).filter(d => d.name);

      if (formatted.length > 0) {
        setDepartments(formatted);
        localStorage.setItem("navanala_departments", JSON.stringify(formatted));
      } else {
        setDepartments(taskService.getDepartments());
      }
    } catch (err) {
      console.error("Failed to fetch departments from API:", err);
      setDepartments(taskService.getDepartments());
    }
  };

  const fetchPrioritiesFromAPI = async () => {
    try {
      const res = await axios.get("http://192.23.2.19:1012/api/v1/priority/get-all-priorities");
      const data = res.data;
      
      let apiPriorities = [];
      if (Array.isArray(data)) apiPriorities = data;
      else if (data.data && Array.isArray(data.data)) apiPriorities = data.data;
      else if (data.priorities && Array.isArray(data.priorities)) apiPriorities = data.priorities;

      const formatted = apiPriorities.map(p => ({
        id: p._id || p.id || p.priorityId,
        name: p.name || p.priorityName || p.priority_name || p.PriorityName
      })).filter(p => p.name);

      if (formatted.length > 0) {
        setPriorities(formatted);
        localStorage.setItem("navanala_priorities", JSON.stringify(formatted));
      } else {
        setPriorities(taskService.getPriorities());
      }
    } catch (err) {
      console.error("Failed to fetch priorities from API:", err);
      setPriorities(taskService.getPriorities());
    }
  };

  const fetchStatusesFromAPI = async () => {
    try {
      const res = await axios.get("http://192.23.2.19:1012/api/v1/status/get-all-statuses");
      const data = res.data;
      
      let apiStatuses = [];
      if (Array.isArray(data)) apiStatuses = data;
      else if (data.data && Array.isArray(data.data)) apiStatuses = data.data;
      else if (data.statuses && Array.isArray(data.statuses)) apiStatuses = data.statuses;

      const formatted = apiStatuses.map(s => ({
        id: s._id || s.id || s.statusId,
        name: s.name || s.statusName || s.status_name || s.StatusName
      })).filter(s => s.name);

      if (formatted.length > 0) {
        setStatuses(formatted);
        localStorage.setItem("navanala_statuses", JSON.stringify(formatted));
      } else {
        setStatuses(taskService.getStatuses());
      }
    } catch (err) {
      console.error("Failed to fetch statuses from API:", err);
      setStatuses(taskService.getStatuses());
    }
  };

  const fetchTasksMasterFromAPI = async () => {
    try {
      const res = await axios.get("http://192.23.2.19:1012/api/v1/task/get-all-tasks");
      const data = res.data;
      
      let apiTasks = [];
      if (Array.isArray(data)) apiTasks = data;
      else if (data.data && Array.isArray(data.data)) apiTasks = data.data;
      else if (data.tasks && Array.isArray(data.tasks)) apiTasks = data.tasks;

      const formatted = apiTasks.map(t => ({
        id: t._id || t.id || t.taskId,
        name: t.name || t.taskName || t.task_name || t.TaskName
      })).filter(t => t.name);

      if (formatted.length > 0) {
        setTasksMaster(formatted);
        localStorage.setItem("navanala_task_master", JSON.stringify(formatted));
      } else {
        setTasksMaster(taskService.getTaskMaster());
      }
    } catch (err) {
      console.error("Failed to fetch task master from API:", err);
      setTasksMaster(taskService.getTaskMaster());
    }
  };

  const fetchTaskFilesFromAPI = async () => {
    try {
      const res = await axios.get("http://192.23.2.19:1012/api/v1/task-file/get-all-task-files");
      const data = res.data;
      
      let apiTaskFiles = [];
      if (Array.isArray(data)) apiTaskFiles = data;
      else if (data.data && Array.isArray(data.data)) apiTaskFiles = data.data;
      else if (data.taskFiles && Array.isArray(data.taskFiles)) apiTaskFiles = data.taskFiles;
      else if (data.files && Array.isArray(data.files)) apiTaskFiles = data.files;

      const formatted = apiTaskFiles.map(tf => ({
        id: tf._id || tf.id || tf.taskFileId,
        name: tf.name || tf.fileName || tf.file_name || tf.TaskFileName || tf.taskFileName
      })).filter(tf => tf.name);

      if (formatted.length > 0) {
        setTaskFiles(formatted);
        localStorage.setItem("navanala_taskfiles", JSON.stringify(formatted));
      } else {
        setTaskFiles(taskService.getTaskFiles());
      }
    } catch (err) {
      console.error("Failed to fetch task files from API:", err);
      setTaskFiles(taskService.getTaskFiles());
    }
  };

  const fetchTaskRolesFromAPI = async () => {
    try {
      const res = await axios.get("http://192.23.2.19:1012/api/v1/role/get-all-roles");
      const data = res.data;
      
      let apiTaskRoles = [];
      if (Array.isArray(data)) apiTaskRoles = data;
      else if (data.data && Array.isArray(data.data)) apiTaskRoles = data.data;
      else if (data.roles && Array.isArray(data.roles)) apiTaskRoles = data.roles;

      const formatted = apiTaskRoles.map(tr => ({
        id: tr._id || tr.id || tr.roleId,
        name: tr.name || tr.roleName || tr.role_name || tr.RoleName || tr.taskRoleName
      })).filter(tr => tr.name);

      if (formatted.length > 0) {
        setTaskRoles(formatted);
        localStorage.setItem("navanala_task_roles", JSON.stringify(formatted));
      } else {
        setTaskRoles(taskService.getTaskRoles());
      }
    } catch (err) {
      console.error("Failed to fetch task roles from API:", err);
      setTaskRoles(taskService.getTaskRoles());
    }
  };

  const fetchUserMasterFromAPI = async () => {
    try {
      const res = await axios.get("http://192.23.2.19:1012/api/v1/user/get-all-users");
      const data = res.data;
      
      let apiUsers = [];
      if (Array.isArray(data)) apiUsers = data;
      else if (data.data && Array.isArray(data.data)) apiUsers = data.data;
      else if (data.users && Array.isArray(data.users)) apiUsers = data.users;

      const formatted = apiUsers.map(u => ({
        id: u._id || u.id || u.userId,
        name: u.name || u.userName || u.user_name || u.UserName || u.firstName || u.email
      })).filter(u => u.name);

      if (formatted.length > 0) {
        setUserMaster(formatted);
        localStorage.setItem("navanala_user_master", JSON.stringify(formatted));
      } else {
        setUserMaster(taskService.getUserMaster());
      }
    } catch (err) {
      console.error("Failed to fetch user master from API:", err);
      setUserMaster(taskService.getUserMaster());
    }
  };

  const fetchZoneMasterFromAPI = async () => {
    try {
      const res = await axios.get("http://192.23.2.19:1012/api/v1/zone/get-all-zones");
      const data = res.data;
      
      let apiZones = [];
      if (Array.isArray(data)) apiZones = data;
      else if (data.data && Array.isArray(data.data)) apiZones = data.data;
      else if (data.zones && Array.isArray(data.zones)) apiZones = data.zones;

      const formatted = apiZones.map(z => ({
        id: z._id || z.id || z.zoneId,
        name: z.name || z.zoneName || z.zone_name || z.ZoneName
      })).filter(z => z.name);

      if (formatted.length > 0) {
        setZoneMaster(formatted);
        localStorage.setItem("navanala_zone_master", JSON.stringify(formatted));
      } else {
        setZoneMaster(taskService.getZoneMaster());
      }
    } catch (err) {
      console.error("Failed to fetch zone master from API:", err);
      setZoneMaster(taskService.getZoneMaster());
    }
  };

  const fetchProjectsFromAPI = async () => {
    try {
      const res = await axios.get("http://192.23.2.19:1012/api/v1/project/get-all-projects");
      const data = res.data;
      
      let apiProjects = [];
      if (Array.isArray(data)) apiProjects = data;
      else if (data.data && Array.isArray(data.data)) apiProjects = data.data;
      else if (data.projects && Array.isArray(data.projects)) apiProjects = data.projects;

      const localProjects = taskService.getProjects();

      const formatted = apiProjects.map(p => {
        const name = p.name || p.projectName || p.project_name || p.ProjectName;
        // Find existing local project by name to preserve bioIds
        const existingLocal = localProjects.find(lp => lp.name === name);
        
        return {
          id: p._id || p.id || p.projectId,
          name: name,
          description: p.description || existingLocal?.description || "",
          environment: p.environment || existingLocal?.environment || "Indoor",
          bioIds: p.bioIds && p.bioIds.length > 0 ? p.bioIds : (existingLocal?.bioIds || [])
        };
      }).filter(p => p.name);

      if (formatted.length > 0) {
        // Also include any local projects that aren't in the API response yet
        const apiNames = formatted.map(f => f.name.toLowerCase());
        const missingLocals = localProjects.filter(lp => !apiNames.includes(lp.name.toLowerCase()));
        const merged = [...formatted, ...missingLocals];
        
        setProjects(merged);
        localStorage.setItem("navanala_projects", JSON.stringify(merged));
      } else {
        setProjects(taskService.getProjects());
      }
    } catch (err) {
      console.error("Failed to fetch projects from API:", err);
      setProjects(taskService.getProjects());
    }
  };

  const loadData = async () => {
    const loadedRoles = taskService.getMasterRoles();
    const loadedMenus = taskService.getMasterMenus();
    setRoles(loadedRoles);
    setLocations(taskService.getMasterLocations());
    setStatuses(taskService.getStatuses());
    setTasksMaster(taskService.getTaskMaster());
    setTaskFiles(taskService.getTaskFiles());
    setTaskRoles(taskService.getTaskRoles());
    setUserMaster(taskService.getUserMaster());
    setZoneMaster(taskService.getZoneMaster());
    setAllTasks(taskService.getTasks());
    
    // Fetch departments and priorities from real API
    fetchDepartmentsFromAPI();
    fetchPrioritiesFromAPI();
    fetchStatusesFromAPI();
    fetchTasksMasterFromAPI();
    fetchTaskFilesFromAPI();
    fetchTaskRolesFromAPI();
    fetchUserMasterFromAPI();
    fetchZoneMasterFromAPI();
    
    try {
      const emps = await taskService.fetchEmployeesAsync();
      setEmployees(Array.isArray(emps) ? emps : []);
    } catch (err) {
      setEmployees([]);
    }
    
    setMenus(loadedMenus);
    setPrivileges(taskService.getRolePrivileges());
    
    fetchProjectsFromAPI();
    setLanguages(taskService.getLanguages());
    setFrameworks(taskService.getFrameworks());

    if (loadedRoles.length > 0 && !privRole) setPrivRole(loadedRoles[0].name);
    if (loadedMenus.length > 0 && !privMenu) setPrivMenu(loadedMenus[0].id);
  };

  // --- Roles & Locations & Departments & Priorities ---
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    if (activeTab === "roles") {
      const added = taskService.addMasterRole(newItemName.trim());
      if (!added) alert("Role already exists!");
      else triggerToast("Role added successfully!");
    } else if (activeTab === "locations") {
      const added = taskService.addMasterLocation(newItemName.trim());
      if (!added) alert("Location already exists!");
      else triggerToast("Location added successfully!");
    } else if (activeTab === "departments") {
      try {
        const res = await axios.post("http://192.23.2.19:1012/api/v1/dpt/create-department", { 
          name: newItemName.trim(), 
          departmentName: newItemName.trim(), 
          dpt_name: newItemName.trim() 
        });
        if (res.status === 200 || res.status === 201) {
          triggerToast("Department added successfully!");
          await fetchDepartmentsFromAPI();
          setNewItemName("");
        } else {
          alert("Failed to create department via API.");
        }
      } catch(err) {
        console.error(err);
        alert("Network error. Falling back to local storage.");
        taskService.addDepartment(newItemName.trim());
        triggerToast("Department added locally!");
      }
      setNewItemName("");
      loadData();
      return;
    } else if (activeTab === "statuses") {
      try {
        const res = await axios.post("http://192.23.2.19:1012/api/v1/status/create-status", { 
          name: newItemName.trim(), 
          statusName: newItemName.trim(),
          status_name: newItemName.trim()
        });
        if (res.status === 200 || res.status === 201) {
          triggerToast("Status added successfully!");
          await fetchStatusesFromAPI();
          setNewItemName("");
        } else {
          alert("Failed to create status via API.");
        }
      } catch(err) {
        console.error(err);
        alert("Network error. Falling back to local storage.");
        taskService.addStatus(newItemName.trim());
        triggerToast("Status added locally!");
      }
      setNewItemName("");
      loadData();
      return;
    } else if (activeTab === "task_master") {
      try {
        const res = await axios.post("http://192.23.2.19:1012/api/v1/task/create-task", { 
          name: newItemName.trim(), 
          taskName: newItemName.trim(),
          task_name: newItemName.trim()
        });
        if (res.status === 200 || res.status === 201) {
          triggerToast("Task added successfully!");
          await fetchTasksMasterFromAPI();
          setNewItemName("");
        } else {
          alert("Failed to create task via API.");
        }
      } catch(err) {
        console.error(err);
        alert("Network error. Falling back to local storage.");
        taskService.addTaskMaster(newItemName.trim());
        triggerToast("Task added locally!");
      }
      setNewItemName("");
      loadData();
      return;
    } else if (activeTab === "taskfile") {
      try {
        const res = await axios.post("http://192.23.2.19:1012/api/v1/task-file/create-task-file", { 
          name: newItemName.trim(), 
          fileName: newItemName.trim(),
          file_name: newItemName.trim(),
          taskFileName: newItemName.trim()
        });
        if (res.status === 200 || res.status === 201) {
          triggerToast("Taskfile added successfully!");
          await fetchTaskFilesFromAPI();
          setNewItemName("");
        } else {
          alert("Failed to create task file via API.");
        }
      } catch(err) {
        console.error(err);
        alert("Network error. Falling back to local storage.");
        taskService.addTaskFile(newItemName.trim());
        triggerToast("Taskfile added locally!");
      }
      setNewItemName("");
      loadData();
      return;
    } else if (activeTab === "task_role") {
      try {
        const res = await axios.post("http://192.23.2.19:1012/api/v1/role/create-role", { 
          name: newItemName.trim(), 
          roleName: newItemName.trim(),
          role_name: newItemName.trim()
        });
        if (res.status === 200 || res.status === 201) {
          triggerToast("TaskRole added successfully!");
          await fetchTaskRolesFromAPI();
          setNewItemName("");
        } else {
          alert("Failed to create task role via API.");
        }
      } catch(err) {
        console.error(err);
        alert("Network error. Falling back to local storage.");
        taskService.addTaskRole(newItemName.trim());
        triggerToast("TaskRole added locally!");
      }
      setNewItemName("");
      loadData();
      return;
    } else if (activeTab === "user_master") {
      try {
        const res = await axios.post("http://192.23.2.19:1012/api/v1/user/create-user", { 
          name: newItemName.trim(), 
          userName: newItemName.trim(),
          user_name: newItemName.trim()
        });
        if (res.status === 200 || res.status === 201) {
          triggerToast("User added successfully!");
          await fetchUserMasterFromAPI();
          setNewItemName("");
        } else {
          alert("Failed to create user via API.");
        }
      } catch(err) {
        console.error(err);
        alert("Network error. Falling back to local storage.");
        taskService.addUserMaster(newItemName.trim());
        triggerToast("User added locally!");
      }
      setNewItemName("");
      loadData();
      return;
    } else if (activeTab === "zone_master") {
      try {
        const res = await axios.post("http://192.23.2.19:1012/api/v1/zone/create-zone", { 
          name: newItemName.trim(), 
          zoneName: newItemName.trim(),
          zone_name: newItemName.trim()
        });
        if (res.status === 200 || res.status === 201) {
          triggerToast("Zone added successfully!");
          await fetchZoneMasterFromAPI();
          setNewItemName("");
        } else {
          alert("Failed to create zone via API.");
        }
      } catch(err) {
        console.error(err);
        alert("Network error. Falling back to local storage.");
        taskService.addZoneMaster(newItemName.trim());
        triggerToast("Zone added locally!");
      }
      setNewItemName("");
      loadData();
      return;
    } else if (activeTab === "priorities") {
      try {
        const res = await axios.post("http://192.23.2.19:1012/api/v1/priority/create-priority", { 
          name: newItemName.trim(), 
          priorityName: newItemName.trim(), 
          priority_name: newItemName.trim() 
        });
        if (res.status === 200 || res.status === 201) {
          triggerToast("Priority added successfully!");
          await fetchPrioritiesFromAPI();
          setNewItemName("");
        } else {
          alert("Failed to create priority via API.");
        }
      } catch(err) {
        console.error(err);
        alert("Network error. Falling back to local storage.");
        taskService.addPriority(newItemName.trim());
        triggerToast("Priority added locally!");
      }
      setNewItemName("");
      loadData();
      return;
    }
    setNewItemName("");
    loadData();
  };

  const handleEdit = async (item) => {
    setEditingId(item.id);
    setEditName(item.name); // Set initially for fast UI
    
    if (activeTab === "priorities") {
      try {
        let res = null;
        try {
          res = await axios.get(`http://192.23.2.19:1012/api/v1/priority/get-priority-by-id/${item.id}`);
        } catch(err) {
          res = await axios.get(`http://192.23.2.19:1012/api/v1/priority/get-priority-by-id`, { params: { priorityId: item.id } });
        }
        
        const data = res?.data?.data || res?.data;
        if (data && (data.priorityName || data.name || data.priority_name)) {
          setEditName(data.priorityName || data.name || data.priority_name);
        }
      } catch (err) {
        console.error("Failed to fetch fresh priority data:", err);
      }
    }
  };

  const handleSaveEdit = async () => {
    if (!editName.trim()) return;
    if (activeTab === "roles") {
      taskService.updateMasterRole(editingId, editName.trim());
      triggerToast("Role updated successfully!");
    } else if (activeTab === "locations") {
      taskService.updateMasterLocation(editingId, editName.trim());
      triggerToast("Location updated successfully!");
    } else if (activeTab === "departments") {
      try {
        const res = await axios.put("http://192.23.2.19:1012/api/v1/dpt/update-department", { 
          id: editingId, 
          _id: editingId, 
          name: editName.trim(), 
          departmentName: editName.trim(), 
          dpt_name: editName.trim() 
        });
        if (res.status === 200 || res.status === 204) {
          triggerToast("Department updated successfully!");
          setEditingId(null);
          setEditName("");
          await fetchDepartmentsFromAPI();
          return;
        } else {
          // If body PUT fails, some APIs expect id in query/path, so fallback to local:
          alert("Failed to update department via API.");
        }
      } catch (err) {
        console.error(err);
      }
      // Fallback
      taskService.updateDepartment(editingId, editName.trim());
      triggerToast("Department updated locally!");
    } else if (activeTab === "statuses") {
      try {
        const res = await axios.put("http://192.23.2.19:1012/api/v1/status/update-status", { 
          id: editingId, 
          _id: editingId,
          statusId: editingId,
          name: editName.trim(), 
          statusName: editName.trim(),
          status_name: editName.trim()
        });
        if (res.status === 200 || res.status === 204) {
          triggerToast("Status updated successfully!");
          await fetchStatusesFromAPI();
          setEditingId(null);
          setEditName("");
          return;
        }
      } catch (err) {}
      
      // Fallback
      taskService.updateStatus(editingId, editName.trim());
      triggerToast("Status updated locally!");
    } else if (activeTab === "task_master") {
      try {
        const res = await axios.put("http://192.23.2.19:1012/api/v1/task/update-task", { 
          id: editingId, 
          _id: editingId,
          taskId: editingId,
          name: editName.trim(), 
          taskName: editName.trim(),
          task_name: editName.trim()
        });
        if (res.status === 200 || res.status === 204) {
          triggerToast("Task updated successfully!");
          await fetchTasksMasterFromAPI();
          setEditingId(null);
          setEditName("");
          return;
        }
      } catch (err) {}
      
      // Fallback
      taskService.updateTaskMaster(editingId, editName.trim());
      triggerToast("Task Name updated locally!");
    } else if (activeTab === "taskfile") {
      try {
        const res = await axios.put("http://192.23.2.19:1012/api/v1/task-file/update-task-file", { 
          id: editingId, 
          _id: editingId,
          taskFileId: editingId,
          name: editName.trim(), 
          fileName: editName.trim(),
          file_name: editName.trim(),
          taskFileName: editName.trim()
        });
        if (res.status === 200 || res.status === 204) {
          triggerToast("Taskfile updated successfully!");
          await fetchTaskFilesFromAPI();
          setEditingId(null);
          setEditName("");
          return;
        }
      } catch (err) {}
      
      // Fallback
      taskService.updateTaskFile(editingId, editName.trim());
      triggerToast("Taskfile updated locally!");
    } else if (activeTab === "task_role") {
      try {
        const res = await axios.put("http://192.23.2.19:1012/api/v1/role/update-role", { 
          id: editingId, 
          _id: editingId,
          roleId: editingId,
          name: editName.trim(), 
          roleName: editName.trim(),
          role_name: editName.trim()
        });
        if (res.status === 200 || res.status === 204) {
          triggerToast("TaskRole updated successfully!");
          await fetchTaskRolesFromAPI();
          setEditingId(null);
          setEditName("");
          return;
        }
      } catch (err) {}
      
      // Fallback
      taskService.updateTaskRole(editingId, editName.trim());
      triggerToast("TaskRole updated locally!");
    } else if (activeTab === "user_master") {
      try {
        const res = await axios.put("http://192.23.2.19:1012/api/v1/user/update-user", { 
          id: editingId, 
          _id: editingId,
          userId: editingId,
          name: editName.trim(), 
          userName: editName.trim(),
          user_name: editName.trim()
        });
        if (res.status === 200 || res.status === 204) {
          triggerToast("User updated successfully!");
          await fetchUserMasterFromAPI();
          setEditingId(null);
          setEditName("");
          return;
        }
      } catch (err) {}
      
      // Fallback
      taskService.updateUserMaster(editingId, editName.trim());
      triggerToast("User Master updated locally!");
    } else if (activeTab === "zone_master") {
      try {
        const res = await axios.put("http://192.23.2.19:1012/api/v1/zone/update-zone", { 
          id: editingId, 
          _id: editingId,
          zoneId: editingId,
          name: editName.trim(), 
          zoneName: editName.trim(),
          zone_name: editName.trim()
        });
        if (res.status === 200 || res.status === 204) {
          triggerToast("Zone updated successfully!");
          await fetchZoneMasterFromAPI();
          setEditingId(null);
          setEditName("");
          return;
        }
      } catch (err) {}
      
      // Fallback
      taskService.updateZoneMaster(editingId, editName.trim());
      triggerToast("Zone Master updated locally!");
    } else if (activeTab === "priorities") {
      try {
        const res = await axios.put("http://192.23.2.19:1012/api/v1/priority/update-priority", { 
          id: editingId, 
          _id: editingId,
          priorityId: editingId,
          name: editName.trim(), 
          priorityName: editName.trim(), 
          priority_name: editName.trim() 
        });
        if (res.status === 200 || res.status === 204) {
          triggerToast("Priority updated successfully!");
          setEditingId(null);
          setEditName("");
          await fetchPrioritiesFromAPI();
          return;
        } else {
          alert("Failed to update priority via API.");
        }
      } catch (err) {
        console.error(err);
      }
      // Fallback
      taskService.updatePriority(editingId, editName.trim());
      triggerToast("Priority updated locally!");
    }
    setEditingId(null);
    setEditName("");
    loadData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    if (activeTab === "roles") {
      taskService.deleteMasterRole(id);
    } else if (activeTab === "locations") {
      taskService.deleteMasterLocation(id);
    } else if (activeTab === "departments") {
      let success = false;
      try {
        const res = await axios.delete(`http://192.23.2.19:1012/api/v1/dpt/delete-department/${id}`);
        if (res.status === 200 || res.status === 204) success = true;
      } catch (err) {}
      
      if (!success) {
        try {
          const res = await axios.delete(`http://192.23.2.19:1012/api/v1/dpt/delete-department`, { data: { id: id, _id: id } });
          if (res.status === 200 || res.status === 204) success = true;
        } catch (err) {}
      }

      if (success) {
        triggerToast("Department deleted successfully!");
        await fetchDepartmentsFromAPI();
        return;
      }
      
      alert("API Delete failed. Falling back to local storage.");
      taskService.deleteDepartment(id);
    } else if (activeTab === "statuses") {
      let success = false;
      try {
        const res = await axios.delete(`http://192.23.2.19:1012/api/v1/status/delete-status/${id}`);
        if (res.status === 200 || res.status === 204) success = true;
      } catch (err) {}
      
      if (!success) {
        try {
          const res = await axios.delete(`http://192.23.2.19:1012/api/v1/status/delete-status`, { data: { id: id, _id: id, statusId: id } });
          if (res.status === 200 || res.status === 204) success = true;
        } catch (err) {}
      }

      if (success) {
        triggerToast("Status deleted successfully!");
        await fetchStatusesFromAPI();
        return;
      }
      
      alert("API Delete failed. Falling back to local storage.");
      taskService.deleteStatus(id);
    } else if (activeTab === "task_master") {
      let success = false;
      try {
        const res = await axios.delete(`http://192.23.2.19:1012/api/v1/task/delete-task/${id}`);
        if (res.status === 200 || res.status === 204) success = true;
      } catch (err) {}
      
      if (!success) {
        try {
          const res = await axios.delete(`http://192.23.2.19:1012/api/v1/task/delete-task`, { data: { id: id, _id: id, taskId: id } });
          if (res.status === 200 || res.status === 204) success = true;
        } catch (err) {}
      }

      if (success) {
        triggerToast("Task deleted successfully!");
        await fetchTasksMasterFromAPI();
        return;
      }
      
      alert("API Delete failed. Falling back to local storage.");
      taskService.deleteTaskMaster(id);
    } else if (activeTab === "taskfile") {
      let success = false;
      try {
        const res = await axios.delete(`http://192.23.2.19:1012/api/v1/task-file/delete-task-file/${id}`);
        if (res.status === 200 || res.status === 204) success = true;
      } catch (err) {}
      
      if (!success) {
        try {
          const res = await axios.delete(`http://192.23.2.19:1012/api/v1/task-file/delete-task-file`, { data: { id: id, _id: id, taskFileId: id } });
          if (res.status === 200 || res.status === 204) success = true;
        } catch (err) {}
      }

      if (success) {
        triggerToast("Taskfile deleted successfully!");
        await fetchTaskFilesFromAPI();
        return;
      }
      
      alert("API Delete failed. Falling back to local storage.");
      taskService.deleteTaskFile(id);
    } else if (activeTab === "task_role") {
      let success = false;
      try {
        const res = await axios.delete(`http://192.23.2.19:1012/api/v1/role/delete-role/${id}`);
        if (res.status === 200 || res.status === 204) success = true;
      } catch (err) {}
      
      if (!success) {
        try {
          const res = await axios.delete(`http://192.23.2.19:1012/api/v1/role/delete-role`, { data: { id: id, _id: id, roleId: id } });
          if (res.status === 200 || res.status === 204) success = true;
        } catch (err) {}
      }

      if (success) {
        triggerToast("TaskRole deleted successfully!");
        await fetchTaskRolesFromAPI();
        return;
      }
      
      alert("API Delete failed. Falling back to local storage.");
      taskService.deleteTaskRole(id);
    } else if (activeTab === "user_master") {
      let success = false;
      try {
        const res = await axios.delete(`http://192.23.2.19:1012/api/v1/user/delete-user/${id}`);
        if (res.status === 200 || res.status === 204) success = true;
      } catch (err) {}
      
      if (!success) {
        try {
          const res = await axios.delete(`http://192.23.2.19:1012/api/v1/user/delete-user`, { data: { id: id, _id: id, userId: id } });
          if (res.status === 200 || res.status === 204) success = true;
        } catch (err) {}
      }

      if (success) {
        triggerToast("User deleted successfully!");
        await fetchUserMasterFromAPI();
        return;
      }
      
      alert("API Delete failed. Falling back to local storage.");
      taskService.deleteUserMaster(id);
    } else if (activeTab === "zone_master") {
      let success = false;
      try {
        const res = await axios.delete(`http://192.23.2.19:1012/api/v1/zone/delete-zone/${id}`);
        if (res.status === 200 || res.status === 204) success = true;
      } catch (err) {}
      
      if (!success) {
        try {
          const res = await axios.delete(`http://192.23.2.19:1012/api/v1/zone/delete-zone`, { data: { id: id, _id: id, zoneId: id } });
          if (res.status === 200 || res.status === 204) success = true;
        } catch (err) {}
      }

      if (success) {
        triggerToast("Zone deleted successfully!");
        await fetchZoneMasterFromAPI();
        return;
      }
      
      alert("API Delete failed. Falling back to local storage.");
      taskService.deleteZoneMaster(id);
    } else if (activeTab === "priorities") {
      let success = false;
      try {
        const res = await axios.delete(`http://192.23.2.19:1012/api/v1/priority/delete-priority/${id}`);
        if (res.status === 200 || res.status === 204) success = true;
      } catch (err) {}
      
      if (!success) {
        try {
          const res = await axios.delete(`http://192.23.2.19:1012/api/v1/priority/delete-priority`, { data: { id: id, _id: id, priorityId: id } });
          if (res.status === 200 || res.status === 204) success = true;
        } catch (err) {}
      }

      if (success) {
        triggerToast("Priority deleted successfully!");
        await fetchPrioritiesFromAPI();
        return;
      }
      
      alert("API Delete failed. Falling back to local storage.");
      taskService.deletePriority(id);
    }
    loadData();
  };

  // --- Employee ---
  const handleEmpSubmit = (e) => {
    e.preventDefault();
    if (editingEmpId) {
      taskService.updateEmployee(editingEmpId, empForm);
      triggerToast("Employee updated successfully!");
    } else {
      taskService.addEmployee(empForm);
      triggerToast("Employee added successfully!");
    }
    setEmpForm(initialEmpForm);
    setEditingEmpId(null);
    loadData();
  };

  const editEmployee = (emp) => {
    setEditingEmpId(emp.id);
    setEmpForm({
      name: emp.name,
      bioId: emp.bioId || "",
      role: emp.role,
      displayName: emp.displayName || "",
      mobileNumber: emp.mobileNumber || "",
      email: emp.email || "",
      password: "", 
      img: emp.avatar || ""
    });
  };

  const deleteEmployee = (id) => {
    if (!window.confirm("Delete employee?")) return;
    taskService.deleteEmployee(id);
    loadData();
  };

  // --- Menu ---
  const handleMenuSubmit = (e) => {
    e.preventDefault();
    if (!menuForm.child.trim()) return;
    const added = taskService.addMasterMenu(menuForm.parent, menuForm.child.trim());
    if (!added) alert("Menu already exists under this parent!");
    else triggerToast("Menu added successfully!");
    setMenuForm({ ...menuForm, child: "" });
    loadData();
  };

  const deleteMenu = (id) => {
    if (!window.confirm("Delete this menu?")) return;
    taskService.deleteMasterMenu(id);
    loadData();
  };

  // --- Privileges ---
  useEffect(() => {
    if (privRole && privMenu) {
      const existing = privileges.find(p => p.role === privRole && p.menuId === privMenu);
      if (existing) {
        setPrivPerms(existing.permissions);
      } else {
        setPrivPerms({ view: false, create: false, update: false, delete: false });
      }
    }
  }, [privRole, privMenu, privileges]);

  const savePrivileges = () => {
    taskService.saveRolePrivileges(privRole, privMenu, privPerms);
    triggerToast("Privileges saved successfully!");
    loadData();
  };

  // --- Project Master ---
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!projForm.name.trim()) return;
    
    if (editingProjectId) {
      taskService.updateProject(editingProjectId, projForm);
      try {
        const res = await axios.put("http://192.23.2.19:1012/api/v1/project/update-project", {
          id: editingProjectId,
          _id: editingProjectId,
          projectId: editingProjectId,
          name: projForm.name.trim(),
          projectName: projForm.name.trim(),
          description: projForm.description,
          environment: projForm.environment,
          bioIds: projForm.bioIds
        });
        if (res.status === 200 || res.status === 204) {
          triggerToast("Project updated successfully via API!");
        }
      } catch (err) {
        console.error("Failed to update project via API, falling back to local storage.", err);
        triggerToast("Project updated locally!");
      }
      setEditingProjectId(null);
    } else {
      const existing = taskService.getProjects().find(p => p.name.toLowerCase() === projForm.name.trim().toLowerCase());
      if (existing) {
        taskService.updateProject(existing.id, projForm);
      } else {
        taskService.addProject(projForm);
      }
      
      try {
        const res = await axios.post("http://192.23.2.19:1012/api/v1/project/create-project", {
          name: projForm.name.trim(),
          projectName: projForm.name.trim(),
          description: projForm.description,
          environment: projForm.environment,
          bioIds: projForm.bioIds
        });
        if (res.status === 200 || res.status === 201) {
          triggerToast("Project added successfully via API!");
        }
      } catch (err) {
        console.error("Failed to add project via API, falling back to local storage.", err);
        triggerToast("Project added locally!");
      }
    }
    
    await fetchProjectsFromAPI();
    loadData();
    setProjForm(initialProjForm);
  };

  const editProject = (proj) => {
    setEditingProjectId(proj.id);
    setProjForm({
      name: proj.name,
      description: proj.description || "",
      environment: proj.environment || "Indoor",
      bioIds: proj.bioIds || []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const deleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    // Unconditionally delete locally so it doesn't get resurrected by fetchProjectsFromAPI
    taskService.deleteProject(id);

    let success = false;
    try {
      const res = await axios.delete(`http://192.23.2.19:1012/api/v1/project/delete-project/${id}`);
      if (res.status === 200 || res.status === 204) success = true;
    } catch (err) {}
    
    if (!success) {
      try {
        const res = await axios.delete(`http://192.23.2.19:1012/api/v1/project/delete-project`, { data: { id, _id: id, projectId: id } });
        if (res.status === 200 || res.status === 204) success = true;
      } catch (err) {}
    }

    if (success) {
      triggerToast("Project deleted via API!");
      await fetchProjectsFromAPI();
    } else {
      triggerToast("Project deleted locally!");
    }
    loadData();
  };
  
  const handleBioIdToggle = (bioId) => {
    const current = projForm.bioIds;
    if (current.includes(bioId)) {
      setProjForm({ ...projForm, bioIds: current.filter(id => id !== bioId) });
    } else {
      setProjForm({ ...projForm, bioIds: [...current, bioId] });
    }
  };

  const handleLanguageSubmit = (e) => {
    e.preventDefault();
    if (!langForm.name.trim()) return;
    const added = taskService.addLanguage(langForm.name.trim());
    if (!added) alert("Language already exists!");
    else triggerToast("Language added successfully!");
    setLangForm({ name: "" });
    loadData();
  };

  const handleFrameworkSubmit = (e) => {
    e.preventDefault();
    if (!fwForm.name.trim()) return;
    const added = taskService.addFramework(fwForm.name.trim());
    if (!added) alert("Framework already exists!");
    else triggerToast("Framework added successfully!");
    setFwForm({ name: "" });
    loadData();
  };

  const currentList = activeTab === "roles" ? roles : activeTab === "locations" ? locations : activeTab === "departments" ? departments : activeTab === "statuses" ? statuses : activeTab === "task_master" ? tasksMaster : activeTab === "taskfile" ? taskFiles : activeTab === "task_role" ? taskRoles : activeTab === "user_master" ? userMaster : activeTab === "zone_master" ? zoneMaster : activeTab === "priorities" ? priorities : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-fade-in pb-8 lg:pb-12 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-2xl shadow-premium flex items-center gap-3 border border-slate-800 dark:border-slate-100 z-50 animate-slide-up">
          <div className="bg-emerald-500/20 p-1.5 rounded-full">
            <CheckCircle2 size={20} className="text-emerald-500" />
          </div>
          <div className="mr-6">
            <h4 className="text-sm font-bold">Success</h4>
            <p className="text-xs text-slate-350 dark:text-slate-650 font-semibold">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative overflow-hidden rounded-[1.5rem] lg:rounded-[2rem] bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-5 sm:p-6 lg:p-10 shadow-premium">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 dark:bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
        <div className="relative">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
            Master Data Management
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-semibold mt-2 text-sm max-w-lg leading-relaxed">
            Manage global data points, employees, menus, privileges, and projects across the platform.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-3">
          {[
            { id: "roles", label: "Roles", icon: Shield },
            { id: "locations", label: "Locations", icon: MapPin },
            { id: "departments", label: "Department Master", icon: Building },
            { id: "statuses", label: "Status Master", icon: CheckCircle2 },
            { id: "task_master", label: "Task Master", icon: CheckCircle2 },
            { id: "taskfile", label: "Taskfile Master", icon: CheckCircle2 },
            { id: "task_role", label: "TaskRole Master", icon: Shield },
            { id: "user_master", label: "User Master", icon: Users },
            { id: "zone_master", label: "Zone Master", icon: MapPin },
            { id: "priorities", label: "Priority Master", icon: Flag },
            { id: "employees", label: "Employee Master", icon: Users },
            { id: "menus", label: "Menu Master", icon: MenuIcon },
            { id: "privileges", label: "Privileges", icon: Lock },
            { id: "project_master", label: "Project Master", icon: Briefcase },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-[2rem] p-6 lg:p-8 shadow-sm">
          
          {/* Generic Master Tabs */}
          {(activeTab === "roles" || activeTab === "locations" || activeTab === "departments" || activeTab === "statuses" || activeTab === "task_master" || activeTab === "taskfile" || activeTab === "task_role" || activeTab === "user_master" || activeTab === "zone_master" || activeTab === "priorities") && (
            <>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6">
                {activeTab === "roles" ? "Manage Roles" : activeTab === "locations" ? "Manage Locations" : activeTab === "departments" ? "Manage Departments" : activeTab === "statuses" ? "Manage Statuses" : activeTab === "task_master" ? "Manage Task Master" : activeTab === "taskfile" ? "Manage Taskfile Master" : activeTab === "task_role" ? "Manage TaskRole Master" : activeTab === "user_master" ? "Manage User Master" : activeTab === "zone_master" ? "Manage Zone Master" : "Manage Priorities"}
              </h3>
              <form onSubmit={handleAdd} className="flex gap-4 mb-8">
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder={`Add new ${activeTab === "roles" ? "role" : activeTab === "locations" ? "location" : activeTab === "departments" ? "department" : activeTab === "statuses" ? "status" : activeTab === "task_master" ? "task name" : activeTab === "taskfile" ? "taskfile name" : activeTab === "task_role" ? "task role" : activeTab === "user_master" ? "user name" : activeTab === "zone_master" ? "zone name" : "priority"}...`}
                  className="flex-1 px-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-semibold transition-all"
                />
                <button
                  type="submit"
                  disabled={!newItemName.trim()}
                  className="px-6 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-sm font-extrabold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
                >
                  <Plus size={18} />
                  Add
                </button>
              </form>

              <div className="space-y-3">
                {currentList.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    {editingId === item.id ? (
                      <div className="flex-1 flex items-center gap-3">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white font-semibold"
                          autoFocus
                        />
                        <button onClick={handleSaveEdit} className="p-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors">
                          <Check size={18} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="font-bold text-slate-700 dark:text-slate-200">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {currentList.length === 0 && (
                  <p className="text-center text-slate-500 dark:text-slate-400 py-8 font-semibold text-sm">No items found.</p>
                )}
              </div>
            </>
          )}

          {/* Employee Master Tab */}
          {activeTab === "employees" && (
            <>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6">Employee Master</h3>
              
              <form onSubmit={handleEmpSubmit} className="space-y-4 mb-8 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Name</label>
                    <input type="text" required value={empForm.name} onChange={e => setEmpForm({...empForm, name: e.target.value})} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Bio ID</label>
                    <input type="text" value={empForm.bioId} onChange={e => setEmpForm({...empForm, bioId: e.target.value})} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Role</label>
                    <select value={empForm.role} onChange={e => setEmpForm({...empForm, role: e.target.value})} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 appearance-none">
                      <option value="Team Lead">Team Lead</option>
                      <option value="Manager">Manager</option>
                      <option value="Senior Developer">Senior Developer</option>
                      <option value="Junior Developer">Junior Developer</option>
                      <option value="User">User</option>
                      <option value="DevOps">DevOps</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Display Name</label>
                    <input type="text" value={empForm.displayName} onChange={e => setEmpForm({...empForm, displayName: e.target.value})} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Mobile</label>
                    <input type="text" value={empForm.mobileNumber} onChange={e => setEmpForm({...empForm, mobileNumber: e.target.value})} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Email</label>
                    <input type="email" required value={empForm.email} onChange={e => setEmpForm({...empForm, email: e.target.value})} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Password</label>
                    <input type="password" placeholder={editingEmpId ? "Leave blank to keep old password" : ""} required={!editingEmpId} value={empForm.password} onChange={e => setEmpForm({...empForm, password: e.target.value})} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Image URL</label>
                    <input type="text" value={empForm.img} onChange={e => setEmpForm({...empForm, img: e.target.value})} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  {editingEmpId && (
                    <button type="button" onClick={() => { setEditingEmpId(null); setEmpForm(initialEmpForm); }} className="px-5 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white rounded-xl font-bold">Cancel</button>
                  )}
                  <button type="submit" className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold flex items-center gap-2 shadow-lg">
                    {editingEmpId ? <Check size={16} /> : <Plus size={16} />}
                    {editingEmpId ? "Update Employee" : "Add Employee"}
                  </button>
                </div>
              </form>

              <div className="space-y-3">
                {employees.map((emp) => (
                  <div key={emp.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-4">
                      <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-full bg-slate-200" />
                      <div>
                        <div className="font-bold text-slate-800 dark:text-white">{emp.name}</div>
                        <div className="text-xs font-semibold text-slate-500">{emp.role} • {emp.email} • BioID: {emp.bioId || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editEmployee(emp)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg"><Edit2 size={16} /></button>
                      <button onClick={() => deleteEmployee(emp.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Menu Master Tab */}
          {activeTab === "menus" && (
            <>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6">Menu Master</h3>
              <form onSubmit={handleMenuSubmit} className="flex gap-4 mb-8">
                <select value={menuForm.parent} onChange={e => setMenuForm({...menuForm, parent: e.target.value})} className="px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold">
                  {parentMenuOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <input
                  type="text"
                  placeholder="Child menu name..."
                  value={menuForm.child}
                  onChange={e => setMenuForm({...menuForm, child: e.target.value})}
                  className="flex-1 px-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-semibold"
                />
                <button type="submit" disabled={!menuForm.child.trim()} className="px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold">Add Menu</button>
              </form>

              <div className="space-y-3">
                {menus.map((menu) => (
                  <div key={menu.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                    <span className="font-bold text-slate-700 dark:text-slate-200">{menu.parent} <span className="text-slate-400 mx-2">→</span> {menu.child}</span>
                    <button onClick={() => deleteMenu(menu.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                ))}
                {menus.length === 0 && <p className="text-center text-slate-500 py-8 text-sm">No menus found.</p>}
              </div>
            </>
          )}

          {/* Privileges Tab */}
          {activeTab === "privileges" && (
            <>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6">Role Privileges</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-bold text-slate-700 mb-2 block">Select Role</label>
                    <select value={privRole} onChange={e => setPrivRole(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold">
                      {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700 mb-2 block">Select Menu</label>
                    <select value={privMenu} onChange={e => setPrivMenu(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold">
                      {menus.map(m => <option key={m.id} value={m.id}>{m.parent} → {m.child}</option>)}
                    </select>
                  </div>
                </div>

                <div className="p-6 border border-slate-200 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <h4 className="font-bold text-slate-800 dark:text-white mb-4">Permissions</h4>
                  <div className="flex flex-wrap gap-6">
                    {["view", "create", "update", "delete"].map(perm => (
                      <label key={perm} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={privPerms[perm]}
                          onChange={e => setPrivPerms({...privPerms, [perm]: e.target.checked})}
                          className="w-5 h-5 text-primary rounded focus:ring-primary"
                        />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 capitalize group-hover:text-primary transition-colors">{perm}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button onClick={savePrivileges} disabled={!privRole || !privMenu} className="px-8 py-3.5 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                  Save Privileges
                </button>
              </div>
            </>
          )}

          {/* Project Master Tab */}
          {activeTab === "project_master" && (
            <div className="space-y-6">
              
              {/* Inner Tabs for Project Master */}
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
                {[
                  { id: "projects", label: "Projects", icon: Layers },
                  { id: "languages", label: "Language Master", icon: Code },
                  { id: "frameworks", label: "Framework Master", icon: FileCode2 },
                ].map(pt => (
                  <button
                    key={pt.id}
                    onClick={() => setProjectTab(pt.id)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                      projectTab === pt.id 
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg" 
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <pt.icon size={16} />
                    {pt.label}
                  </button>
                ))}
              </div>

              {/* Projects Sub-Tab */}
              {projectTab === "projects" && (
                <div className="space-y-8 animate-fade-in">
                  <form onSubmit={handleProjectSubmit} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                    <h4 className="font-extrabold text-slate-900 dark:text-white">Create Project</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1">Project Name</label>
                        <select 
                          required 
                          value={projForm.name} 
                          onChange={e => setProjForm({...projForm, name: e.target.value})} 
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white"
                        >
                          <option value="" disabled>Select Project Name</option>
                          {Array.from(new Set([
                            ...allTasks.map(t => t.projectName).filter(Boolean),
                            ...projects.map(p => p.name).filter(Boolean)
                          ])).map(pn => (
                            <option key={pn} value={pn}>{pn}</option>
                          ))}
                          {projForm.name && !Array.from(new Set([
                            ...allTasks.map(t => t.projectName).filter(Boolean),
                            ...projects.map(p => p.name).filter(Boolean)
                          ])).includes(projForm.name) && (
                            <option value={projForm.name}>{projForm.name}</option>
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1">Environment</label>
                        <div className="flex gap-4 mt-2">
                          <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-slate-700">
                            <input type="radio" name="env" value="Indoor" checked={projForm.environment === "Indoor"} onChange={e => setProjForm({...projForm, environment: e.target.value})} className="text-primary" />
                            Indoor
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-slate-700">
                            <input type="radio" name="env" value="Outdoor" checked={projForm.environment === "Outdoor"} onChange={e => setProjForm({...projForm, environment: e.target.value})} className="text-primary" />
                            Outdoor
                          </label>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-600 block mb-1">Project Description</label>
                        <textarea value={projForm.description} onChange={e => setProjForm({...projForm, description: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white" rows="2" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-600 block mb-2">Map BioIDs</label>
                        <div className="flex flex-wrap gap-3 bg-white p-4 rounded-xl border border-slate-200 max-h-40 overflow-y-auto">
                          {employees.filter(e => e.bioId).map(emp => (
                            <label key={emp.id} className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 hover:border-primary/30 transition-colors">
                              <input 
                                type="checkbox" 
                                checked={projForm.bioIds.includes(emp.bioId)}
                                onChange={() => handleBioIdToggle(emp.bioId)}
                                className="text-primary rounded"
                              />
                              <span className="text-sm font-semibold text-slate-700">{emp.bioId} ({emp.name})</span>
                            </label>
                          ))}
                          {employees.filter(e => e.bioId).length === 0 && <span className="text-sm text-slate-400">No employees with BioID found.</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      {editingProjectId && (
                        <button type="button" onClick={() => { setEditingProjectId(null); setProjForm(initialProjForm); }} className="px-5 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white rounded-xl font-bold">
                          Cancel
                        </button>
                      )}
                      <button type="submit" className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold flex items-center gap-2">
                        {editingProjectId ? <Check size={16} /> : <Plus size={16} />}
                        {editingProjectId ? "Update Project" : "Add Project"}
                      </button>
                    </div>
                  </form>

                  {/* Tables for Projects and BioIDs */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-800">Project List</div>
                      <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                        {projects.map(p => (
                          <div key={p.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                            <div>
                              <div className="font-bold text-slate-900">{p.name}</div>
                              <div className="text-xs font-semibold text-slate-500">{p.environment} • {p.bioIds.length} BioIDs</div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => editProject(p)} className="p-2 text-slate-400 hover:text-primary bg-slate-100 rounded-lg"><Edit2 size={16} /></button>
                              <button onClick={() => deleteProject(p.id)} className="p-2 text-slate-400 hover:text-rose-500 bg-slate-100 rounded-lg"><Trash2 size={16} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                      <div className="px-5 py-4 border-b border-slate-100 bg-indigo-50 font-bold text-indigo-900">Mapped BioIDs Table</div>
                      <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto p-4 space-y-4">
                        {projects.map(p => (
                          <div key={`bio-${p.id}`} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <h5 className="font-bold text-slate-800 mb-2 text-sm">Project: {p.name}</h5>
                            <div className="flex flex-wrap gap-2">
                              {p.bioIds.map(id => (
                                <span key={id} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm">
                                  {id}
                                </span>
                              ))}
                              {p.bioIds.length === 0 && <span className="text-xs font-semibold text-slate-400">None mapped</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Languages Sub-Tab */}
              {projectTab === "languages" && (
                <div className="space-y-8 animate-fade-in">
                  <form onSubmit={handleLanguageSubmit} className="flex gap-4">
                    <input type="text" placeholder="Language Name (e.g. Python)" value={langForm.name} onChange={e => setLangForm({...langForm, name: e.target.value})} className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold" />
                    <button type="submit" disabled={!langForm.name.trim()} className="px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold">Add Language</button>
                  </form>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {languages.map(l => (
                      <div key={l.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50">
                        <span className="font-bold text-slate-700">{l.name}</span>
                        <button onClick={() => { if(window.confirm("Are you sure you want to delete this language?")) { taskService.deleteLanguage(l.id); loadData(); } }} className="p-2 text-slate-400 hover:text-rose-500 bg-white rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Frameworks Sub-Tab */}
              {projectTab === "frameworks" && (
                <div className="space-y-8 animate-fade-in">
                  <form onSubmit={handleFrameworkSubmit} className="flex gap-4">
                    <input type="text" placeholder="Framework Name (e.g. React)" value={fwForm.name} onChange={e => setFwForm({...fwForm, name: e.target.value})} className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold" />
                    <button type="submit" disabled={!fwForm.name.trim()} className="px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold">Add Framework</button>
                  </form>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {frameworks.map(f => (
                      <div key={f.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50">
                        <span className="font-bold text-slate-700">{f.name}</span>
                        <button onClick={() => { if(window.confirm("Are you sure you want to delete this framework?")) { taskService.deleteFramework(f.id); loadData(); } }} className="p-2 text-slate-400 hover:text-rose-500 bg-white rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
