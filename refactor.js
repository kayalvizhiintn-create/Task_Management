const fs = require('fs');
const path = require('path');

const mastersPath = path.join(__dirname, 'frontend/src/pages/Masters.jsx');
let content = fs.readFileSync(mastersPath, 'utf8');

// 1. Replace imports
content = content.replace(
  /import \{ taskService \} from "\.\.\/services\/taskService";/,
  `import { departmentService } from "../services/departmentService";
import { priorityService } from "../services/priorityService";
import { projectService } from "../services/projectService";
import { statusService } from "../services/statusService";
import { taskFileService } from "../services/taskFileService";
import { taskRoleService } from "../services/taskRoleService";
import { userService } from "../services/userService";
import { zoneService } from "../services/zoneService";
import { taskService } from "../services/taskService";
import { mockService } from "../services/mockService";`
);

// We need to rewrite the fetch functions
const fetchReplacements = [
  { name: 'Departments', service: 'departmentService', method: 'getAllDepartments' },
  { name: 'Priorities', service: 'priorityService', method: 'getAllPriorities' },
  { name: 'Statuses', service: 'statusService', method: 'getAllStatuses' },
  { name: 'TasksMaster', service: 'taskService', method: 'getAllTasks' },
  { name: 'TaskFiles', service: 'taskFileService', method: 'getAllTaskFiles' },
  { name: 'TaskRoles', service: 'taskRoleService', method: 'getAllRoles' },
  { name: 'UserMaster', service: 'userService', method: 'getAllUsers' },
  { name: 'ZoneMaster', service: 'zoneService', method: 'getAllZones' },
  { name: 'Projects', service: 'projectService', method: 'getAllProjects' },
];

for (const { name, service, method } of fetchReplacements) {
  const regex = new RegExp(`const fetch${name}FromAPI = async \\(\\) => \\{[\\s\\S]*?\\};`, 'g');
  const replacement = `const fetch${name}FromAPI = async () => {
    try {
      const res = await ${service}.${method}();
      const data = res.data || res;
      let items = Array.isArray(data) ? data : (data.data || []);
      const formatted = items.map(x => ({
        id: x._id || x.id || x[Object.keys(x).find(k => k.toLowerCase().includes('id'))],
        name: x.name || x.departmentName || x.priorityName || x.statusName || x.taskName || x.taskFileName || x.fileName || x.roleName || x.userName || x.zoneName || x.projectName || x.dpt_name || x.priority_name || x.status_name || x.task_name || x.file_name || x.role_name || x.user_name || x.zone_name || x.project_name || "Unknown",
        description: x.description || "",
        environment: x.environment || "Indoor",
        bioIds: x.bioIds || []
      })).filter(x => x.name);
      set${name}(formatted);
    } catch (err) {
      console.error("Failed to fetch ${name}:", err);
    }
  };`;
  content = content.replace(regex, replacement);
}

// 2. Replace taskService -> mockService for Master data
const mockServiceReplacements = [
  'getMasterRoles', 'addMasterRole', 'updateMasterRole', 'deleteMasterRole',
  'getMasterLocations', 'addMasterLocation', 'updateMasterLocation', 'deleteMasterLocation',
  'getLanguages', 'addLanguage', 'deleteLanguage',
  'getFrameworks', 'addFramework', 'deleteFramework',
  'getMasterMenus', 'addMasterMenu', 'deleteMasterMenu',
  'getRolePrivileges', 'saveRolePrivileges'
];
for (const method of mockServiceReplacements) {
  content = content.replace(new RegExp(`taskService\\.${method}`, 'g'), `mockService.${method}`);
}

