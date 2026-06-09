import React, { useState, useEffect } from "react";
import { sidebarItems } from "../Data/SidebarItems";
import { defaultPermissions } from "../Data/Permissions";
import { Shield, Lock, Unlock, Settings2, UserCheck, Save, CheckCircle2, X } from "lucide-react";

export default function Privileges() {
  const [selectedRole, setSelectedRole] = useState("Admin");

  // Load from localStorage or use defaults
  const [permissions, setPermissions] = useState(() => {
    const stored = localStorage.getItem("navanala_privileges");
    return stored ? JSON.parse(stored) : defaultPermissions;
  });

  const [showToast, setShowToast] = useState(false);

  // Helper to convert screen name to permission key (e.g., "Tasks-Create" -> "view_tasks_create")
  const getPermissionKey = (screenName) => {
    return `view_${screenName.toLowerCase().replace("-", "_")}`;
  };

  const handleToggle = (screenName) => {
    const permKey = getPermissionKey(screenName);

    setPermissions((prev) => {
      const rolePerms = prev[selectedRole] || [];
      const hasPerm = rolePerms.includes(permKey);

      let newRolePerms;
      if (hasPerm) {
        newRolePerms = rolePerms.filter((p) => p !== permKey);
      } else {
        newRolePerms = [...rolePerms, permKey];
      }

      return {
        ...prev,
        [selectedRole]: newRolePerms,
      };
    });
  };

  const handleSavePrivileges = () => {
    localStorage.setItem("navanala_privileges", JSON.stringify(permissions));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const currentRolePerms = permissions[selectedRole] || [];

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
            <p className="text-xs text-slate-300 dark:text-slate-600 font-semibold">Privileges saved successfully!</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative overflow-hidden rounded-[1.5rem] lg:rounded-[2rem] bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-5 sm:p-6 lg:p-10 shadow-premium">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 dark:bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
        <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-6 lg:gap-8">
          <div className="flex-1 min-w-0 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-bold text-xs mb-3">
              <Shield size={14} />
              Access Control
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
              Role Privileges
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-semibold mt-2 text-sm leading-relaxed">
              Manage view, create, update, and delete permissions for each role across the platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 relative z-10 shrink-0">
            <div className="relative w-full sm:w-56 lg:w-64 shrink-0">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                <UserCheck size={18} />
              </div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-bold transition-all appearance-none cursor-pointer"
              >
                {Object.keys(defaultPermissions).map((role) => (
                  <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                <Settings2 size={18} />
              </div>
            </div>

            <button
              onClick={handleSavePrivileges}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3.5 rounded-2xl font-black text-sm shadow-glow hover:shadow-lg transition-all duration-300 shrink-0 whitespace-nowrap"
            >
              <Save size={18} />
              Set Privileges
            </button>
          </div>
        </div>
      </div>

      {/* Permissions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {sidebarItems.map((screen) => {
          const permKey = getPermissionKey(screen.name);
          const hasAccess = currentRolePerms.includes(permKey);
          const Icon = screen.icon;

          return (
            <div
              key={screen.id}
              className={`p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between ${hasAccess
                  ? "bg-white dark:bg-slate-800 border-primary/20 shadow-lg shadow-primary/5 dark:shadow-primary/5"
                  : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100"
                }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl flex items-center justify-center transition-colors ${hasAccess
                    ? "bg-primary/10 text-primary"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                  }`}>
                  {Icon && <Icon size={20} />}
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${hasAccess ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
                    {screen.name.replace("-", " ")}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                    {hasAccess ? "Access Granted" : "Access Denied"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleToggle(screen.name)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${hasAccess ? "bg-primary" : "bg-slate-300 dark:bg-slate-600"
                  }`}
              >
                <span className="sr-only">Toggle access</span>
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${hasAccess ? "translate-x-6" : "translate-x-1"
                    }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}