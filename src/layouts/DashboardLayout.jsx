import React, { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { taskService } from "../services/taskService";

export default function DashboardLayout({ onSearchChange }) {
  const currentUser = taskService.getCurrentUser();

  // If user is not logged in, redirect to login page immediately
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F1F5F9] dark:bg-slate-950 font-sans transition-colors duration-300">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar onSearchChange={onSearchChange} />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 animate-fade-in focus:outline-none">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