// 3. Rewrite HandleAdd
content = content.replace(
  /const handleAdd = async \(e\) => \{[\s\S]*?loadData\(\);\n  \};/m,
  `const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      if (activeTab === "roles") {
        mockService.addMasterRole(newItemName.trim());
        triggerToast("Role added successfully!");
      } else if (activeTab === "locations") {
        mockService.addMasterLocation(newItemName.trim());
        triggerToast("Location added successfully!");
      } else if (activeTab === "departments") {
        await departmentService.createDepartment({ name: newItemName.trim(), departmentName: newItemName.trim(), dpt_name: newItemName.trim() });
        triggerToast("Department added!");
        await fetchDepartmentsFromAPI();
      } else if (activeTab === "statuses") {
        await statusService.createStatus({ name: newItemName.trim(), statusName: newItemName.trim(), status_name: newItemName.trim() });
        triggerToast("Status added!");
        await fetchStatusesFromAPI();
      } else if (activeTab === "task_master") {
        await taskService.createTask({ name: newItemName.trim(), taskName: newItemName.trim(), task_name: newItemName.trim() });
        triggerToast("Task added!");
        await fetchTasksMasterFromAPI();
      } else if (activeTab === "taskfile") {
        await taskFileService.createTaskFile({ name: newItemName.trim(), fileName: newItemName.trim(), file_name: newItemName.trim() });
        triggerToast("Taskfile added!");
        await fetchTaskFilesFromAPI();
      } else if (activeTab === "task_role") {
        await taskRoleService.createRole({ name: newItemName.trim(), roleName: newItemName.trim(), role_name: newItemName.trim() });
        triggerToast("TaskRole added!");
        await fetchTaskRolesFromAPI();
      } else if (activeTab === "user_master") {
        await userService.createUser({ name: newItemName.trim(), userName: newItemName.trim(), user_name: newItemName.trim() });
        triggerToast("User added!");
        await fetchUserMasterFromAPI();
      } else if (activeTab === "zone_master") {
        await zoneService.createZone({ name: newItemName.trim(), zoneName: newItemName.trim(), zone_name: newItemName.trim() });
        triggerToast("Zone added!");
        await fetchZoneMasterFromAPI();
      } else if (activeTab === "priorities") {
        await priorityService.createPriority({ name: newItemName.trim(), priorityName: newItemName.trim(), priority_name: newItemName.trim() });
        triggerToast("Priority added!");
        await fetchPrioritiesFromAPI();
      }
    } catch (err) {
      console.error(err);
      triggerToast("Error adding item");
    }
    setNewItemName("");
    loadData();
  };`
);

// 4. Rewrite HandleSaveEdit
content = content.replace(
  /const handleSaveEdit = async \(\) => \{[\s\S]*?loadData\(\);\n  \};/m,
  `const handleSaveEdit = async () => {
    if (!editName.trim()) return;
    try {
      if (activeTab === "roles") {
        mockService.updateMasterRole(editingId, editName.trim());
      } else if (activeTab === "locations") {
        mockService.updateMasterLocation(editingId, editName.trim());
      } else if (activeTab === "departments") {
        await departmentService.updateDepartment({ id: editingId, name: editName.trim(), departmentName: editName.trim(), dpt_name: editName.trim() });
        await fetchDepartmentsFromAPI();
      } else if (activeTab === "statuses") {
        await statusService.updateStatus({ id: editingId, name: editName.trim(), statusName: editName.trim(), status_name: editName.trim() });
        await fetchStatusesFromAPI();
      } else if (activeTab === "task_master") {
        await taskService.updateTask({ id: editingId, name: editName.trim(), taskName: editName.trim(), task_name: editName.trim() });
        await fetchTasksMasterFromAPI();
      } else if (activeTab === "taskfile") {
        await taskFileService.updateTaskFile({ id: editingId, name: editName.trim(), fileName: editName.trim(), file_name: editName.trim() });
        await fetchTaskFilesFromAPI();
      } else if (activeTab === "task_role") {
        await taskRoleService.updateRole({ id: editingId, name: editName.trim(), roleName: editName.trim(), role_name: editName.trim() });
        await fetchTaskRolesFromAPI();
      } else if (activeTab === "user_master") {
        await userService.updateUser({ id: editingId, name: editName.trim(), userName: editName.trim(), user_name: editName.trim() });
        await fetchUserMasterFromAPI();
      } else if (activeTab === "zone_master") {
        await zoneService.updateZone({ id: editingId, name: editName.trim(), zoneName: editName.trim(), zone_name: editName.trim() });
        await fetchZoneMasterFromAPI();
      } else if (activeTab === "priorities") {
        await priorityService.updatePriority({ id: editingId, name: editName.trim(), priorityName: editName.trim(), priority_name: editName.trim() });
        await fetchPrioritiesFromAPI();
      }
      triggerToast("Updated successfully!");
    } catch (err) {
      console.error(err);
      triggerToast("Error updating item");
    }
    setEditingId(null);
    setEditName("");
  };`
);

