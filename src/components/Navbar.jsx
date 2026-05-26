import React, { useState, useEffect, useRef } from "react";
import { Bell, Search, User, ChevronDown, CheckCircle2, AlertCircle, Info, Calendar } from "lucide-react";
import { taskService } from "../services/taskService";
import { useNavigate } from "react-router-dom";

export default function Navbar({ onSearchChange }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const user = taskService.getCurrentUser();
    setCurrentUser(user);

    // Generate notifications from recent activities
    const activities = taskService.getActivities();
    setNotifications(activities.slice(0, 5));

    // Click outside handler
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    taskService.logout();
    navigate("/login");
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case "create": return <Info size={16} className="text-blue-500" />;
      case "complete": return <CheckCircle2 size={16} className="text-emerald-500" />;
      case "assign": return <User size={16} className="text-purple-500" />;
      default: return <AlertCircle size={16} className="text-amber-500" />;
    }
  };

  return (
    <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-40 transition-colors duration-300">
      {/* Search Bar */}
      <div className="w-96 relative">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Search tasks, categories, assignees..."
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-slate-800 placeholder-slate-400"
        />
      </div>

      {/* Action Items */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition-all duration-200 relative"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-floating overflow-hidden z-50 animate-slide-up">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <span className="font-bold text-slate-800 text-sm">Notifications</span>
                <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">New Alerts</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-sm">No new updates.</div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className="p-4 hover:bg-slate-50 flex gap-3 text-left transition-colors duration-150">
                      <div className="mt-0.5 p-1.5 bg-slate-100 rounded-lg h-fit">
                        {getNotifIcon(notif.type)}
                      </div>
                      <div>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed">{notif.text}</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-semibold flex items-center gap-1">
                          <Calendar size={10} /> {notif.time}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                <button className="text-xs font-bold text-primary hover:text-primary-dark transition-colors duration-150">
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Vertical Separator */}
        <div className="w-px h-6 bg-slate-200" />

        {/* User Profile */}
        {currentUser && (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-1.5 pr-3 hover:bg-slate-50 rounded-xl transition-all duration-200"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-primary/10"
              />
              <div className="text-left hidden md:block">
                <p className="text-sm font-bold text-slate-800 tracking-tight leading-tight">{currentUser.name}</p>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-[10px] mt-0.5">{currentUser.role}</p>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-floating overflow-hidden z-50 animate-slide-up">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Signed in as</p>
                  <p className="text-sm font-bold text-slate-800 truncate mt-0.5">{currentUser.email}</p>
                </div>
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => { setShowProfileMenu(false); navigate("/settings"); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors duration-150 text-left"
                  >
                    <User size={16} />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-rose-500 hover:bg-rose-50 rounded-xl transition-colors duration-150 text-left"
                  >
                    <User size={16} className="text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
