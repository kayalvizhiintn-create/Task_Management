import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
    LogOut,
    ChevronDown,
    ChevronRight,
    Server,
    Activity,
    Wifi,
    PlusSquare
} from "lucide-react";
import { taskService } from "../services/taskService";

const navItems = [
    {
        label: "Dashboards",
        icon: <LayoutDashboard size={20} />,
        subItems: [
            { path: "/", icon: <Activity size={18} />, label: "Software Dashboard" },
            { path: "/hardware-dashboard", icon: <Server size={18} />, label: "Hardware Dashboard" },
            { path: "/iot-dashboard", icon: <Wifi size={18} />, label: "IoT Dashboard" }
        ]
    },
    { path: "/tasks", icon: <CheckSquare size={20} />, label: "Tasks" },
    { path: "/create-task", icon: <PlusSquare size={20} />, label: "Create Task" },
    { path: "/employees", icon: <Users size={20} />, label: "Task Planner" },
    { path: "/directory", icon: <UsersRound size={20} />, label: "Directory" },
    // { path: "/categories", icon: <FolderTree size={20} />, label: "Categories" },
    { path: "/reports", icon: <FileText size={20} />, label: "Reports" },
    { path: "/employee-details", icon: <UserCircle size={20} />, label: "My Profile" },
    { path: "/team-details", icon: <Briefcase size={20} />, label: "Team Details" },
    { path: "/visitors/external", icon: <MapPin size={20} />, label: "Visitors" },
    { path: "/masters", icon: <Layers size={20} />, label: "Masters" },
    { path: "/privileges", icon: <Shield size={20} />, label: "Privileges" },
    { path: "/settings", icon: <Settings size={20} />, label: "Settings" }
];

export default function Sidebar({ onClose }) {
    const currentUser = taskService.getCurrentUser();
    const userRole = currentUser?.role || "User";
    const [expandedMenu, setExpandedMenu] = useState("Dashboards");
    const location = useLocation();

    const handleLogout = () => {
        taskService.logout();
        window.location.href = "#/login";
    };

    return (
        <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-full shadow-2xl transition-colors duration-300 relative overflow-hidden z-20 print:hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 left-0 w-full h-32 bg-indigo-500/5 blur-3xl rounded-full -translate-y-1/2"></div>

            <div className="p-6 border-b border-slate-800/50 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
                        N
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Navanala</h1>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg lg:hidden"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar relative z-10">
                {navItems.map((item) => {
                    if (item.subItems) {
                        const isExpanded = expandedMenu === item.label;
                        const hasActiveChild = item.subItems.some(sub => sub.path === location.pathname);

                        return (
                            <div key={item.label} className="flex flex-col space-y-1">
                                <button
                                    onClick={() => setExpandedMenu(isExpanded ? null : item.label)}
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 w-full group ${hasActiveChild && !isExpanded
                                        ? "bg-indigo-500/10 text-indigo-400 font-bold shadow-inner"
                                        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100 font-medium"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="transition-transform duration-300">
                                            {item.icon}
                                        </div>
                                        <span className="text-sm tracking-wide">{item.label}</span>
                                    </div>
                                    <div className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                                        <ChevronDown size={16} />
                                    </div>
                                </button>

                                {/* Dropdown Content */}
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out pl-4 pr-2 space-y-1 ${isExpanded ? "max-h-48 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                                    {item.subItems.map((sub) => (
                                        <NavLink
                                            key={sub.path}
                                            to={sub.path}
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group ${isActive
                                                    ? "bg-indigo-500/10 text-indigo-400 font-bold shadow-inner"
                                                    : "text-slate-500 hover:bg-slate-800/40 hover:text-slate-200 font-medium"
                                                }`
                                            }
                                        >
                                            <div className="transition-transform duration-300">
                                                {sub.icon}
                                            </div>
                                            <span className="text-sm tracking-wide">{sub.label}</span>
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        );
                    }

                    return (
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
                            <div className="transition-transform duration-300">
                                {item.icon}
                            </div>
                            <span className="text-sm tracking-wide">{item.label}</span>
                        </NavLink>
                    );
                })}
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