// 5. Rewrite HandleDelete
content = content.replace(
  /const handleDelete = async \(id\) => \{[\s\S]*?loadData\(\);\n  \};/m,
  `const handleDelete = async (id) => {
    try {
      if (activeTab === "roles") mockService.deleteMasterRole(id);
      else if (activeTab === "locations") mockService.deleteMasterLocation(id);
      else if (activeTab === "departments") { await departmentService.deleteDepartment(id); await fetchDepartmentsFromAPI(); }
      else if (activeTab === "statuses") { await statusService.deleteStatus(id); await fetchStatusesFromAPI(); }
      else if (activeTab === "task_master") { await taskService.deleteTask(id); await fetchTasksMasterFromAPI(); }
      else if (activeTab === "taskfile") { await taskFileService.deleteTaskFile(id); await fetchTaskFilesFromAPI(); }
      else if (activeTab === "task_role") { await taskRoleService.deleteRole(id); await fetchTaskRolesFromAPI(); }
      else if (activeTab === "user_master") { await userService.deleteUser(id); await fetchUserMasterFromAPI(); }
      else if (activeTab === "zone_master") { await zoneService.deleteZone(id); await fetchZoneMasterFromAPI(); }
      else if (activeTab === "priorities") { await priorityService.deletePriority(id); await fetchPrioritiesFromAPI(); }
      triggerToast("Deleted successfully!");
    } catch (err) {
      console.error(err);
      triggerToast("Error deleting item");
    }
  };`
);

// 6. Rewrite Project handleDeleteProject
content = content.replace(
  /const handleDeleteProject = async \(id\) => \{[\s\S]*?setProjects\(taskService\.getProjects\(\)\);\n    \}\n  \};/m,
  `const handleDeleteProject = async (id) => {
    try {
      await projectService.deleteProject(id);
      triggerToast("Project deleted successfully!");
      await fetchProjectsFromAPI();
    } catch (err) {
      console.error(err);
      triggerToast("Error deleting project");
    }
  };`
);

// 7. Rewrite Project handleProjectSubmit
content = content.replace(
  /const handleProjectSubmit = async \(e\) => \{[\s\S]*?setProjForm\(initialProjForm\);\n  \};/m,
  `const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProjectId) {
        await projectService.updateProject({ id: editingProjectId, ...projForm, projectName: projForm.name });
        triggerToast("Project updated successfully!");
      } else {
        await projectService.createProject({ ...projForm, projectName: projForm.name });
        triggerToast("Project created successfully!");
      }
      await fetchProjectsFromAPI();
      setEditingProjectId(null);
      setProjForm(initialProjForm);
    } catch (err) {
      console.error(err);
      triggerToast("Error saving project");
    }
  };`
);

// 8. Handle Employees API in loadData correctly since userService handles Users now. 
// But AddEmployee uses /employee. I will leave fetchEmployeesAsync on mockService if needed, or point it to userService.
// I'll add fetchEmployeesAsync to userService.js via a quick append or just leave it.

fs.writeFileSync(mastersPath, content, 'utf8');
console.log("Refactoring Masters.jsx - DONE");
