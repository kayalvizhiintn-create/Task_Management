import apiClient from '../services/apiClient';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { departmentService } from "../services/departmentService";
import { priorityService } from "../services/priorityService";
import { projectService } from "../services/projectService";
import { statusService } from "../services/statusService";
import { taskFileService } from "../services/taskFileService";
import { taskRoleService } from "../services/taskRoleService";
import { userService } from "../services/userService";
import { zoneService } from "../services/zoneService";
import { taskService } from "../services/taskService";
import { mockService } from "../services/mockService";
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
  const initialEmpForm = { name: "", bioId: "", role: "", displayName: "", mobileNumber: "", email: "", password: "", img: "" };
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
      const res = await departmentService.getAllDepartments();
      const data = res.data || res;
      let items = Array.isArray(data) ? data : (data.data || []);
      const formatted = items.map(d => ({
        id: d._id || d.id || d.departmentId,
        name: d.name || d.departmentName || d.dpt_name || d.department_name || d.DepartmentName || "Unknown"
      })).filter(d => d.name);

      setDepartments(formatted);
    } catch (err) {
      console.error("Failed to fetch departments from API:", err);
    }
  };

  const fetchPrioritiesFromAPI = async () => {
    try {
      const res = await priorityService.getAllPriorities();
      const data = res.data || res;
      let items = Array.isArray(data) ? data : (data.data || []);
      const formatted = items.map(p => ({
        id: p._id || p.id || p.priorityId,
        name: p.name || p.priorityName || p.priority_name || p.PriorityName || "Unknown"
      })).filter(p => p.name);

      setPriorities(formatted);
    } catch (err) {
      console.error("Failed to fetch priorities from API:", err);
    }
  };

  const fetchStatusesFromAPI = async () => {
    try {
      const res = await apiClient.get('/api/v1/status/get-all-statuses');
      const data = res.data;

      let apiStatuses = [];
      if (Array.isArray(data)) apiStatuses = data;
      else if (data.data && Array.isArray(data.data)) apiStatuses = data.data;
      else if (data.statuses && Array.isArray(data.statuses)) apiStatuses = data.statuses;

      const formatted = apiStatuses.map(s => ({
        id: s._id || s.id || s.statusId,
        name: s.name || s.statusName || s.status_name || s.StatusName
      })).filter(s => s.name);

      setStatuses(formatted);
    } catch (err) {
      console.error("Failed to fetch statuses from API:", err);
    }
  };

  const fetchTasksMasterFromAPI = async () => {
    try {
      const res = await apiClient.get('/api/v1/taskmaster/get-all-taskmasters');
      const data = res.data;

      let apiTasks = [];
      if (Array.isArray(data)) apiTasks = data;
      else if (data.data && Array.isArray(data.data)) apiTasks = data.data;
      else if (data.tasks && Array.isArray(data.tasks)) apiTasks = data.tasks;

      const formatted = apiTasks.map(t => ({
        id: t._id || t.id || t.taskId,
        name: t.name || t.taskName || t.task_name || t.TaskName
      })).filter(t => t.name);

      setTasksMaster(formatted);
    } catch (err) {
      console.error("Failed to fetch task master from API:", err);
    }
  };

  const fetchTaskFilesFromAPI = async () => {
    try {
      const res = await apiClient.get('/api/v1/task-file/get-all-task-files');
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

      setTaskFiles(formatted);
    } catch (err) {
      console.error("Failed to fetch task files from API:", err);
    }
  };

  const fetchTaskRolesFromAPI = async () => {
    try {
      const res = await apiClient.get('/api/v1/role/get-all-roles');
      const data = res.data;

      let apiTaskRoles = [];
      if (Array.isArray(data)) apiTaskRoles = data;
      else if (data.data && Array.isArray(data.data)) apiTaskRoles = data.data;
      else if (data.roles && Array.isArray(data.roles)) apiTaskRoles = data.roles;

      const formatted = apiTaskRoles.map(tr => ({
        id: tr._id || tr.id || tr.roleId,
        name: tr.name || tr.roleName || tr.role_name || tr.RoleName || tr.taskRoleName
      })).filter(tr => tr.name);

      setTaskRoles(formatted);
    } catch (err) {
      console.error("Failed to fetch task roles from API:", err);
    }
  };

  const fetchUserMasterFromAPI = async () => {
    try {
      const res = await apiClient.get('/api/v1/user/get-all-users');
      const data = res.data;

      let apiUsers = [];
      if (Array.isArray(data)) apiUsers = data;
      else if (data.data && Array.isArray(data.data)) apiUsers = data.data;
      else if (data.users && Array.isArray(data.users)) apiUsers = data.users;

      const formatted = apiUsers.map(u => ({
        id: u._id || u.id || u.userId,
        name: u.name || u.userName || u.user_name || u.UserName || u.firstName || u.email
      })).filter(u => u.name);

      setUserMaster(formatted);
    } catch (err) {
      console.error("Failed to fetch user master from API:", err);
    }
  };

  const fetchZoneMasterFromAPI = async () => {
    try {
      const res = await apiClient.get('/api/v1/zone/get-all-zones');
      const data = res.data;

      let apiZones = [];
      if (Array.isArray(data)) apiZones = data;
      else if (data.data && Array.isArray(data.data)) apiZones = data.data;
      else if (data.zones && Array.isArray(data.zones)) apiZones = data.zones;

      const formatted = apiZones.map(z => ({
        id: z._id || z.id || z.zoneId,
        name: z.name || z.zoneName || z.zone_name || z.ZoneName
      })).filter(z => z.name);

      setZoneMaster(formatted);
    } catch (err) {
      console.error("Failed to fetch zone master from API:", err);
    }
  };

  const fetchProjectsFromAPI = async () => {
    try {
      const res = await apiClient.get('/api/v1/project/get-all-projects');
      const data = res.data;

      let apiProjects = [];
      if (Array.isArray(data)) apiProjects = data;
      else if (data.data && Array.isArray(data.data)) apiProjects = data.data;
      else if (data.projects && Array.isArray(data.projects)) apiProjects = data.projects;

      const formatted = apiProjects.map(p => {
        const name = p.name || p.projectName || p.project_name || p.ProjectName;

        return {
          id: p._id || p.id || p.projectId,
          name: name,
          description: p.description || "",
          environment: p.environment || "Indoor",
          bioIds: p.bioIds && p.bioIds.length > 0 ? p.bioIds : []
        };
      }).filter(p => p.name);

      setProjects(formatted);
    } catch (err) {
      console.error("Failed to fetch projects from API:", err);
    }
  };

  const loadData = async () => {
    const loadedRoles = await taskService.getMasterRoles();
    const loadedMenus = await taskService.getMasterMenus();
    setRoles(loadedRoles || []);
    setLocations(await taskService.getMasterLocations() || []);
    setStatuses(await taskService.getStatuses() || []);
    setTasksMaster(await taskService.getTaskMaster() || []);
    setTaskFiles(await taskService.getTaskFiles() || []);
    setTaskRoles(await taskService.getTaskRoles() || []);
    setUserMaster(await taskService.getUserMaster() || []);
    setZoneMaster(await taskService.getZoneMaster() || []);
    setAllTasks(await taskService.getTasks() || []);

    // Fetch departments and priorities from real API
    await fetchDepartmentsFromAPI();
    await fetchPrioritiesFromAPI();
    await fetchStatusesFromAPI();
    await fetchTasksMasterFromAPI();
    await fetchTaskFilesFromAPI();
    await fetchTaskRolesFromAPI();
    await fetchUserMasterFromAPI();
    await fetchZoneMasterFromAPI();

    try {
      const emps = await taskService.fetchEmployeesAsync();
      setEmployees(Array.isArray(emps) ? emps : []);
    } catch (err) {
      setEmployees([]);
    }

    setMenus(loadedMenus || []);
    setPrivileges(await taskService.getRolePrivileges() || []);

    await fetchProjectsFromAPI();
    setLanguages(await taskService.getLanguages() || []);
    setFrameworks(await taskService.getFrameworks() || []);

    if (loadedRoles && loadedRoles.length > 0 && !privRole) setPrivRole(loadedRoles[0].name);
    if (loadedMenus && loadedMenus.length > 0 && !privMenu) setPrivMenu(loadedMenus[0].id);
  };

  // --- Roles & Locations & Departments & Priorities ---
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    if (activeTab === "roles") {
      await taskService.addMasterRole(newItemName.trim());
      triggerToast("Role added successfully!");
    } else if (activeTab === "locations") {
      await taskService.addMasterLocation(newItemName.trim());
      triggerToast("Location added successfully!");
    } else if (activeTab === "departments") {
      try {
        await departmentService.createDepartment({ name: newItemName.trim(), departmentName: newItemName.trim(), dpt_name: newItemName.trim() });
        triggerToast("Department added successfully!");
      } catch (err) { console.error(err); alert("Failed to add department"); }
    } else if (activeTab === "statuses") {
      try {
        await statusService.createStatus({ name: newItemName.trim(), statusName: newItemName.trim(), status_name: newItemName.trim() });
        triggerToast("Status added successfully!");
      } catch (err) { console.error(err); alert("Failed to add status"); }
    } else if (activeTab === "task_master") {
      try {
        await taskService.addTaskMaster(newItemName.trim());
        triggerToast("Task added successfully!");
      } catch (err) { console.error(err); alert("Failed to add task"); }
    } else if (activeTab === "taskfile") {
      try {
        await taskFileService.createTaskFile({ name: newItemName.trim(), fileName: newItemName.trim(), file_name: newItemName.trim(), taskFileName: newItemName.trim() });
        triggerToast("Taskfile added successfully!");
      } catch (err) { console.error(err); alert("Failed to add taskfile"); }
    } else if (activeTab === "task_role") {
      try {
        await taskRoleService.createRole({ name: newItemName.trim(), roleName: newItemName.trim(), role_name: newItemName.trim() });
        triggerToast("TaskRole added successfully!");
      } catch (err) { console.error(err); alert("Failed to add task role"); }
    } else if (activeTab === "user_master") {
      try {
        await userService.createUser({ name: newItemName.trim(), userName: newItemName.trim(), user_name: newItemName.trim() });
        triggerToast("User added successfully!");
      } catch (err) { console.error(err); alert("Failed to add user"); }
    } else if (activeTab === "zone_master") {
      try {
        await zoneService.createZone({ name: newItemName.trim(), zoneName: newItemName.trim(), zone_name: newItemName.trim() });
        triggerToast("Zone added successfully!");
      } catch (err) { console.error(err); alert("Failed to add zone"); }
    } else if (activeTab === "priorities") {
      try {
        await priorityService.createPriority({ name: newItemName.trim(), priorityName: newItemName.trim(), priority_name: newItemName.trim() });
        triggerToast("Priority added successfully!");
      } catch (err) { console.error(err); alert("Failed to add priority"); }
    }

    setNewItemName("");
    loadData();
  };

  const handleEdit = async (item) => {
    setEditingId(item.id);
    setEditName(item.name); // Set initially for fast UI

    if (activeTab === "priorities") {
      try {
        const data = await priorityService.getPriorityById(item.id);
        const actualData = data?.data || data;
        if (actualData && (actualData.priorityName || actualData.name || actualData.priority_name)) {
          setEditName(actualData.priorityName || actualData.name || actualData.priority_name);
        }
      } catch (err) {
        console.error("Failed to fetch fresh priority data:", err);
      }
    } else if (activeTab === "departments") {
      try {
        const data = await departmentService.getDepartmentById(item.id);
        const actualData = data?.data || data;
        if (actualData && (actualData.departmentName || actualData.name || actualData.dpt_name)) {
          setEditName(actualData.departmentName || actualData.name || actualData.dpt_name);
        }
      } catch (err) {
        console.error("Failed to fetch fresh department data:", err);
      }
    } else if (activeTab === "statuses") {
      try {
        const data = await statusService.getStatusById(item.id);
        const actualData = data?.data || data;
        if (actualData && (actualData.statusName || actualData.name || actualData.status_name)) {
          setEditName(actualData.statusName || actualData.name || actualData.status_name);
        }
      } catch (err) {
        console.error("Failed to fetch fresh status data:", err);
      }
    } else if (activeTab === "task_master") {
      try {
        const data = await taskService.getTaskById(item.id);
        const actualData = data?.data || data;
        if (actualData && (actualData.taskName || actualData.name || actualData.task_name)) {
          setEditName(actualData.taskName || actualData.name || actualData.task_name);
        }
      } catch (err) {
        console.error("Failed to fetch fresh task data:", err);
      }
    } else if (activeTab === "taskfile") {
      try {
        const data = await taskFileService.getTaskFileById(item.id);
        const actualData = data?.data || data;
        if (actualData && (actualData.taskFileName || actualData.name || actualData.file_name || actualData.fileName)) {
          setEditName(actualData.taskFileName || actualData.name || actualData.file_name || actualData.fileName);
        }
      } catch (err) {
        console.error("Failed to fetch fresh taskfile data:", err);
      }
    } else if (activeTab === "task_role") {
      try {
        const data = await taskRoleService.getRoleById(item.id);
        const actualData = data?.data || data;
        if (actualData && (actualData.roleName || actualData.name || actualData.role_name)) {
          setEditName(actualData.roleName || actualData.name || actualData.role_name);
        }
      } catch (err) {
        console.error("Failed to fetch fresh task role data:", err);
      }
    } else if (activeTab === "user_master") {
      try {
        const data = await userService.getUserById(item.id);
        const actualData = data?.data || data;
        if (actualData && (actualData.userName || actualData.name || actualData.user_name)) {
          setEditName(actualData.userName || actualData.name || actualData.user_name);
        }
      } catch (err) {
        console.error("Failed to fetch fresh user data:", err);
      }
    } else if (activeTab === "zone_master") {
      try {
        const data = await zoneService.getZoneById(item.id);
        const actualData = data?.data || data;
        if (actualData && (actualData.zoneName || actualData.name || actualData.zone_name)) {
          setEditName(actualData.zoneName || actualData.name || actualData.zone_name);
        }
      } catch (err) {
        console.error("Failed to fetch fresh zone data:", err);
      }
    }
  };

  const handleSaveEdit = async () => {
    if (!editName.trim()) return;
    if (activeTab === "roles") {
      await taskService.updateMasterRole(editingId, editName.trim());
      triggerToast("Role updated successfully!");
    } else if (activeTab === "locations") {
      await taskService.updateMasterLocation(editingId, editName.trim());
      triggerToast("Location updated successfully!");
    } else if (activeTab === "departments") {
      try {
        await departmentService.updateDepartment({
          id: editingId,
          _id: editingId,
          name: editName.trim(),
          departmentName: editName.trim(),
          dpt_name: editName.trim()
        });
        triggerToast("Department updated successfully!");
        setEditingId(null);
        setEditName("");
        await fetchDepartmentsFromAPI();
        return;
      } catch (err) {
        console.error(err);
        alert("Failed to update department via API.");
      }
      // Fallback
      taskService.updateDepartment(editingId, editName.trim());
      triggerToast("Department updated locally!");
    } else if (activeTab === "statuses") {
      try {
        await statusService.updateStatus({
          id: editingId,
          _id: editingId,
          statusId: editingId,
          name: editName.trim(),
          statusName: editName.trim(),
          status_name: editName.trim()
        });
        triggerToast("Status updated successfully!");
        await fetchStatusesFromAPI();
        setEditingId(null);
        setEditName("");
        return;
      } catch (err) {
        console.error(err);
      }

      // Fallback
      taskService.updateStatus(editingId, editName.trim());
      triggerToast("Status updated locally!");
    } else if (activeTab === "task_master") {
      try {
        await taskService.updateTask({
          id: editingId,
          _id: editingId,
          taskId: editingId,
          name: editName.trim(),
          taskName: editName.trim(),
          task_name: editName.trim()
        });
        triggerToast("Task updated successfully!");
        await fetchTasksMasterFromAPI();
        setEditingId(null);
        setEditName("");
        return;
      } catch (err) {
        console.error(err);
      }

      // Fallback
      taskService.updateTaskMaster(editingId, editName.trim());
      triggerToast("Task Name updated locally!");
    } else if (activeTab === "taskfile") {
      try {
        await taskFileService.updateTaskFile({
          id: editingId,
          _id: editingId,
          taskFileId: editingId,
          name: editName.trim(),
          fileName: editName.trim(),
          file_name: editName.trim(),
          taskFileName: editName.trim()
        });
        triggerToast("Taskfile updated successfully!");
        await fetchTaskFilesFromAPI();
        setEditingId(null);
        setEditName("");
        return;
      } catch (err) {
        console.error(err);
      }

      // Fallback
      taskService.updateTaskFile(editingId, editName.trim());
      triggerToast("Taskfile updated locally!");
    } else if (activeTab === "task_role") {
      try {
        await taskRoleService.updateRole({
          id: editingId,
          _id: editingId,
          roleId: editingId,
          name: editName.trim(),
          roleName: editName.trim(),
          role_name: editName.trim()
        });
        triggerToast("TaskRole updated successfully!");
        await fetchTaskRolesFromAPI();
        setEditingId(null);
        setEditName("");
        return;
      } catch (err) {
        console.error(err);
      }

      // Fallback
      taskService.updateTaskRole(editingId, editName.trim());
      triggerToast("TaskRole updated locally!");
    } else if (activeTab === "user_master") {
      try {
        await userService.updateUser({
          id: editingId,
          _id: editingId,
          userId: editingId,
          name: editName.trim(),
          userName: editName.trim(),
          user_name: editName.trim()
        });
        triggerToast("User updated successfully!");
        await fetchUserMasterFromAPI();
        setEditingId(null);
        setEditName("");
        return;
      } catch (err) {
        console.error(err);
      }

      // Fallback
      taskService.updateUserMaster(editingId, editName.trim());
      triggerToast("User Master updated locally!");
    } else if (activeTab === "zone_master") {
      try {
        await zoneService.updateZone({
          id: editingId,
          _id: editingId,
          zoneId: editingId,
          name: editName.trim(),
          zoneName: editName.trim(),
          zone_name: editName.trim()
        });
        triggerToast("Zone updated successfully!");
        await fetchZoneMasterFromAPI();
        setEditingId(null);
        setEditName("");
        return;
      } catch (err) {
        console.error(err);
      }

      // Fallback
      taskService.updateZoneMaster(editingId, editName.trim());
      triggerToast("Zone Master updated locally!");
    } else if (activeTab === "priorities") {
      try {
        await priorityService.updatePriority({
          id: editingId,
          _id: editingId,
          priorityId: editingId,
          name: editName.trim(),
          priorityName: editName.trim(),
          priority_name: editName.trim()
        });
        triggerToast("Priority updated successfully!");
        setEditingId(null);
        setEditName("");
        await fetchPrioritiesFromAPI();
        return;
      } catch (err) {
        console.error(err);
        alert("Failed to update priority via API.");
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
      try {
        await taskService.deleteMasterRole(id);
        triggerToast("Role deleted successfully!");
      } catch (err) {
        console.error(err);
        alert("Failed to delete role");
      }
    } else if (activeTab === "locations") {
      taskService.deleteMasterLocation(id);
    } else if (activeTab === "departments") {
      try {
        await departmentService.deleteDepartment(id);
        triggerToast("Department deleted successfully!");
        await fetchDepartmentsFromAPI();
        return;
      } catch (err) {
        console.error(err);
        alert("API Delete failed. Falling back to local storage.");
        taskService.deleteDepartment(id);
      }
    } else if (activeTab === "statuses") {
      try {
        await statusService.deleteStatus(id);
        triggerToast("Status deleted successfully!");
        await fetchStatusesFromAPI();
        return;
      } catch (err) {
        console.error(err);
        alert("API Delete failed. Falling back to local storage.");
        taskService.deleteStatus(id);
      }
    } else if (activeTab === "task_master") {
      try {
        await taskService.deleteTaskMaster(id);
        triggerToast("Task deleted successfully!");
        await fetchTasksMasterFromAPI();
        return;
      } catch (err) {
        console.error(err);
        alert("API Delete failed. Falling back to local storage.");
        if (taskService.deleteTaskMaster) taskService.deleteTaskMaster(id);
      }
    } else if (activeTab === "taskfile") {
      try {
        await taskFileService.deleteTaskFile(id);
        triggerToast("Taskfile deleted successfully!");
        await fetchTaskFilesFromAPI();
        return;
      } catch (err) {
        console.error(err);
        alert("API Delete failed. Falling back to local storage.");
        if (taskService.deleteTaskFile) taskService.deleteTaskFile(id);
      }
    } else if (activeTab === "task_role") {
      try {
        await taskRoleService.deleteRole(id);
        triggerToast("TaskRole deleted successfully!");
        await fetchTaskRolesFromAPI();
        return;
      } catch (err) {
        console.error(err);
        alert("API Delete failed. Falling back to local storage.");
        if (taskService.deleteTaskRole) taskService.deleteTaskRole(id);
      }
    } else if (activeTab === "user_master") {
      try {
        await userService.deleteUser(id);
        triggerToast("User deleted successfully!");
        await fetchUserMasterFromAPI();
        return;
      } catch (err) {
        console.error(err);
        alert("API Delete failed. Falling back to local storage.");
        if (taskService.deleteUserMaster) taskService.deleteUserMaster(id);
      }
    } else if (activeTab === "zone_master") {
      try {
        await zoneService.deleteZone(id);
        triggerToast("Zone deleted successfully!");
        await fetchZoneMasterFromAPI();
        return;
      } catch (err) {
        console.error(err);
        alert("API Delete failed. Falling back to local storage.");
        if (taskService.deleteZoneMaster) taskService.deleteZoneMaster(id);
      }
    } else if (activeTab === "priorities") {
      try {
        await priorityService.deletePriority(id);
        triggerToast("Priority deleted successfully!");
        await fetchPrioritiesFromAPI();
        return;
      } catch (err) {
        console.error(err);
        alert("API Delete failed. Falling back to local storage.");
        taskService.deletePriority(id);
      }
    }
    loadData();
  };

  // --- Employee ---
  const handleEmpSubmit = async (e) => {
    e.preventDefault();
    const mobileRegex = /^\d{10}$/;
    if (!empForm.mobileNumber || !mobileRegex.test(empForm.mobileNumber.replace(/[\s-]/g, ''))) {
      alert("Mobile number must be exactly 10 digits.");
      return;
    }
    try {
      if (editingEmpId) {
        await taskService.updateEmployee(editingEmpId, { ...empForm, avatar: empForm.img });
        triggerToast("Employee updated successfully!");
      } else {
        await taskService.addEmployee({ ...empForm, avatar: empForm.img });
        triggerToast("Employee added successfully!");
      }
      setEmpForm(initialEmpForm);
      setEditingEmpId(null);
      loadData();
    } catch (err) {
      console.error("Error saving employee:", err);
      alert("Failed to save employee. Please try again. " + (err.response?.data?.message || err.message));
    }
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

  const deleteEmployee = async (id) => {
    if (!window.confirm("Delete employee?")) return;
    await taskService.deleteEmployee(id);
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
        await projectService.updateProject({
          id: editingProjectId,
          _id: editingProjectId,
          projectId: editingProjectId,
          name: projForm.name.trim(),
          projectName: projForm.name.trim(),
          description: projForm.description,
          environment: projForm.environment,
          bioIds: projForm.bioIds
        });
        triggerToast("Project updated successfully via API!");
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
        await projectService.createProject({
          name: projForm.name.trim(),
          projectName: projForm.name.trim(),
          description: projForm.description,
          environment: projForm.environment,
          bioIds: projForm.bioIds
        });
        triggerToast("Project added successfully via API!");
      } catch (err) {
        console.error("Failed to add project via API, falling back to local storage.", err);
        triggerToast("Project added locally!");
      }
    }

    await fetchProjectsFromAPI();
    loadData();
    setProjForm(initialProjForm);
  };

  const editProject = async (proj) => {
    setEditingProjectId(proj.id);

    // Set initially for fast UI
    setProjForm({
      name: proj.name,
      description: proj.description || "",
      environment: proj.environment || "Indoor",
      bioIds: proj.bioIds || []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const data = await projectService.getProjectById(proj.id);
      const actualData = data?.data || data;
      if (actualData) {
        setProjForm(prev => ({
          ...prev,
          name: actualData.projectName || actualData.name || prev.name,
          description: actualData.description !== undefined ? actualData.description : prev.description,
          environment: actualData.environment || prev.environment,
          bioIds: actualData.bioIds || prev.bioIds
        }));
      }
    } catch (err) {
      console.error("Failed to fetch fresh project data:", err);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    // Unconditionally delete locally so it doesn't get resurrected by fetchProjectsFromAPI
    taskService.deleteProject(id);

    try {
      await projectService.deleteProject(id);
      triggerToast("Project deleted via API!");
      await fetchProjectsFromAPI();
    } catch (err) {
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
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all duration-200 ${activeTab === tab.id
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
                    <input type="text" required autoComplete="off" value={empForm.name} onChange={e => setEmpForm({ ...empForm, name: e.target.value })} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Bio ID</label>
                    <input type="text" autoComplete="off" value={empForm.bioId} onChange={e => setEmpForm({ ...empForm, bioId: e.target.value })} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Role</label>
                    <select required value={empForm.role} onChange={e => setEmpForm({ ...empForm, role: e.target.value })} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 appearance-none">
                      <option value="" disabled>Select Role...</option>
                      {roles.map(r => (
                        <option key={r.id} value={r.name}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Display Name</label>
                    <input type="text" autoComplete="off" value={empForm.displayName} onChange={e => setEmpForm({ ...empForm, displayName: e.target.value })} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Mobile *</label>
                    <input type="text" required maxLength={10} autoComplete="off" value={empForm.mobileNumber} onChange={e => setEmpForm({ ...empForm, mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Email</label>
                    <input type="email" required autoComplete="off" value={empForm.email} onChange={e => setEmpForm({ ...empForm, email: e.target.value })} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Password</label>
                    <input type="password" required={!editingEmpId} autoComplete="new-password" value={empForm.password} onChange={e => setEmpForm({ ...empForm, password: e.target.value })} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Profile Photo</label>
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setEmpForm({ ...empForm, img: reader.result });
                        reader.readAsDataURL(file);
                      }
                    }} className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
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
                <select value={menuForm.parent} onChange={e => setMenuForm({ ...menuForm, parent: e.target.value })} className="px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold">
                  {parentMenuOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <input
                  type="text"
                  value={menuForm.child}
                  onChange={e => setMenuForm({ ...menuForm, child: e.target.value })}
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
                          onChange={e => setPrivPerms({ ...privPerms, [perm]: e.target.checked })}
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
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${projectTab === pt.id
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
                          onChange={e => setProjForm({ ...projForm, name: e.target.value })}
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
                            <input type="radio" name="env" value="Indoor" checked={projForm.environment === "Indoor"} onChange={e => setProjForm({ ...projForm, environment: e.target.value })} className="text-primary" />
                            Indoor
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-slate-700">
                            <input type="radio" name="env" value="Outdoor" checked={projForm.environment === "Outdoor"} onChange={e => setProjForm({ ...projForm, environment: e.target.value })} className="text-primary" />
                            Outdoor
                          </label>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-600 block mb-1">Project Description</label>
                        <textarea value={projForm.description} onChange={e => setProjForm({ ...projForm, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white" rows="2" />
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
                    <input type="text" value={langForm.name} onChange={e => setLangForm({ ...langForm, name: e.target.value })} className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold" />
                    <button type="submit" disabled={!langForm.name.trim()} className="px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold">Add Language</button>
                  </form>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {languages.map(l => (
                      <div key={l.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50">
                        <span className="font-bold text-slate-700">{l.name}</span>
                        <button onClick={() => { if (window.confirm("Are you sure you want to delete this language?")) { taskService.deleteLanguage(l.id); loadData(); } }} className="p-2 text-slate-400 hover:text-rose-500 bg-white rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Frameworks Sub-Tab */}
              {projectTab === "frameworks" && (
                <div className="space-y-8 animate-fade-in">
                  <form onSubmit={handleFrameworkSubmit} className="flex gap-4">
                    <input type="text" value={fwForm.name} onChange={e => setFwForm({ ...fwForm, name: e.target.value })} className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold" />
                    <button type="submit" disabled={!fwForm.name.trim()} className="px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold">Add Framework</button>
                  </form>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {frameworks.map(f => (
                      <div key={f.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50">
                        <span className="font-bold text-slate-700">{f.name}</span>
                        <button onClick={() => { if (window.confirm("Are you sure you want to delete this framework?")) { taskService.deleteFramework(f.id); loadData(); } }} className="p-2 text-slate-400 hover:text-rose-500 bg-white rounded-lg"><Trash2 size={16} /></button>
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
