import React, { useState } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TaskManagement from "./pages/TaskManagement";
import CreateTask from "./pages/CreateTask";
import TaskDetails from "./pages/TaskDetails";
import EmployeeView from "./pages/EmployeeView";
import Categories from "./pages/Categories";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import EmployeeDetails from "./pages/EmployeeDetails";
import AdminEmployees from "./pages/AdminEmployees";
import EmployeeDirectory from "./pages/EmployeeDirectory";
import EmployeeProfileView from "./pages/EmployeeProfileView";
import TeamDetails from "./pages/TeamDetails";
import VisitorsEnquiry from "./pages/VisitorsEnquiry";
import Masters from "./pages/Masters";
import Privileges from "./pages/Privileges";
import { taskService } from "./services/taskService";
import { defaultPermissions } from "./Data/Permissions";
import "./App.css";

const ProtectedRoute = ({ children, screenName }) => {
  const currentUser = taskService.getCurrentUser();
  if (!currentUser) return <Navigate to="/login" replace />;

  const userRole = currentUser.role || "User";
  const permissions = JSON.parse(localStorage.getItem("navanala_privileges")) || defaultPermissions;
  const userPerms = permissions[userRole] || [];

  let permKey = `view_${screenName.toLowerCase().replace(/[\s-]/g, "_")}`;
  if (screenName === "Employee Directory") permKey = "view_directory";
  if (screenName === "Create Task") permKey = "view_tasks_create";

  const isManaged = [
    "view_dashboard", "view_tasks", "view_directory", "view_reports", "view_settings", "view_profile", "view_project", "view_tasks_view", "view_tasks_create", "view_tasks_update", "view_tasks_delete", "view_directory_view", "view_directory_create", "view_directory_update", "view_directory_delete", "view_reports_view", "view_reports_create", "view_reports_update", "view_reports_delete", "view_settings_view", "view_settings_create", "view_settings_update", "view_settings_delete", "view_profile_view", "view_profile_create", "view_profile_update", "view_profile_delete", "view_project_view", "view_project_create", "view_project_update", "view_project_delete"
  ].includes(permKey);

  if (isManaged && !userPerms.includes(permKey)) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-slate-500 font-semibold">
        Access Denied: You do not have permission to view this screen.
      </div>
    );
  }

  return children;
};

export default function App() {
  const [globalSearch, setGlobalSearch] = useState("");

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("navanala_theme") || "light";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <HashRouter>
      <Routes>
        {/* Entry Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Protected SaaS Workspace Dashboard Layout */}
        <Route
          element={<DashboardLayout onSearchChange={setGlobalSearch} />}
        >
          {/* Dashboard Hub */}
          <Route path="/" element={<ProtectedRoute screenName="Dashboard"><Dashboard /></ProtectedRoute>} />

          {/* Task Operations */}
          <Route path="/tasks" element={<ProtectedRoute screenName="Tasks"><TaskManagement /></ProtectedRoute>} />
          <Route path="/create-task" element={<ProtectedRoute screenName="Create Task"><CreateTask /></ProtectedRoute>} />
          <Route path="/task/:id" element={<ProtectedRoute screenName="Tasks"><TaskDetails /></ProtectedRoute>} />

          {/* Core Sidebar Links */}
          <Route path="/employees" element={<ProtectedRoute screenName="Task Planner"><EmployeeView /></ProtectedRoute>} />
          <Route path="/directory" element={<ProtectedRoute screenName="Employee Directory"><EmployeeDirectory /></ProtectedRoute>} />
          <Route path="/directory/:id" element={<ProtectedRoute screenName="Employee Directory"><EmployeeProfileView /></ProtectedRoute>} />
          <Route path="/admin/employees" element={<ProtectedRoute screenName="Admin Directory"><AdminEmployees /></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute screenName="Categories"><Categories /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute screenName="Reports"><Reports /></ProtectedRoute>} />
          <Route path="/employee-details" element={<ProtectedRoute screenName="Employee Details"><EmployeeDetails /></ProtectedRoute>} />
          <Route path="/team-details" element={<ProtectedRoute screenName="Team Details"><TeamDetails /></ProtectedRoute>} />
          <Route path="/visitors" element={<Navigate to="/visitors/external" replace />} />
          <Route path="/visitors/:type" element={<ProtectedRoute screenName="Visitors Enquiry"><VisitorsEnquiry /></ProtectedRoute>} />
          <Route path="/masters" element={<ProtectedRoute screenName="Masters"><Masters /></ProtectedRoute>} />
          <Route path="/privileges" element={<ProtectedRoute screenName="Privileges"><Privileges /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute screenName="Settings"><Settings /></ProtectedRoute>} />
        </Route>

        {/* Catch All Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
}
