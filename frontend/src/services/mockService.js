import apiClient from './apiClient';

export const mockService = {
  // Categories (Mocked as no backend provided)
  getCategories() {
    const categories = localStorage.getItem("navanala_categories");
    if (!categories) {
        localStorage.setItem("navanala_categories", JSON.stringify([]));
        return [];
    }
    return JSON.parse(categories);
  },

  updateCategoryProgress(categoryName) {
    // This requires access to tasks, which are now async API calls
    // It might be better to calculate progress on the UI side using real task data
  },

  // Activities (Mocked)
  getActivities() {
    const activities = localStorage.getItem("navanala_activities");
    if (!activities) {
        localStorage.setItem("navanala_activities", JSON.stringify([]));
        return [];
    }
    return JSON.parse(activities);
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
  },

  // Other UI specific mock masters (Location, Language, Framework, Menu, Privilege)
  getMasterLocations() {
    const locs = localStorage.getItem("navanala_master_locations");
    return locs ? JSON.parse(locs) : [{ id: "loc-1", name: "Remote" }, { id: "loc-2", name: "New York" }, { id: "loc-3", name: "London" }, { id: "loc-4", name: "Chennai" }, { id: "loc-5", name: "Bangalore" }];
  },
  addMasterLocation(name) {
    const locs = this.getMasterLocations();
    if (locs.some(l => l.name.toLowerCase() === name.toLowerCase())) return false;
    const newLoc = { id: `loc-${Date.now()}`, name };
    locs.push(newLoc);
    localStorage.setItem("navanala_master_locations", JSON.stringify(locs));
    return newLoc;
  },
  updateMasterLocation(id, newName) {
    const locs = this.getMasterLocations();
    const index = locs.findIndex(l => l.id === id);
    if (index === -1) return null;
    locs[index].name = newName;
    localStorage.setItem("navanala_master_locations", JSON.stringify(locs));
    return locs[index];
  },
  deleteMasterLocation(id) {
    let locs = this.getMasterLocations();
    locs = locs.filter(l => l.id !== id);
    localStorage.setItem("navanala_master_locations", JSON.stringify(locs));
    return true;
  },

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

  getFrameworks() {
    const data = localStorage.getItem("navanala_frameworks");
    return data ? JSON.parse(data) : [
      { id: "fw-1", name: "MVC" }, { id: "fw-2", name: "Flask" }, { id: "fw-3", name: "Django" }, { id: "fw-4", name: "FastAPI" }, { id: "fw-5", name: "Laravel" }
    ];
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

  getMasterMenus() {
    const menus = localStorage.getItem("navanala_master_menus");
    return menus ? JSON.parse(menus) : [
      { id: "menu-1", parent: "Dashboard", child: "Overview" },
      { id: "menu-2", parent: "Tasks", child: "Task List" },
      { id: "menu-3", parent: "Directory", child: "Employees" }
    ];
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

  getMasterRoles() {
    const roles = localStorage.getItem("navanala_master_roles");
    return roles ? JSON.parse(roles) : [
      { id: "role-1", name: "Admin" },
      { id: "role-2", name: "Manager" },
      { id: "role-3", name: "User" }
    ];
  },
  addMasterRole(name) {
    const roles = this.getMasterRoles();
    if (roles.some(r => r.name.toLowerCase() === name.toLowerCase())) return false;
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
  }
};
