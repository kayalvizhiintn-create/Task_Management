import React, { useState, useEffect } from "react";
import { taskService } from "../services/taskService";
import { Users, Mail, Phone, MapPin, Briefcase, Hash, Camera, ShieldAlert } from "lucide-react";
import { Navigate } from "react-router-dom";

export default function AdminEmployees() {
  const [employees, setEmployees] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = taskService.getCurrentUser();
    setCurrentUser(user);
    
    // Only load if Admin
    if (user && user.role === "Admin") {
      setEmployees(taskService.getEmployees());
    }
  }, []);

  // Guard clause: restrict access if not admin
  if (currentUser && currentUser.role !== "Admin") {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-4">
        <ShieldAlert size={64} className="text-rose-500" />
        <h2 className="text-2xl font-black text-slate-900">Access Denied</h2>
        <p className="text-slate-500 font-semibold max-w-sm">
          You do not have the required administrative privileges to view the employee directory.
        </p>
      </div>
    );
  }

  if (!currentUser) return null; // loading or waiting to redirect

  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-fade-in pb-8 lg:pb-12">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-[1.5rem] lg:rounded-[2rem] bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-5 sm:p-6 lg:p-10 shadow-premium">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 dark:bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="relative flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 flex items-center gap-3">
              <Users size={36} className="text-primary" />
              Employee Directory (Admin)
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-semibold mt-2 text-sm max-w-lg leading-relaxed">
              Complete overview of all registered employees in the workspace. Restricted access for system administrators only.
            </p>
          </div>
          <div className="px-5 py-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl text-sm font-extrabold flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            {employees.length} Total Employees
          </div>
        </div>
      </div>

      {/* Grid of Employees */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {employees.map(emp => (
          <div key={emp.id} className="bg-white dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-[1.5rem] lg:rounded-3xl p-5 lg:p-6 shadow-sm hover:shadow-premium transition-all duration-300">
            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-700/50 pb-5 mb-5">
              <img 
                src={emp.avatar} 
                alt={emp.name} 
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-50 dark:ring-slate-800 shadow-sm" 
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-black text-slate-900 dark:text-white truncate">{emp.name}</h3>
                <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary dark:text-primary-light">
                  {emp.role || "Team Member"}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Info Rows */}
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Email</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{emp.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Mobile Number</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{emp.mobileNumber || "Not Provided"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Location</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{emp.place || "Not Provided"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-700/50 mt-4">
                <div className="flex items-center gap-2">
                  <Briefcase size={14} className="text-slate-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Bio ID</p>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 truncate">{emp.bioId || "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Hash size={14} className="text-slate-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Aadhar No.</p>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 truncate">{emp.aadharNumber ? "•••• " + emp.aadharNumber.slice(-4) : "-"}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
