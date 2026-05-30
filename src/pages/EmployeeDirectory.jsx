import React, { useState, useEffect, useRef } from "react";
import { taskService } from "../services/taskService";
import { Users, Search, Plus, X, Upload, Camera, CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function EmployeeDirectory() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [masterRoles, setMasterRoles] = useState([]);
  const [masterLocations, setMasterLocations] = useState([]);

  // Modal State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    // Fetch all employees
    setEmployees(taskService.getEmployees());
    setMasterRoles(taskService.getMasterRoles());
    setMasterLocations(taskService.getMasterLocations());
  }, []);

  // Form logic removed as it's now in separate pages

  const handleDeleteEmployee = (id, empName) => {
    if (window.confirm(`Are you sure you want to delete ${empName}?`)) {
      taskService.deleteEmployee(id);
      setEmployees(taskService.getEmployees());
      setToastMessage(`Employee "${empName}" deleted successfully!`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Name is required");
      return;
    }
    if (!password.trim()) {
      alert("Password is required");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileNumber || !mobileRegex.test(mobileNumber.replace(/[\s-]/g, ''))) {
      alert("Mobile number must be exactly 10 digits.");
      return;
    }
    const aadharRegex = /^\d{12}$/;
    if (!aadharNumber || !aadharRegex.test(aadharNumber.replace(/[\s-]/g, ''))) {
      alert("Aadhar number must be exactly 12 digits.");
      return;
    }

    const newEmp = taskService.addEmployee({
      name,
      email,
      role: role || "Team Member",
      place,
      bioId,
      mobileNumber,
      aadharNumber,
      password,
      avatar
    });

    // Refresh employees list
    setEmployees(taskService.getEmployees());

    // Reset Form State
    setName("");
    setEmail("");
    setRole("");
    setPlace("");
    setBioId("");
    setMobileNumber("");
    setAadharNumber("");
    setPassword("");
    setAvatar("");

    // Close Modal
    setIsModalOpen(false);

    // Show Toast
    setToastMessage(`Employee "${newEmp.name}" added successfully!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Filter employees based on search query
  const filteredEmployees = employees.filter((emp) => {
    const query = searchQuery.toLowerCase();
    return (
      emp.name.toLowerCase().includes(query) ||
      (emp.role && emp.role.toLowerCase().includes(query)) ||
      (emp.place && emp.place.toLowerCase().includes(query)) ||
      (emp.email && emp.email.toLowerCase().includes(query))
    );
  });

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
            <p className="text-xs text-slate-300 dark:text-slate-600 font-semibold">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="relative overflow-hidden rounded-[1.5rem] lg:rounded-[2rem] bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-5 sm:p-6 lg:p-10 shadow-premium flex flex-col md:flex-row justify-between items-center gap-4 lg:gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 flex items-center gap-3">
            <Users size={32} className="text-primary" />
            Employee Directory
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-semibold mt-2 text-sm max-w-lg leading-relaxed">
            Find and connect with your colleagues in the workspace.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-full text-slate-900 dark:text-white font-semibold transition-all"
            />
          </div>
          <button
            onClick={() => navigate('/add-employee')}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-xl font-bold text-sm shadow-glow hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
          >
            <Plus size={18} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Grid of Employees */}
      {filteredEmployees.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800/40 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-8 shadow-sm">
          <Users size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Employees Found</h3>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">Try resetting your search query or add a new employee.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:gap-6">
          {filteredEmployees.map((emp, index) => {
            const colors = [
              "bg-blue-600",
              "bg-emerald-600",
              "bg-slate-600",
              "bg-indigo-600",
              "bg-rose-600",
              "bg-amber-600"
            ];
            const btnColors = [
              "bg-blue-600 hover:bg-blue-700",
              "bg-emerald-600 hover:bg-emerald-700",
              "bg-slate-600 hover:bg-slate-700",
              "bg-indigo-600 hover:bg-indigo-700",
              "bg-rose-600 hover:bg-rose-700",
              "bg-amber-600 hover:bg-amber-700"
            ];
            const colorIndex = index % colors.length;

            return (
              <div key={emp.id} className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-premium transition-all duration-300 flex flex-col group hover:-translate-y-1 relative">
                {/* Edit & Delete Actions Overlay */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button
                      onClick={() => navigate('/edit-employee/' + emp.id)}
                      className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 hover:text-primary rounded-full shadow-sm hover:shadow transition-all"
                      title="Edit Employee"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                    onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                    title="Delete Profile"
                    className="p-2 rounded-xl bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-350 hover:text-rose-500 dark:hover:text-rose-400 shadow-md hover:scale-105 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Top Color Bar */}
                <div className={`h-20 ${colors[colorIndex]} w-full transition-all duration-300 group-hover:h-24`}></div>

                {/* Profile Image & Details */}
                <div className="px-6 pb-6 flex-1 flex flex-col items-center text-center -mt-10 relative z-10">
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-md bg-white mb-4 transition-transform duration-300 group-hover:scale-105"
                  />
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">{emp.name}</h3>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">{emp.role || "Team Member"}</p>
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">{emp.place || "Remote"}</p>

                  <div className="mt-auto pt-6 w-full">
                    <Link
                      to={`/directory/${emp.id}`}
                      className={`block w-full py-2.5 rounded-lg text-white text-sm font-bold transition-colors ${btnColors[colorIndex]}`}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Slide-out Drawers removed */}
    </div>
  );
}
