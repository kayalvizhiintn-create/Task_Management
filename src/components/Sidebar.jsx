import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckSquare,
    Users,
    FolderTree,
    FileText,
    Settings,
    UserCircle,
    Briefcase,
    UsersRound,
    Shield,
    Layers,
    MapPin,
    LogOut
} from "lucide-react";
import { taskService } from "../services/taskService";

const navItems = [
    { path: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/tasks", icon: <CheckSquare size={20} />, label: "Tasks" },
    { path: "/employees", icon: <Users size={20} />, label: "Task Planner" },
    { path: "/directory", icon: <UsersRound size={20} />, label: "Directory" },
    { path: "/categories", icon: <FolderTree size={20} />, label: "Categories" },
    { path: "/reports", icon: <FileText size={20} />, label: "Reports" },
    { path: "/employee-details", icon: <UserCircle size={20} />, label: "My Profile" },
    { path: "/team-details", icon: <Briefcase size={20} />, label: "Team Details" },
    { path: "/visitors/external", icon: <MapPin size={20} />, label: "Visitors" },
    { path: "/masters", icon: <Layers size={20} />, label: "Masters" },
    { path: "/privileges", icon: <Shield size={20} />, label: "Privileges" },
    { path: "/settings", icon: <Settings size={20} />, label: "Settings" }
];

export default function Sidebar() {
    const currentUser = taskService.getCurrentUser();
    const userRole = currentUser?.role || "User";

    const handleLogout = () => {
        taskService.logout();
        window.location.href = "#/login";
    };

    return (
        <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-full shadow-2xl transition-colors duration-300 relative overflow-hidden z-20 print:hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 left-0 w-full h-32 bg-indigo-500/5 blur-3xl rounded-full -translate-y-1/2"></div>

            <div className="p-6 border-b border-slate-800/50 flex items-center gap-3 relative z-10">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
                    N
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight">Navanala</h1>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar relative z-10">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                ? "bg-indigo-500/10 text-indigo-400 font-bold shadow-inner"
                                : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100 font-medium"
                            }`
                        }
                    >
                        <div className={`transition-transform duration-300 ${/* group-hover:scale-110 active adds scale? maybe skip for now */ ""}`}>
                            {item.icon}
                        </div>
                        <span className="text-sm tracking-wide">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800/50 relative z-10 bg-slate-950/80 backdrop-blur-sm">
               

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3.5 w-full rounded-2xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 border border-transparent transition-all duration-300 group font-semibold"
                >
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm">Logout</span>
                </button>
            </div>
        </aside>
    );
}