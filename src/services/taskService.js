// React SaaS Task Management Dashboard Mock Database Service

const INITIAL_EMPLOYEES = [
  { id: "emp-1", name: "Emma Thompson", role: "Project Manager", email: "emma@company.com", password: "password123", avatar: "https://ui-avatars.com/api/?name=Emma+Thompson&background=random" },
  { id: "emp-2", name: "Michael Chen", role: "Senior Developer", email: "michael@company.com", password: "password123", avatar: "https://ui-avatars.com/api/?name=Michael+Chen&background=random" },
  { id: "emp-3", name: "Priya Patel", role: "UI/UX Designer", email: "priya@company.com", password: "password123", avatar: "https://ui-avatars.com/api/?name=Priya+Patel&background=random" },
  { id: "emp-4", name: "James Wilson", role: "QA Engineer", email: "james@company.com", password: "password123", avatar: "https://ui-avatars.com/api/?name=James+Wilson&background=random" },
  { id: "emp-5", name: "Sofia Rodriguez", role: "Content Specialist", email: "sofia@company.com", password: "password123", avatar: "https://ui-avatars.com/api/?name=Sofia+Rodriguez&background=random" }
];

const INITIAL_CATEGORIES = [
  { id: "cat-1", name: "Branding Identity", progress: 75 },
  { id: "cat-2", name: "Legal", progress: 40 },
  { id: "cat-3", name: "Marketing", progress: 90 },
  { id: "cat-4", name: "HR", progress: 60 },
  { id: "cat-5", name: "Finance", progress: 25 },
  { id: "cat-6", name: "Engineering", progress: 65 }
];

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
    localStorage.setItem("navanala_categories", JSON.stringify(INITIAL_CATEGORIES));
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

  createTask(taskData) {
    const tasks = this.getTasks();
    const employees = this.getEmployees();
    const newId = `task-${Date.now()}`;
    const assignee = employees.find(e => e.id === taskData.assigneeId);

    const newTask = {
      id: newId,
      name: taskData.name,
      category: taskData.category,
      assigneeId: taskData.assigneeId,
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

  addEmployee(employeeData) {
    const employees = this.getEmployees();
    const newEmployee = {
      id: `emp-${Date.now()}`,
      name: employeeData.name || "New Employee",
      role: employeeData.role || "Team Member",
      email: employeeData.email || "",
      place: employeeData.place || "",
      bioId: employeeData.bioId || "",
      password: employeeData.password || "password123", // Default if not provided
      aadharNumber: employeeData.aadharNumber || "",
      mobileNumber: employeeData.mobileNumber || "",
      avatar: employeeData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(employeeData.name || "New Employee")}&background=random`
    };
    employees.push(newEmployee);
    localStorage.setItem("navanala_employees", JSON.stringify(employees));
    this.addActivity("create", `New employee added: ${newEmployee.name}`);
    return newEmployee;
  },
  
  updateEmployee(id, data) {
    const employees = this.getEmployees();
    const index = employees.findIndex(e => e.id === id);
    if (index !== -1) {
      employees[index] = { ...employees[index], ...data };
      localStorage.setItem("navanala_employees", JSON.stringify(employees));
      
      // Update current user session if editing own profile
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === id) {
        localStorage.setItem("navanala_currentUser", JSON.stringify(employees[index]));
      }

      this.addActivity("update", `Employee profile updated: ${employees[index].name}`);
      return employees[index];
    }
    return null;
  },

  deleteEmployee(id) {
    const employees = this.getEmployees();
    const employeeToDelete = employees.find(e => e.id === id);
    if (!employeeToDelete) return false;

    const filtered = employees.filter(e => e.id !== id);
    localStorage.setItem("navanala_employees", JSON.stringify(filtered));
    this.addActivity("delete", `Employee deleted: ${employeeToDelete.name}`);
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
      const pending = empTasks.filter(t => t.status === "Pending" || t.status === "In Progress" || t.status === "Hold").length;
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
  }
};
