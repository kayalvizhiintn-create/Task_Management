// React SaaS Task Management Dashboard Mock Database Service
import axios from "axios";
const INITIAL_EMPLOYEES = [
  { id: "emp-1", name: "Emma Thompson", role: "Project Manager", email: "emma@company.com", password: "password123", avatar: "https://ui-avatars.com/api/?name=Emma+Thompson&background=random" },
  { id: "emp-2", name: "Michael Chen", role: "Senior Developer", email: "michael@company.com", password: "password123", avatar: "https://ui-avatars.com/api/?name=Michael+Chen&background=random" },
  { id: "emp-3", name: "Priya Patel", role: "UI/UX Designer", email: "priya@company.com", password: "password123", avatar: "https://ui-avatars.com/api/?name=Priya+Patel&background=random" },
  { id: "emp-4", name: "James Wilson", role: "QA Engineer", email: "james@company.com", password: "password123", avatar: "https://ui-avatars.com/api/?name=James+Wilson&background=random" },
  { id: "emp-5", name: "Sofia Rodriguez", role: "Content Specialist", email: "sofia@company.com", password: "password123", avatar: "https://ui-avatars.com/api/?name=Sofia+Rodriguez&background=random" }
];

// const INITIAL_CATEGORIES = [
//   { id: "cat-1", name: "Branding Identity", progress: 75 },
//   { id: "cat-2", name: "Legal", progress: 40 },
//   { id: "cat-3", name: "Marketing", progress: 90 },
//   { id: "cat-4", name: "HR", progress: 60 },
//   { id: "cat-5", name: "Finance", progress: 25 },
//   { id: "cat-6", name: "Engineering", progress: 65 }
// ];

const INITIAL_TASKS = [
  {
    id: "task-101",
    name: "Design Brand Guidelines for Q3 Launch",
    category: "Branding Identity",
    assigneeId: "emp-3", // Priya Patel
    priority: "High",
    status: "In Progress",
    startDate: "2026-05-18",
    dueDate: "2026-05-24",
    description: "Create the full visual assets, logo variations, typography definitions, and color schemas for the upcoming product launch.",
    remarks: "Currently reviewing typography options.",
    timeline: [
      { date: "2026-05-18", type: "Created", message: "Task created by System" },
      { date: "2026-05-18", type: "Assigned", message: "Task assigned to Priya Patel" },
      { date: "2026-05-19", type: "Status Change", message: "Status changed from Pending to In Progress" }
    ]
  },
  {
    id: "task-102",
    name: "Review SaaS Terms of Service & Privacy Policy",
    category: "Legal",
    assigneeId: "emp-1", // Emma Thompson
    priority: "High",
    status: "Pending",
    startDate: "2026-05-19",
    dueDate: "2026-05-22",
    description: "Perform comprehensive legal review of the draft terms of service, privacy policy, and developer API agreements.",
    remarks: "Needs direct legal sign-off from executive group.",
    timeline: [
      { date: "2026-05-19", type: "Created", message: "Task created by System" },
      { date: "2026-05-19", type: "Assigned", message: "Task assigned to Emma Thompson" }
    ]
  },
  {
    id: "task-103",
    name: "Launch Google Ads & Retargeting Campaign",
    category: "Marketing",
    assigneeId: "emp-5", // Sofia Rodriguez
    priority: "Medium",
    status: "Completed",
    startDate: "2026-05-10",
    dueDate: "2026-05-17",
    description: "Setup and launch PPC campaigns targetting cloud architecture teams and enterprise decision-makers.",
    remarks: "Exceeded click-through-rate targets by 15%. All key banners active.",
    timeline: [
      { date: "2026-05-10", type: "Created", message: "Task created by System" },
      { date: "2026-05-10", type: "Assigned", message: "Task assigned to Sofia Rodriguez" },
      { date: "2026-05-12", type: "Status Change", message: "Status changed to In Progress" },
      { date: "2026-05-17", type: "Status Change", message: "Status changed to Completed" }
    ]
  },
  {
    id: "task-104",
    name: "Conduct Engineering Performance Reviews",
    category: "HR",
    assigneeId: "emp-1", // Emma Thompson
    priority: "Medium",
    status: "In Progress",
    startDate: "2026-05-15",
    dueDate: "2026-05-20",
    description: "Annual career alignment reviews, team alignment surveys, and goal setting for our frontend & backend engineers.",
    remarks: "3/5 reviews finished. High engagement observed.",
    timeline: [
      { date: "2026-05-15", type: "Created", message: "Task created by System" },
      { date: "2026-05-15", type: "Assigned", message: "Task assigned to Emma Thompson" },
      { date: "2026-05-16", type: "Status Change", message: "Status changed to In Progress" }
    ]
  },
  {
    id: "task-105",
    name: "Q2 Financial Budget Allocation & Audits",
    category: "Finance",
    assigneeId: "emp-4", // James Wilson
    priority: "Low",
    status: "Hold",
    startDate: "2026-05-12",
    dueDate: "2026-05-30",
    description: "Detailed audit and breakdown of cloud infrastructure costs, software licensing, and operational expenses across divisions.",
    remarks: "Waiting on invoices from primary SaaS suppliers.",
    timeline: [
      { date: "2026-05-12", type: "Created", message: "Task created by System" },
      { date: "2026-05-12", type: "Assigned", message: "Task assigned to James Wilson" },
      { date: "2026-05-14", type: "Status Change", message: "Status changed to Hold" }
    ]
  },
  {
    id: "task-106",
    name: "Setup End-to-End Cypress Testing Suite",
    category: "Engineering",
    assigneeId: "emp-4", // James Wilson
    priority: "High",
    status: "In Progress",
    startDate: "2026-05-16",
    dueDate: "2026-05-21",
    description: "Create fully automated integration tests for authenticated dashboards, task creation, and settings panel configurations.",
    remarks: "Basic authentication flows are covered.",
    timeline: [
      { date: "2026-05-16", type: "Created", message: "Task created by System" },
      { date: "2026-05-16", type: "Assigned", message: "Task assigned to James Wilson" },
      { date: "2026-05-17", type: "Status Change", message: "Status changed to In Progress" }
    ]
  }
];

