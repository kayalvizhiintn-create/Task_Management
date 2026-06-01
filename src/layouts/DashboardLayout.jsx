import React, { useState, useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { taskService } from "../services/taskService";

export default function DashboardLayout({ onSearchChange }) {
  const currentUser = taskService.getCurrentUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  // If user is not logged in, redirect to login page immediately
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F1F5F9] dark:bg-slate-950 font-sans transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 lg:relative overflow-hidden ${
          isSidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full lg:w-0 lg:translate-x-0"
        }`}
      >
        <div className="w-64 h-full">
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden w-full">
        {/* Top Navbar */}
        <Navbar onSearchChange={onSearchChange} onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 animate-fade-in focus:outline-none">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
