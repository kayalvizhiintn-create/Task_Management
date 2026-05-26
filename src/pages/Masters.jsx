import React, { useState, useEffect } from "react";
import { taskService } from "../services/taskService";
import { Shield, MapPin, Plus, Edit2, Trash2, Check, X } from "lucide-react";

export default function Masters() {
  const [activeTab, setActiveTab] = useState("roles");
  const [roles, setRoles] = useState([]);
  const [locations, setLocations] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setRoles(taskService.getMasterRoles());
    setLocations(taskService.getMasterLocations());
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    if (activeTab === "roles") {
      const added = taskService.addMasterRole(newItemName.trim());
      if (!added) alert("Role already exists!");
    } else {
      const added = taskService.addMasterLocation(newItemName.trim());
      if (!added) alert("Location already exists!");
    }
    setNewItemName("");
    loadData();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) return;
    
    if (activeTab === "roles") {
      taskService.updateMasterRole(editingId, editName.trim());
    } else {
      taskService.updateMasterLocation(editingId, editName.trim());
    }
    setEditingId(null);
    setEditName("");
    loadData();
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    
    if (activeTab === "roles") {
      taskService.deleteMasterRole(id);
    } else {
      taskService.deleteMasterLocation(id);
    }
    loadData();
  };

  const currentList = activeTab === "roles" ? roles : locations;

  return (
    <div className="max-w-6xl mx-auto space-y-6 lg:space-y-8 animate-fade-in pb-8 lg:pb-12">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[1.5rem] lg:rounded-[2rem] bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-5 sm:p-6 lg:p-10 shadow-premium">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 dark:bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
        <div className="relative">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
            Master Data Management
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-semibold mt-2 text-sm max-w-lg leading-relaxed">
            Manage global data points like employee roles and company locations. This data populates dropdowns across the platform.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-3">
          <button
            onClick={() => setActiveTab("roles")}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all duration-200 ${
              activeTab === "roles"
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
            }`}
          >
            <Shield size={20} />
            Roles
          </button>
          <button
            onClick={() => setActiveTab("locations")}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all duration-200 ${
              activeTab === "locations"
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
            }`}
          >
            <MapPin size={20} />
            Locations
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-[2rem] p-6 lg:p-8 shadow-sm">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6">
            {activeTab === "roles" ? "Manage Roles" : "Manage Locations"}
          </h3>

          {/* Add New Form */}
          <form onSubmit={handleAdd} className="flex gap-4 mb-8">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={`Add new ${activeTab === "roles" ? "role" : "location"}...`}
              className="flex-1 px-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-slate-900 dark:text-white font-semibold transition-all"
            />
            <button
              type="submit"
              disabled={!newItemName.trim()}
              className="px-6 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-sm font-extrabold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
            >
              <Plus size={18} />
              Add
            </button>
          </form>

          {/* List Items */}
          <div className="space-y-3">
            {currentList.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                {editingId === item.id ? (
                  <div className="flex-1 flex items-center gap-3">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white font-semibold"
                      autoFocus
                    />
                    <button onClick={handleSaveEdit} className="p-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors">
                      <Check size={18} />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {currentList.length === 0 && (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8 font-semibold text-sm">
                No items found. Add one above.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