const INITIAL_ACTIVITIES = [
  { id: "act-1", time: "2 hours ago", type: "assign", text: "Task assigned: 'Review SaaS Terms of Service' assigned to Emma Thompson" },
  { id: "act-2", time: "4 hours ago", type: "complete", text: "Task completed: 'Launch Google Ads Campaign' completed by Sofia Rodriguez" },
  { id: "act-3", time: "1 day ago", type: "timeline", text: "Deadline updated: 'Setup End-to-End Cypress Testing Suite' extended to 21 May" },
  { id: "act-4", time: "2 days ago", type: "create", text: "Task created: 'Design Brand Guidelines for Q3 Launch' added to Branding Identity" }
];

// Helper to initialize localStorage
const initDB = () => {
  // Only set initial data if they do not exist, preventing data loss on page refresh
  if (!localStorage.getItem("navanala_employees")) {
    localStorage.setItem("navanala_employees", JSON.stringify(INITIAL_EMPLOYEES));
  }
  if (!localStorage.getItem("navanala_categories")) {
    localStorage.setItem("navanala_categories", JSON.stringify([]));
  }
  if (!localStorage.getItem("navanala_tasks")) {
    localStorage.setItem("navanala_tasks", JSON.stringify(INITIAL_TASKS));
  }
  if (!localStorage.getItem("navanala_activities")) {
    localStorage.setItem("navanala_activities", JSON.stringify(INITIAL_ACTIVITIES));
  }

  // --- Master Data Initialization ---
  // Overwrite local storage to sync with Privileges if it has the old default roles
  const currentRoles = localStorage.getItem("navanala_master_roles");
  if (!currentRoles || currentRoles.includes("Project Manager")) {
    const defaultRoles = [
      { id: "role-1", name: "Admin" },
      { id: "role-2", name: "User" },
      { id: "role-3", name: "manager" },
      { id: "role-4", name: "supervisor" },
      { id: "role-5", name: "Gm" },
      { id: "role-6", name: "TeamLeader" },
      { id: "role-7", name: "developer" },
      { id: "role-8", name: "vp" }
    ];
    localStorage.setItem("navanala_master_roles", JSON.stringify(defaultRoles));
  }

  if (!localStorage.getItem("navanala_master_locations")) {
    const defaultLocations = [
      { id: "loc-1", name: "Remote" },
      { id: "loc-2", name: "New York" },
      { id: "loc-3", name: "London" },
      { id: "loc-4", name: "Chennai" },
      { id: "loc-5", name: "Bangalore" }
    ];
    localStorage.setItem("navanala_master_locations", JSON.stringify(defaultLocations));
  }

  if (!localStorage.getItem("navanala_master_menus")) {
    const defaultMenus = [
      { id: "menu-1", parent: "Dashboard", child: "Overview" },
      { id: "menu-2", parent: "Tasks", child: "Task List" },
      { id: "menu-3", parent: "Directory", child: "Employees" }
    ];
    localStorage.setItem("navanala_master_menus", JSON.stringify(defaultMenus));
  }

  if (!localStorage.getItem("navanala_role_privileges")) {
    localStorage.setItem("navanala_role_privileges", JSON.stringify([]));
  }

  if (!localStorage.getItem("navanala_projects")) {
    localStorage.setItem("navanala_projects", JSON.stringify([]));
  }

  if (!localStorage.getItem("navanala_languages")) {
    localStorage.setItem("navanala_languages", JSON.stringify([]));
  }

  if (!localStorage.getItem("navanala_frameworks")) {
    const defaultFrameworks = [
      { id: "fw-1", name: "MVC" },
      { id: "fw-2", name: "Flask" },
      { id: "fw-3", name: "Django" },
      { id: "fw-4", name: "FastAPI" },
      { id: "fw-5", name: "Laravel" }
    ];
    localStorage.setItem("navanala_frameworks", JSON.stringify(defaultFrameworks));
  }

  if (!localStorage.getItem("navanala_priorities")) {
    const defaultPriorities = [
      { id: "prio-1", name: "High" },
      { id: "prio-2", name: "Medium" },
      { id: "prio-3", name: "Low" }
    ];
    localStorage.setItem("navanala_priorities", JSON.stringify(defaultPriorities));
  }

  if (!localStorage.getItem("navanala_statuses")) {
    const defaultStatuses = [
      { id: "status-1", name: "Pending" },
      { id: "status-2", name: "In Progress" },
      { id: "status-3", name: "Testing" },
      { id: "status-4", name: "Hold" },
      { id: "status-5", name: "Completed" }
    ];
    localStorage.setItem("navanala_statuses", JSON.stringify(defaultStatuses));
  }

  if (!localStorage.getItem("navanala_task_master")) {
    const defaultTaskMaster = [
      { id: "tm-1", name: "Design UI" },
      { id: "tm-2", name: "Backend Development" },
      { id: "tm-3", name: "Testing" }
    ];
    localStorage.setItem("navanala_task_master", JSON.stringify(defaultTaskMaster));
  }

  if (!localStorage.getItem("navanala_taskfiles")) {
    const defaultTaskFiles = [
      { id: "tf-1", name: "Documentation.pdf" },
      { id: "tf-2", name: "DesignAssets.zip" }
    ];
    localStorage.setItem("navanala_taskfiles", JSON.stringify(defaultTaskFiles));
  }

  if (!localStorage.getItem("navanala_task_roles")) {
    const defaultTaskRoles = [
      { id: "tr-1", name: "Tester" },
      { id: "tr-2", name: "Developer" },
      { id: "tr-3", name: "Reviewer" }
    ];
    localStorage.setItem("navanala_task_roles", JSON.stringify(defaultTaskRoles));
  }

  if (!localStorage.getItem("navanala_user_master")) {
    const defaultUserMaster = [
      { id: "um-1", name: "Internal User" },
      { id: "um-2", name: "External Client" }
    ];
    localStorage.setItem("navanala_user_master", JSON.stringify(defaultUserMaster));
  }

  if (!localStorage.getItem("navanala_zone_master")) {
    const defaultZoneMaster = [
      { id: "zm-1", name: "North Zone" },
      { id: "zm-2", name: "South Zone" }
    ];
    localStorage.setItem("navanala_zone_master", JSON.stringify(defaultZoneMaster));
  }

  if (!localStorage.getItem("navanala_currentUser")) {
    // Session is initially null, forcing Login page
    localStorage.removeItem("navanala_currentUser");
  }
};

