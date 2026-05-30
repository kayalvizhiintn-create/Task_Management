import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { taskService } from "../services/taskService";
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Hash, Pencil, Trash2, Camera, Upload, X, CheckCircle2 } from "lucide-react";

export default function EmployeeProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [masterRoles, setMasterRoles] = useState([]);
  const [masterLocations, setMasterLocations] = useState([]);

  useEffect(() => {
    const allEmployees = taskService.getEmployees();
    const found = allEmployees.find(e => e.id === id);
    if (found) {
      setEmployee(found);
    }
    setMasterRoles(taskService.getMasterRoles());
    setMasterLocations(taskService.getMasterLocations());
  }, [id]);

  // Edit handlers removed, using EditEmployee.jsx page

  const handleDeleteEmployee = () => {
    if (window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
      taskService.deleteEmployee(employee.id);
      navigate("/directory");
    }
  };

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Employee Not Found</h2>
        <button onClick={() => navigate("/directory")} className="text-primary font-bold hover:underline">
          Return to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8 animate-fade-in pb-8 lg:pb-12 relative">


      {showToast && (
        <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-floating flex items-center gap-3 border border-slate-800 z-50 animate-slide-up">
          <div className="bg-emerald-500/20 p-1.5 rounded-full">
            <CheckCircle2 size={20} className="text-emerald-500" />
          </div>
          <div className="mr-6">
            <h4 className="text-sm font-bold">Success</h4>
            <p className="text-xs text-slate-300 font-medium">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Back Button */}
      <Link to="/directory" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors">
        <ArrowLeft size={16} />
        Back to Directory
      </Link>

      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden shadow-premium relative">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

        {/* Edit & Delete Actions Overlay */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
          <button
            onClick={() => navigate('/edit-employee/' + id)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light rounded-xl text-xs font-bold shadow-md hover:scale-105 transition-all border border-slate-200/40 dark:border-slate-700/40"
          >
            <Pencil size={13} /> Edit
          </button>
          <button
            onClick={handleDeleteEmployee}
            className="flex items-center gap-1.5 px-3 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md hover:bg-rose-600 hover:scale-105 transition-all"
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>

        <div className="px-5 sm:px-8 pb-5 sm:pb-8 flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6 -mt-12 relative z-10">
          <img
            src={employee.avatar}
            alt={employee.name}
            className="w-32 h-32 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-lg bg-white"
          />
          <div className="flex-1 text-center md:text-left mt-2 md:mt-14">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">{employee.name}</h1>
            <p className="text-primary dark:text-primary-light font-bold mt-1 text-lg">{employee.role || "Team Member"}</p>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Contact Information */}
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-[1.5rem] lg:rounded-3xl p-5 lg:p-8 shadow-sm">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-6">Contact Information</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-slate-400">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Email Address</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">{employee.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-slate-400">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Mobile Number</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">{employee.mobileNumber || "Not Provided"}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-slate-400">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Location</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">{employee.place || "Not Provided"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Details */}
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-[1.5rem] lg:rounded-3xl p-5 lg:p-8 shadow-sm">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-6">Professional Details</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-slate-400">
                <Briefcase size={20} />
              </div>
              <div>
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Bio ID / Employee ID</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">{employee.bioId || "-"}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-slate-400">
                <Hash size={20} />
              </div>
              <div>
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Aadhar Number</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  {employee.aadharNumber ? `•••• •••• ${String(employee.aadharNumber).slice(-4)}` : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Edit modal removed */}
    </div>
  );
}
