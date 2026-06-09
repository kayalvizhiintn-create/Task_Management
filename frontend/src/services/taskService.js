import apiClient from './apiClient';
import { authService } from './authService';

export const taskService = {
  // --- ASYNC API ---
  async getAllTasks() {
    const response = await apiClient.get('/api/v1/task/get-all-tasks');
    return response.data;
  },
  async getAllUsers() {
    const response = await apiClient.get('/api/v1/user/get-all-users');
    const resData = response.data;
    const apiData = resData?.data || resData || [];
    
    try {
      const roles = await this.getMasterRoles();
      if (Array.isArray(apiData)) {
        apiData.forEach(u => {
          if (!u.role && u.roleId) {
            const r = roles.find(r => r.id === u.roleId || r.roleId === u.roleId);
            if (r) u.role = r.name;
          }
        });
      }
    } catch (e) {}

    return resData;
  },
  async getAllProjects() {
    const response = await apiClient.get('/api/v1/project/get-all-projects');
    return response.data;
  },
  async getTaskById(id) {
    const response = await apiClient.get(`/api/v1/task/get-task-by-id?id=${id}`);
    return response.data;
  },
  async createTask(data) {
    const response = await apiClient.post('/api/v1/task/create-task', data);
    return response.data;
  },
  async updateTask(data) {
    let payload = data;
    if (!(data instanceof FormData)) {
      payload = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
          payload.append(key, data[key]);
        }
      });
    }
    const response = await apiClient.put('/api/v1/task/update-task', payload);
    return response.data;
  },
  async deleteTask(id) {
    const response = await apiClient.delete(`/api/v1/task/delete-task?id=${id}`);
    return response.data;
  },

  // Auth
  login: (email, password) => authService.login(email, password),
  logout: () => authService.logout(),
  getCurrentUser: () => authService.getCurrentUser(),

  // Events
  async getEvents() {
    try {
      const emps = await this.getEmployees();
      const ids = emps.map(e => e.id);
      
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = String(today.getMonth() + 1).padStart(2, '0');

      return [
        { id: "e1", name: "Global Tech Summit", date: `${currentYear}-${currentMonth}-15`, description: "Annual conference on emerging software technologies.", location: "San Francisco, CA", attendeeIds: ids.slice(0, 2) },
        { id: "e2", name: "React India Conf", date: `${currentYear}-${currentMonth}-22`, description: "The largest React ecosystem event in India.", location: "Goa, India", attendeeIds: ids.slice(1, 3) },
        { id: "e3", name: "Cloud Native Meetup", date: `${currentYear}-${currentMonth}-10`, description: "Local meetup discussing the latest cloud trends.", location: "Chennai, India", attendeeIds: ids.slice(0, 1) },
        { id: "e4", name: "AI DevWorld", date: `${currentYear}-${currentMonth}-28`, description: "Exploring AI integrations in modern web applications.", location: "Virtual", attendeeIds: ids.slice(2, 5) },
      ];
    } catch (err) {
      return [];
    }
  },

  // Tasks
  async getTasks() {
    try {
      const res = await this.getAllTasks();
      let rawData = [];
      if (Array.isArray(res)) rawData = res;
      else if (res && res.data && Array.isArray(res.data)) rawData = res.data;
      else if (res && res.tasks && Array.isArray(res.tasks)) rawData = res.tasks;

      // Fetch masters for resolving names
      const [projects, depts, priorities, statuses, zones] = await Promise.all([
        this.getProjects(),
        this.getDepartments(),
        this.getPriorities(),
        this.getStatuses(),
        this.getZoneMaster()
      ]);

      return rawData.map(t => {
        const proj = projects.find(p => p.id === t.projectId || p.id === t.ProjectId);
        const dept = depts.find(d => d.id === t.deptId || d.id === t.DeptId);
        const prio = priorities.find(p => p.id === t.priorityId || p.id === t.PriorityId);
        const stat = statuses.find(s => s.id === t.statusId || s.id === t.StatusId);
        const zn = zones.find(z => z.id === t.zoneId || z.id === t.ZoneId);

        let mappedStatus = stat ? stat.name : "Task Create";
        const dDate = t.endDate || t.EndDate;
        if (dDate) {
          const isCompleted = ["completed", "done"].includes(mappedStatus.toLowerCase().trim());
          if (!isCompleted) {
            const dueDateObj = new Date(dDate);
            dueDateObj.setHours(0, 0, 0, 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (dueDateObj < today) {
              mappedStatus = "Delayed";
            }
          }
        }

        return {
          ...t,
          id: t.taskID || t.taskId || t.TaskId || t.id,
          name: t.taskName || t.TaskName || t.name,
          projectName: proj ? proj.name : "",
          department: dept ? dept.name : "",
          category: dept ? dept.name : "", 
          zone: zn ? zn.name : "",
          assignTo: t.assignedToBioId || t.AssignedToBioId,
          assignedBy: t.assignedByBioId || t.AssignedByBioId,
          priority: prio ? prio.name : "",
          status: mappedStatus,
          startDate: t.startDate || t.StartDate,
          dueDate: dDate,
          description: t.detailedDescription || t.DetailedDescription
        };
      });
    } catch (err) {
      console.error("API Error fetching tasks:", err);
      return [];
    }
  },
  async getTaskMaster() {
    try {
      const res = await apiClient.get('/api/v1/taskmaster/get-all-taskmasters');
      let data = [];
      if (Array.isArray(res.data)) data = res.data;
      else if (res.data && Array.isArray(res.data.data)) data = res.data.data;
      return data.map(t => ({ ...t, id: t.taskID || t.taskId || t.TaskId || t.id, name: t.taskName || t.TaskName || t.name }));
    } catch (err) {
      console.error("API Error fetching task master:", err);
      return [];
    }
  },

  // Employees
  async getEmployees() {
    return await this.fetchEmployeesAsync();
  },
  async fetchEmployeesAsync() {
    try {
      const res = await this.getAllUsers();
      let data = [];
      if (Array.isArray(res)) data = res;
      else if (res && res.data && Array.isArray(res.data)) data = res.data;
      else if (res && res.users && Array.isArray(res.users)) data = res.users;
      return data.map(u => ({ ...u, id: u.userId || u.UserId || u.id, name: u.userName || u.UserName || u.displayName || u.DisplayName || u.name }));
    } catch (err) {
      console.error("API Error fetching users:", err);
      return [];
    }
  },
  async addEmployee(data) {
    let roles = await this.getMasterRoles();
    let selectedRole = roles.find(r => r.name === data.role);
    let roleId = selectedRole ? selectedRole.id : 0;
    
    const payload = {
      displayName: data.name,
      bioId: parseInt(data.bioId, 10) || 0,
      roleId: roleId,
      password: data.password || "123456",
      avatar: data.avatar || "",
      email: data.email || "",
      mobileNumber: data.mobileNumber || "",
      location: data.location || data.place || ""
    };
    const res = await apiClient.post('/api/v1/user/create-user', payload);
    return res.data;
  },
  async getEmployeeById(id) {
    try {
      const res = await apiClient.get(`/api/v1/user/get-user-by-id?id=${id}`);
      let user = res.data?.data || res.data;
      if (user && !user.role && user.roleId) {
        const roles = await this.getMasterRoles();
        const r = roles.find(r => r.id === user.roleId || r.roleId === user.roleId);
        if (r) user.role = r.name;
      }
      return user;
    } catch (err) {
      console.error(err);
      return null;
    }
  },
  async updateEmployee(id, data) {
    let roles = await this.getMasterRoles();
    let selectedRole = roles.find(r => r.name === data.role);
    let roleId = selectedRole ? selectedRole.id : 0;
    
    const payload = {
      userId: parseInt(id, 10),
      displayName: data.name,
      bioId: parseInt(data.bioId, 10) || 0,
      roleId: roleId,
      password: data.password || "",
      avatar: data.avatar || "",
      email: data.email || "",
      mobileNumber: data.mobileNumber || "",
      location: data.location || data.place || ""
    };
    const res = await apiClient.put('/api/v1/user/update-user', payload);
    return res.data;
  },
  async deleteEmployee(id) {
    const res = await apiClient.delete(`/api/v1/user/delete-user?id=${id}`);
    return res.data;
  },

  // Master Data
  async getMasterRoles() {
    try {
      const res = await apiClient.get('/api/v1/role/get-all-roles');
      let data = [];
      if (Array.isArray(res.data)) data = res.data;
      else if (res.data && Array.isArray(res.data.data)) data = res.data.data;
      else if (res.data && Array.isArray(res.data.roles)) data = res.data.roles;

      return data.map(r => ({
        ...r,
        id: r._id || r.id || r.roleId || r.RoleId,
        name: r.name || r.roleName || r.role_name || r.RoleName
      }));
    } catch (err) {
      return [];
    }
  },
  async addMasterRole(name) {
    const res = await apiClient.post('/api/v1/role/create-role', { name, roleName: name });
    return res.data;
  },
  async updateMasterRole(id, newName) {
    const res = await apiClient.put('/api/v1/role/update-role', { id, _id: id, name: newName, roleName: newName });
    return res.data;
  },
  async deleteMasterRole(id) {
    const res = await apiClient.delete(`/api/v1/role/delete-role?id=${id}`);
    return res.data;
  },

  async getProjects() {
    try {
      const res = await this.getAllProjects();
      let data = [];
      if (Array.isArray(res)) data = res;
      else if (res && res.data && Array.isArray(res.data)) data = res.data;
      return data.map(p => ({ ...p, id: p.projectId || p.ProjectId || p.id, name: p.projectName || p.ProjectName || p.name }));
    } catch (err) {
      return [];
    }
  },

  // Other Mock Endpoints -> Stubs (Strict API)
  async getCategories() { return []; },
  async updateCategoryProgress(cat) { },
  async getActivities() { return []; },
  async addActivity(type, text) { },

  async getMasterLocations() {
    return JSON.parse(localStorage.getItem('navanala_locations') || '[]');
  },
  async addMasterLocation(name) {
    const locs = await this.getMasterLocations();
    const newLoc = { id: `loc-${Date.now()}`, name };
    locs.push(newLoc);
    localStorage.setItem('navanala_locations', JSON.stringify(locs));
    return newLoc;
  },
  async updateMasterLocation(id, newName) {
    const locs = await this.getMasterLocations();
    const idx = locs.findIndex(l => l.id === id);
    if (idx !== -1) {
      locs[idx].name = newName;
      localStorage.setItem('navanala_locations', JSON.stringify(locs));
    }
  },
  async deleteMasterLocation(id) {
    const locs = await this.getMasterLocations();
    const newLocs = locs.filter(l => l.id !== id);
    localStorage.setItem('navanala_locations', JSON.stringify(newLocs));
  },

  async getMasterMenus() { return []; },
  async getRolePrivileges() { return []; },
  async getLanguages() { return []; },
  async getFrameworks() { return []; },

  // Other entity fallbacks -> API
  async getDepartments() {
    try {
      const res = await apiClient.get('/api/v1/dpt/get-all-department');
      let data = [];
      if (Array.isArray(res.data)) data = res.data;
      else if (res.data && Array.isArray(res.data.data)) data = res.data.data;
      return data.map(d => ({ ...d, id: d.departmentId || d.DepartmentId || d.id, name: d.departmentName || d.DepartmentName || d.name }));
    } catch (err) { return []; }
  },
  async addDepartment(name) {
    await apiClient.post('/api/v1/dpt/create-department', { name, departmentName: name });
  },
  async getPriorities() {
    try {
      const res = await apiClient.get('/api/v1/priority/get-all-priorities');
      let data = [];
      if (Array.isArray(res.data)) data = res.data;
      else if (res.data && Array.isArray(res.data.data)) data = res.data.data;
      return data.map(p => ({ ...p, id: p.priorityId || p.PriorityId || p.id, name: p.priorityName || p.PriorityName || p.name }));
    } catch (err) { return []; }
  },
  async addPriority(name) {
    await apiClient.post('/api/v1/priority/create-priority', { name, priorityName: name });
  },
  async getStatuses() {
    try {
      const res = await apiClient.get('/api/v1/status/get-all-statuses');
      let data = [];
      if (Array.isArray(res.data)) data = res.data;
      else if (res.data && Array.isArray(res.data.data)) data = res.data.data;
      return data.map(s => ({ ...s, id: s.statusId || s.StatusId || s.id, name: s.statusName || s.StatusName || s.name }));
    } catch (err) { return []; }
  },
  async addStatus(name) {
    await apiClient.post('/api/v1/status/create-status', { name, statusName: name });
  },
  async addTaskMaster(name) {
    await apiClient.post('/api/v1/taskmaster/create-taskmaster', { name, taskName: name });
  },
  async updateTaskMaster(id, newName) {
    await apiClient.put('/api/v1/taskmaster/update-taskmaster', { taskId: id, taskName: newName });
  },
  async deleteTaskMaster(id) {
    await apiClient.delete(`/api/v1/taskmaster/delete-taskmaster?id=${id}`);
  },
  async getTaskFiles() {
    try {
      const res = await apiClient.get('/api/v1/task-file/get-all-task-files');
      let data = [];
      if (Array.isArray(res.data)) data = res.data;
      else if (res.data && res.data.data) data = res.data.data;
      return data;
    } catch (err) { return []; }
  },
  async addTaskFile(name) {
    await apiClient.post('/api/v1/task-file/create-task-file', { name, taskFileName: name });
  },
  async getTaskRoles() {
    return await this.getMasterRoles();
  },
  async addTaskRole(name) {
    await apiClient.post('/api/v1/role/create-role', { name, roleName: name });
  },
  async getUserMaster() {
    return await this.fetchEmployeesAsync();
  },
  async addUserMaster(name) {
    await apiClient.post('/api/v1/user/create-user', { name, userName: name });
  },
  async getZoneMaster() {
    try {
      const res = await apiClient.get('/api/v1/zone/get-all-zones');
      let data = [];
      if (Array.isArray(res.data)) data = res.data;
      else if (res.data && Array.isArray(res.data.data)) data = res.data.data;
      return data.map(z => ({ ...z, id: z.zoneId || z.ZoneId || z.id, name: z.zoneName || z.ZoneName || z.name }));
    } catch (err) { return []; }
  },
  async addZoneMaster(name) {
    await apiClient.post('/api/v1/zone/create-zone', { name, zoneName: name });
  }
};