// Initialize
initDB();

export const taskService = {
  // --- AUTH SERVICES ---
  login(email, password) {
    const employees = this.getEmployees();

    // Check for specific admin account first
    if (email.toLowerCase() === "kayal@gmail.com") {
      if (password !== "12345678") {
        throw new Error("Invalid admin password");
      }

      let adminUser = employees.find(e => e.email.toLowerCase() === email.toLowerCase());
      if (!adminUser) {
        adminUser = {
          id: `emp-admin`,
          name: "Kayal Admin",
          role: "Admin",
          email: "kayal@gmail.com",
          password: "12345678",
          avatar: `https://ui-avatars.com/api/?name=Kayal+Admin&background=random`
        };
        employees.push(adminUser);
        localStorage.setItem("navanala_employees", JSON.stringify(employees));
      } else {
        // Ensure role is Admin
        adminUser.role = "Admin";
        localStorage.setItem("navanala_employees", JSON.stringify(employees));
      }

      localStorage.setItem("navanala_currentUser", JSON.stringify(adminUser));
      this.addActivity("login", `Admin logged in: ${adminUser.name}`);
      return adminUser;
    }

    // Check normal employees
    const matchedEmployee = employees.find(e => e.email.toLowerCase() === email.toLowerCase());

    if (!matchedEmployee) {
      throw new Error("Invalid credentials. Account not found.");
    }

    if (matchedEmployee.password !== password) {
      throw new Error("Invalid password.");
    }

    localStorage.setItem("navanala_currentUser", JSON.stringify(matchedEmployee));
    this.addActivity("login", `User logged in: ${matchedEmployee.name} (${matchedEmployee.role})`);
    return matchedEmployee;
  },

  logout() {
    const user = this.getCurrentUser();
    if (user) {
      this.addActivity("logout", `User logged out: ${user.name}`);
    }
    localStorage.removeItem("navanala_currentUser");
  },

  getCurrentUser() {
    const user = localStorage.getItem("navanala_currentUser");
    return user ? JSON.parse(user) : null;
  },

  // --- TASK CRUD ---
  getTasks() {
    const tasks = localStorage.getItem("navanala_tasks");
    return tasks ? JSON.parse(tasks) : [];
  },

  getTaskById(id) {
    const tasks = this.getTasks();
    return tasks.find(t => t.id === id) || null;
  },

  async fetchTasksMasterAsync() {
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
        // Merge with local ones
        const localTasks = this.getTaskMaster();
        const apiNames = formatted.map(f => f.name.toLowerCase());
        const missingLocals = localTasks.filter(lt => !apiNames.includes(lt.name.toLowerCase()));
        const merged = [...formatted, ...missingLocals];
        
        localStorage.setItem("navanala_task_master", JSON.stringify(merged));
        return merged;
      }
    } catch (err) {
      console.error("API Fetch Tasks Master failed:", err);
    }
    return this.getTaskMaster();
  },

  createTask(taskData) {
    const tasks = this.getTasks();
    const employees = this.getEmployees();
    const newId = `task-${Date.now()}`;
    const assignee = employees.find(e => e.id === (taskData.assigneeId || taskData.assignTo));

    const newTask = {
      ...taskData,
      id: newId,
      name: taskData.name,
      category: taskData.category || taskData.department,
      assigneeId: taskData.assigneeId || taskData.assignTo,
      assignTo: taskData.assignTo || taskData.assigneeId,
      priority: taskData.priority || "Medium",
      status: taskData.status || "Pending",
      startDate: taskData.startDate || new Date().toISOString().split("T")[0],
      dueDate: taskData.dueDate,
      description: taskData.description || "",
      remarks: taskData.remarks || "",
      timeline: [
        { date: new Date().toISOString().split("T")[0], type: "Created", message: "Task created by System" },
        { date: new Date().toISOString().split("T")[0], type: "Assigned", message: `Task assigned to ${assignee ? assignee.name : "Unassigned"}` }
      ]
    };

    tasks.unshift(newTask);
    localStorage.setItem("navanala_tasks", JSON.stringify(tasks));
    this.addActivity("create", `Task created: '${newTask.name}' assigned to ${assignee ? assignee.name : "Unassigned"}`);

    // Update category progress randomly or incrementally
    this.updateCategoryProgress(taskData.category);

    return newTask;
  },

  updateTask(id, updatedData) {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    const oldTask = tasks[index];
    const newTimeline = [...oldTask.timeline];
    const today = new Date().toISOString().split("T")[0];

    // Log changes to activity and task timeline
    if (oldTask.status !== updatedData.status) {
      newTimeline.push({ date: today, type: "Status Change", message: `Status changed from ${oldTask.status} to ${updatedData.status}` });
      this.addActivity("complete", `Task updated: '${oldTask.name}' marked as ${updatedData.status}`);
    }

    if (oldTask.assigneeId !== updatedData.assigneeId) {
      const employees = this.getEmployees();
      const newAssignee = employees.find(e => e.id === updatedData.assigneeId);
      newTimeline.push({ date: today, type: "Assigned", message: `Reassigned to ${newAssignee ? newAssignee.name : "Unassigned"}` });
      this.addActivity("assign", `Task reassigned: '${oldTask.name}' reassigned to ${newAssignee ? newAssignee.name : "Unassigned"}`);
    }

    tasks[index] = {
      ...oldTask,
      ...updatedData,
      timeline: newTimeline
    };

    localStorage.setItem("navanala_tasks", JSON.stringify(tasks));

    // Update category progress
    this.updateCategoryProgress(oldTask.category);
    if (oldTask.category !== updatedData.category) {
      this.updateCategoryProgress(updatedData.category);
    }

    return tasks[index];
  },

  deleteTask(id) {
    const tasks = this.getTasks();
    const taskToDelete = tasks.find(t => t.id === id);
    if (!taskToDelete) return false;

    const filtered = tasks.filter(t => t.id !== id);
    localStorage.setItem("navanala_tasks", JSON.stringify(filtered));
    this.addActivity("delete", `Task deleted: '${taskToDelete.name}' has been deleted`);
    this.updateCategoryProgress(taskToDelete.category);
    return true;
  },

  // --- EMPLOYEE & CATEGORIES ---
  getEmployees() {
    const employees = localStorage.getItem("navanala_employees");
    return employees ? JSON.parse(employees) : [];
  },

  async fetchEmployeesAsync() {
    try {
      const res = await axios.get("http://192.23.2.19:1012/api/v1/employee/get-all-employees");
      const data = res.data;
      let apiEmps = Array.isArray(data) ? data : (data.data || data.employees || []);
      const formatted = apiEmps.map(e => ({
        id: e._id || e.id || e.employeeId,
        name: e.name || e.employeeName || "New Employee",
        displayName: e.displayName || e.name || "New Employee",
        role: e.role || "Team Member",
        email: e.email || "",
        place: e.place || "",
        bioId: e.bioId || "",
        password: e.password || "password123",
        aadharNumber: e.aadharNumber || "",
        mobileNumber: e.mobileNumber || "",
        avatar: e.avatar || e.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(e.name || "New Employee")}&background=random`
      }));
      if (formatted.length > 0) {
        localStorage.setItem("navanala_employees", JSON.stringify(formatted));
        return formatted;
      }
    } catch(err) {
      console.error("API Fetch Employees failed:", err);
    }
    return this.getEmployees();
  },

  async addEmployee(employeeData) {
    try {
      const res = await axios.post("http://192.23.2.19:1012/api/v1/employee/create-employee", employeeData);
      if (res.status === 200 || res.status === 201) {
        this.addActivity("create", `New employee added via API: ${employeeData.name}`);
        // Refresh local cache via API
        await this.getEmployees();
        return res.data;
      }
    } catch(err) {
      console.error("API Add Employee failed:", err);
    }
    
    // Fallback
    const employees = this.getEmployees();
    const newEmployee = {
      id: `emp-${Date.now()}`,
      name: employeeData.name || "New Employee",
      displayName: employeeData.displayName || employeeData.name || "New Employee",
      role: employeeData.role || "Team Member",
      email: employeeData.email || "",
      place: employeeData.place || "",
      bioId: employeeData.bioId || "",
      password: employeeData.password || "password123", // Default if not provided
      aadharNumber: employeeData.aadharNumber || "",
      mobileNumber: employeeData.mobileNumber || "",
      avatar: employeeData.avatar || employeeData.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(employeeData.name || "New Employee")}&background=random`
    };
    employees.push(newEmployee);
    localStorage.setItem("navanala_employees", JSON.stringify(employees));
    this.addActivity("create", `New employee added locally: ${newEmployee.name}`);
    return newEmployee;
  },

  async updateEmployee(id, data) {
    try {
      const res = await axios.put("http://192.23.2.19:1012/api/v1/employee/update-employee", { id, _id: id, employeeId: id, ...data });
      if (res.status === 200 || res.status === 204) {
        this.addActivity("update", `Employee profile updated via API`);
        await this.getEmployees();
        return res.data;
      }
    } catch(err) {
      console.error("API Update Employee failed:", err);
    }

    // Fallback
    const employees = this.getEmployees();
    const index = employees.findIndex(e => e.id === id);
    if (index !== -1) {
      if (data.password === "") {
        delete data.password; // Keep old password
      }
      employees[index] = { ...employees[index], ...data };
      localStorage.setItem("navanala_employees", JSON.stringify(employees));

      // Update current user session if editing own profile
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === id) {
        localStorage.setItem("navanala_currentUser", JSON.stringify(employees[index]));
      }

      this.addActivity("update", `Employee profile updated locally: ${employees[index].name}`);
      return employees[index];
    }
    return null;
  },

  async deleteEmployee(id) {
    let success = false;
    try {
      const res = await axios.delete(`http://192.23.2.19:1012/api/v1/employee/delete-employee/${id}`);
      if (res.status === 200 || res.status === 204) success = true;
    } catch (err) {}
    
    if (!success) {
      try {
        const res = await axios.delete(`http://192.23.2.19:1012/api/v1/employee/delete-employee`, { data: { id, _id: id, employeeId: id } });
        if (res.status === 200 || res.status === 204) success = true;
      } catch (err) {}
    }

    if (success) {
      this.addActivity("delete", `Employee deleted via API`);
      this.getEmployees();
      return true;
    }

    // Fallback
    const employees = await this.getEmployees();
    const employeeToDelete = employees.find(e => e.id === id);
    if (!employeeToDelete) return false;

    const filtered = employees.filter(e => e.id !== id);
    localStorage.setItem("navanala_employees", JSON.stringify(filtered));
    this.addActivity("delete", `Employee deleted locally: ${employeeToDelete.name}`);
    return true;
  },

  getCategories() {
    const categories = localStorage.getItem("navanala_categories");
    return categories ? JSON.parse(categories) : [];
  },

  getEmployeeWorkload() {
    const employees = this.getEmployees();
    const tasks = this.getTasks();

    return employees.map(emp => {
      const empTasks = tasks.filter(t => t.assigneeId === emp.id);
      const pending = empTasks.filter(t => t.status === "Pending" || t.status === "In Progress" || t.status === "Hold" || t.status === "Testing").length;
      const completed = empTasks.filter(t => t.status === "Completed").length;

      return {
        ...emp,
        assignedTasks: empTasks.length,
        pendingTasks: pending,
        completedTasks: completed
      };
    });
  },

  updateCategoryProgress(categoryName) {
    const categories = this.getCategories();
    const tasks = this.getTasks().filter(t => t.category === categoryName);
    if (tasks.length === 0) return;

    const completed = tasks.filter(t => t.status === "Completed").length;
    const progress = Math.round((completed / tasks.length) * 100);

    const index = categories.findIndex(c => c.name === categoryName);
    if (index !== -1) {
      categories[index].progress = progress;
      localStorage.setItem("navanala_categories", JSON.stringify(categories));
    }
  },

  // --- ACTIVITIES ---
  getActivities() {
    const activities = localStorage.getItem("navanala_activities");
    return activities ? JSON.parse(activities) : [];
  },

  addActivity(type, text) {
    const activities = this.getActivities();
    const newActivity = {
      id: `act-${Date.now()}`,
      time: "Just now",
      type: type,
      text: text
    };
    activities.unshift(newActivity);
    localStorage.setItem("navanala_activities", JSON.stringify(activities.slice(0, 10))); // keep max 10
  },

  // --- MASTER DATA (ROLES) ---
  getMasterRoles() {
    const roles = localStorage.getItem("navanala_master_roles");
    return roles ? JSON.parse(roles) : [];
  },
  addMasterRole(name) {
    const roles = this.getMasterRoles();
    if (roles.some(r => r.name.toLowerCase() === name.toLowerCase())) return false; // Duplicate
    const newRole = { id: `role-${Date.now()}`, name };
    roles.push(newRole);
    localStorage.setItem("navanala_master_roles", JSON.stringify(roles));
    return newRole;
  },
  updateMasterRole(id, newName) {
    const roles = this.getMasterRoles();
    const index = roles.findIndex(r => r.id === id);
    if (index === -1) return null;
    roles[index].name = newName;
    localStorage.setItem("navanala_master_roles", JSON.stringify(roles));
    return roles[index];
  },
  deleteMasterRole(id) {
    let roles = this.getMasterRoles();
    roles = roles.filter(r => r.id !== id);
    localStorage.setItem("navanala_master_roles", JSON.stringify(roles));
    return true;
  },

  // --- MASTER DATA (LOCATIONS) ---
  getMasterLocations() {
    const locations = localStorage.getItem("navanala_master_locations");
    return locations ? JSON.parse(locations) : [];
  },
  addMasterLocation(name) {
    const locations = this.getMasterLocations();
    if (locations.some(l => l.name.toLowerCase() === name.toLowerCase())) return false;
    const newLoc = { id: `loc-${Date.now()}`, name };
    locations.push(newLoc);
    localStorage.setItem("navanala_master_locations", JSON.stringify(locations));
    return newLoc;
  },
  updateMasterLocation(id, newName) {
    const locations = this.getMasterLocations();
    const index = locations.findIndex(l => l.id === id);
    if (index === -1) return null;
    locations[index].name = newName;
    localStorage.setItem("navanala_master_locations", JSON.stringify(locations));
    return locations[index];
  },
  deleteMasterLocation(id) {
    let locations = this.getMasterLocations();
    locations = locations.filter(l => l.id !== id);
    localStorage.setItem("navanala_master_locations", JSON.stringify(locations));
    return true;
  },

  // --- MASTER DATA (MENUS) ---
  getMasterMenus() {
    const menus = localStorage.getItem("navanala_master_menus");
    return menus ? JSON.parse(menus) : [];
  },
  addMasterMenu(parent, child) {
    const menus = this.getMasterMenus();
    if (menus.some(m => m.parent === parent && m.child.toLowerCase() === child.toLowerCase())) return false;
    const newMenu = { id: `menu-${Date.now()}`, parent, child };
    menus.push(newMenu);
    localStorage.setItem("navanala_master_menus", JSON.stringify(menus));
    return newMenu;
  },
  deleteMasterMenu(id) {
    let menus = this.getMasterMenus();
    menus = menus.filter(m => m.id !== id);
    localStorage.setItem("navanala_master_menus", JSON.stringify(menus));
    return true;
  },

  // --- ROLE PRIVILEGES ---
  getRolePrivileges() {
    const privs = localStorage.getItem("navanala_role_privileges");
    return privs ? JSON.parse(privs) : [];
  },
  saveRolePrivileges(role, menuId, permissions) {
    let privs = this.getRolePrivileges();
    const index = privs.findIndex(p => p.role === role && p.menuId === menuId);
    if (index !== -1) {
      privs[index].permissions = permissions;
    } else {
      privs.push({ id: `priv-${Date.now()}`, role, menuId, permissions });
    }
    localStorage.setItem("navanala_role_privileges", JSON.stringify(privs));
    return true;
  },

  // --- PROJECT MASTER ---
  getProjects() {
    const data = localStorage.getItem("navanala_projects");
    return data ? JSON.parse(data) : [];
  },

  async fetchProjectsAsync() {
    try {
      const res = await axios.get("http://192.23.2.19:1012/api/v1/project/get-all-projects");
      const data = res.data;
      
      let apiProjects = [];
      if (Array.isArray(data)) apiProjects = data;
      else if (data.data && Array.isArray(data.data)) apiProjects = data.data;
      else if (data.projects && Array.isArray(data.projects)) apiProjects = data.projects;

      const localProjects = this.getProjects();

      const formatted = apiProjects.map(p => {
        const name = p.name || p.projectName || p.project_name || p.ProjectName;
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
        const apiNames = formatted.map(f => f.name.toLowerCase());
        const missingLocals = localProjects.filter(lp => !apiNames.includes(lp.name.toLowerCase()));
        const merged = [...formatted, ...missingLocals];
        
        localStorage.setItem("navanala_projects", JSON.stringify(merged));
        return merged;
      }
    } catch (err) {
      console.error("API Fetch Projects failed:", err);
    }
    return this.getProjects();
  },
  addProject(data) {
    const projects = this.getProjects();
    const newProject = { id: `proj-${Date.now()}`, ...data };
    projects.push(newProject);
    localStorage.setItem("navanala_projects", JSON.stringify(projects));
    return newProject;
  },
  deleteProject(id) {
    let projects = this.getProjects();
    projects = projects.filter(p => p.id !== id);
    localStorage.setItem("navanala_projects", JSON.stringify(projects));
    return true;
  },
  updateProject(id, data) {
    let projects = this.getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...data };
      localStorage.setItem("navanala_projects", JSON.stringify(projects));
      return projects[index];
    }
    return null;
  },

  // --- LANGUAGE MASTER ---
  getLanguages() {
    const data = localStorage.getItem("navanala_languages");
    return data ? JSON.parse(data) : [];
  },
  addLanguage(name) {
    const languages = this.getLanguages();
    if (languages.some(l => l.name.toLowerCase() === name.toLowerCase())) return false;
    const newLang = { id: `lang-${Date.now()}`, name };
    languages.push(newLang);
    localStorage.setItem("navanala_languages", JSON.stringify(languages));
    return newLang;
  },
  deleteLanguage(id) {
    let languages = this.getLanguages();
    languages = languages.filter(l => l.id !== id);
    localStorage.setItem("navanala_languages", JSON.stringify(languages));
    return true;
  },

  // --- FRAMEWORK MASTER ---
  getFrameworks() {
    const data = localStorage.getItem("navanala_frameworks");
    return data ? JSON.parse(data) : [];
  },
  addFramework(name) {
    const frameworks = this.getFrameworks();
    if (frameworks.some(f => f.name.toLowerCase() === name.toLowerCase())) return false;
    const newFw = { id: `fw-${Date.now()}`, name };
    frameworks.push(newFw);
    localStorage.setItem("navanala_frameworks", JSON.stringify(frameworks));
    return newFw;
  },
  deleteFramework(id) {
    let frameworks = this.getFrameworks();
    frameworks = frameworks.filter(f => f.id !== id);
    localStorage.setItem("navanala_frameworks", JSON.stringify(frameworks));
    return true;
  },

  // --- DEPARTMENT MASTER ---
  getDepartments() {
    const data = localStorage.getItem("navanala_departments");
    return data ? JSON.parse(data) : [
      { id: "dept-1", name: "Hardware" },
      { id: "dept-2", name: "Software" },
      { id: "dept-3", name: "IOT" },
      { id: "dept-4", name: "HR" }
    ];
  },
  addDepartment(name) {
    const depts = this.getDepartments();
    if (depts.some(d => d.name.toLowerCase() === name.toLowerCase())) return false;
    const newDept = { id: `dept-${Date.now()}`, name };
    depts.push(newDept);
    localStorage.setItem("navanala_departments", JSON.stringify(depts));
    return newDept;
  },
  updateDepartment(id, newName) {
    let depts = this.getDepartments();
    const index = depts.findIndex(d => d.id === id);
    if (index !== -1) {
      depts[index].name = newName;
      localStorage.setItem("navanala_departments", JSON.stringify(depts));
      return true;
    }
    return false;
  },
  deleteDepartment(id) {
    let depts = this.getDepartments();
    depts = depts.filter(d => d.id !== id);
    localStorage.setItem("navanala_departments", JSON.stringify(depts));
    return true;
  },

  // --- PRIORITY MASTER ---
  getPriorities() {
    const data = localStorage.getItem("navanala_priorities");
    return data ? JSON.parse(data) : [
      { id: "prio-1", name: "High" },
      { id: "prio-2", name: "Medium" },
      { id: "prio-3", name: "Low" }
    ];
  },
  addPriority(name) {
    const priorities = this.getPriorities();
    if (priorities.some(p => p.name.toLowerCase() === name.toLowerCase())) return false;
    const newPriority = { id: `prio-${Date.now()}`, name };
    priorities.push(newPriority);
    localStorage.setItem("navanala_priorities", JSON.stringify(priorities));
    return newPriority;
  },
  updatePriority(id, newName) {
    let priorities = this.getPriorities();
    const index = priorities.findIndex(p => p.id === id);
    if (index !== -1) {
      priorities[index].name = newName;
      localStorage.setItem("navanala_priorities", JSON.stringify(priorities));
      return true;
    }
    return false;
  },
  deletePriority(id) {
    let priorities = this.getPriorities();
    priorities = priorities.filter(p => p.id !== id);
    localStorage.setItem("navanala_priorities", JSON.stringify(priorities));
    return true;
  },

  // --- STATUSES ---
  getStatuses() {
    const data = localStorage.getItem("navanala_statuses");
    return data ? JSON.parse(data) : [];
  },
  addStatus(name) {
    const statuses = this.getStatuses();
    if (statuses.find(s => s.name.toLowerCase() === name.toLowerCase())) return false;
    statuses.push({ id: `status-${Date.now()}`, name });
    localStorage.setItem("navanala_statuses", JSON.stringify(statuses));
    return true;
  },
  updateStatus(id, newName) {
    const statuses = this.getStatuses();
    const index = statuses.findIndex(s => s.id === id);
    if (index !== -1) {
      statuses[index].name = newName;
      localStorage.setItem("navanala_statuses", JSON.stringify(statuses));
      return true;
    }
    return false;
  },
  deleteStatus(id) {
    let statuses = this.getStatuses();
    statuses = statuses.filter(s => s.id !== id);
    localStorage.setItem("navanala_statuses", JSON.stringify(statuses));
    return true;
  },

  // --- TASK MASTER ---
  getTaskMaster() {
    const data = localStorage.getItem("navanala_task_master");
    return data ? JSON.parse(data) : [];
  },
  addTaskMaster(name) {
    const list = this.getTaskMaster();
    if (list.find(t => t.name.toLowerCase() === name.toLowerCase())) return false;
    list.push({ id: `tm-${Date.now()}`, name });
    localStorage.setItem("navanala_task_master", JSON.stringify(list));
    return true;
  },
  updateTaskMaster(id, newName) {
    const list = this.getTaskMaster();
    const index = list.findIndex(t => t.id === id);
    if (index !== -1) {
      list[index].name = newName;
      localStorage.setItem("navanala_task_master", JSON.stringify(list));
      return true;
    }
    return false;
  },
  deleteTaskMaster(id) {
    let list = this.getTaskMaster();
    list = list.filter(t => t.id !== id);
    localStorage.setItem("navanala_task_master", JSON.stringify(list));
    return true;
  },

  // --- TASKFILE MASTER ---
  getTaskFiles() {
    const data = localStorage.getItem("navanala_taskfiles");
    return data ? JSON.parse(data) : [];
  },
  addTaskFile(name) {
    const list = this.getTaskFiles();
    if (list.find(t => t.name.toLowerCase() === name.toLowerCase())) return false;
    list.push({ id: `tf-${Date.now()}`, name });
    localStorage.setItem("navanala_taskfiles", JSON.stringify(list));
    return true;
  },
  updateTaskFile(id, newName) {
    const list = this.getTaskFiles();
    const index = list.findIndex(t => t.id === id);
    if (index !== -1) {
      list[index].name = newName;
      localStorage.setItem("navanala_taskfiles", JSON.stringify(list));
      return true;
    }
    return false;
  },
  deleteTaskFile(id) {
    let list = this.getTaskFiles();
    list = list.filter(t => t.id !== id);
    localStorage.setItem("navanala_taskfiles", JSON.stringify(list));
    return true;
  },

  // --- TASKROLE MASTER ---
  getTaskRoles() {
    const data = localStorage.getItem("navanala_task_roles");
    return data ? JSON.parse(data) : [];
  },
  addTaskRole(name) {
    const list = this.getTaskRoles();
    if (list.find(t => t.name.toLowerCase() === name.toLowerCase())) return false;
    list.push({ id: `tr-${Date.now()}`, name });
    localStorage.setItem("navanala_task_roles", JSON.stringify(list));
    return true;
  },
  updateTaskRole(id, newName) {
    const list = this.getTaskRoles();
    const index = list.findIndex(t => t.id === id);
    if (index !== -1) {
      list[index].name = newName;
      localStorage.setItem("navanala_task_roles", JSON.stringify(list));
      return true;
    }
    return false;
  },
  deleteTaskRole(id) {
    let list = this.getTaskRoles();
    list = list.filter(t => t.id !== id);
    localStorage.setItem("navanala_task_roles", JSON.stringify(list));
    return true;
  },

  // --- USER MASTER ---
  getUserMaster() {
    const data = localStorage.getItem("navanala_user_master");
    return data ? JSON.parse(data) : [];
  },
  addUserMaster(name) {
    const list = this.getUserMaster();
    if (list.find(u => u.name.toLowerCase() === name.toLowerCase())) return false;
    list.push({ id: `um-${Date.now()}`, name });
    localStorage.setItem("navanala_user_master", JSON.stringify(list));
    return true;
  },
  updateUserMaster(id, newName) {
    const list = this.getUserMaster();
    const index = list.findIndex(u => u.id === id);
    if (index !== -1) {
      list[index].name = newName;
      localStorage.setItem("navanala_user_master", JSON.stringify(list));
      return true;
    }
    return false;
  },
  deleteUserMaster(id) {
    let list = this.getUserMaster();
    list = list.filter(u => u.id !== id);
    localStorage.setItem("navanala_user_master", JSON.stringify(list));
    return true;
  },

  // --- ZONE MASTER ---
  getZoneMaster() {
    const data = localStorage.getItem("navanala_zone_master");
    return data ? JSON.parse(data) : [];
  },
  addZoneMaster(name) {
    const list = this.getZoneMaster();
    if (list.find(z => z.name.toLowerCase() === name.toLowerCase())) return false;
    list.push({ id: `zm-${Date.now()}`, name });
    localStorage.setItem("navanala_zone_master", JSON.stringify(list));
    return true;
  },
  updateZoneMaster(id, newName) {
    const list = this.getZoneMaster();
    const index = list.findIndex(z => z.id === id);
    if (index !== -1) {
      list[index].name = newName;
      localStorage.setItem("navanala_zone_master", JSON.stringify(list));
      return true;
    }
    return false;
  },
  deleteZoneMaster(id) {
    let list = this.getZoneMaster();
    list = list.filter(z => z.id !== id);
    localStorage.setItem("navanala_zone_master", JSON.stringify(list));
    return true;
  }
};
