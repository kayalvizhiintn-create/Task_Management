import apiClient from './apiClient';

export const authService = {
  async login(email, password) {
    let employees = [];
    try {
      const res = await apiClient.get('/api/v1/user/get-all-users');
      const data = res.data;
      if (Array.isArray(data)) employees = data;
      else if (data.data && Array.isArray(data.data)) employees = data.data;
      else if (data.users && Array.isArray(data.users)) employees = data.users;

      try {
        const rolesRes = await apiClient.get('/api/v1/role/get-all-roles');
        const rolesData = rolesRes.data;
        let roles = [];
        if (Array.isArray(rolesData)) roles = rolesData;
        else if (rolesData.data && Array.isArray(rolesData.data)) roles = rolesData.data;
        else if (rolesData.roles && Array.isArray(rolesData.roles)) roles = rolesData.roles;

        employees.forEach(u => {
          if (!u.role && u.roleId) {
            const r = roles.find(r => r._id === u.roleId || r.id === u.roleId || r.roleId === u.roleId || r.RoleId === u.roleId);
            if (r) u.role = r.name || r.roleName || r.role_name || r.RoleName;
          }
        });
      } catch (roleErr) {
        console.error("API error fetching roles for login mapping", roleErr);
      }
    } catch (err) {
      console.error("API error fetching users for login", err);
    }

    // Check for specific admin account first
    if (email.toLowerCase() === "kayal@gmail.com") {
      if (password !== "12345678") {
        throw new Error("Invalid admin password");
      }

      let adminUser = employees.find(e => e.email && e.email.toLowerCase() === email.toLowerCase());
      if (!adminUser) {
        adminUser = {
          id: `emp-admin`,
          name: "Kayal Admin",
          role: "Admin",
          email: "kayal@gmail.com",
          password: "12345678",
          avatar: `https://ui-avatars.com/api/?name=Kayal+Admin&background=random`
        };
      } else {
        adminUser.role = "Admin";
      }

      localStorage.setItem("navanala_currentUser", JSON.stringify(adminUser));
      return adminUser;
    }

    // Check normal employees
    const input = email.toLowerCase();
    const matchedEmployee = employees.find(e => {
      const empEmail = (e.email || "").toLowerCase();
      const empName = (e.name || e.displayName || e.userName || "").toLowerCase();
      return (empEmail && empEmail === input) || (empName && empName === input);
    });

    if (!matchedEmployee) {
      throw new Error("Invalid credentials. Account not found.");
    }

    if (matchedEmployee.password !== password) {
      throw new Error("Invalid password.");
    }

    if (!matchedEmployee.name) {
      matchedEmployee.name = matchedEmployee.userName || matchedEmployee.displayName || matchedEmployee.user_name || "User";
    }
    if (!matchedEmployee.role) {
      matchedEmployee.role = "User";
    }

    localStorage.setItem("navanala_currentUser", JSON.stringify(matchedEmployee));
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

  getUsers() {
    const users = localStorage.getItem("navanala_employees");
    return users ? JSON.parse(users) : [];
  },

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
    localStorage.setItem("navanala_activities", JSON.stringify(activities.slice(0, 10)));
  }
};
