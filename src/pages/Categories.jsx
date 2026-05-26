import React, { useState, useEffect } from "react";
import { taskService } from "../services/taskService";
import { Folder, Plus, LayoutGrid, Clock, CheckCircle2, TrendingUp, Trash2, Layers } from "lucide-react";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setCategories(taskService.getCategories());
    setTasks(taskService.getTasks());
  }, []);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const currentCats = taskService.getCategories();
    if (currentCats.find(c => c.name.toLowerCase() === newCatName.toLowerCase())) {
      alert("Category already exists!");
      return;
    }

    const updated = [
      ...currentCats,
      { id: `cat-${Date.now()}`, name: newCatName.trim(), progress: 0 }
    ];

    localStorage.setItem("navanala_categories", JSON.stringify(updated));
    setCategories(updated);
    setNewCatName("");
    taskService.addActivity("create", `Category created: '${newCatName}' scope added`);
  };

  const deleteCategory = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      const updated = categories.filter(c => c.id !== id);
      localStorage.setItem("navanala_categories", JSON.stringify(updated));
      setCategories(updated);
    }
  }

  // Modern gradient mappings
  const getTheme = (index) => {
    const themes = [
      { from: "from-blue-500", to: "to-indigo-500", text: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-200 dark:border-blue-500/20" },
      { from: "from-emerald-400", to: "to-teal-500", text: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-200 dark:border-emerald-500/20" },
      { from: "from-rose-400", to: "to-orange-500", text: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10", border: "border-rose-200 dark:border-rose-500/20" },
      { from: "from-purple-500", to: "to-pink-500", text: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10", border: "border-purple-200 dark:border-purple-500/20" },
      { from: "from-amber-400", to: "to-orange-500", text: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-200 dark:border-amber-500/20" },
      { from: "from-cyan-400", to: "to-blue-500", text: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-500/10", border: "border-cyan-200 dark:border-cyan-500/20" },
    ];
    return themes[index % themes.length];
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 font-sans text-slate-900 dark:text-slate-100 relative overflow-hidden transition-colors duration-500">
      {/* Decorative Background Effects */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none z-0" />
      <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none z-0" />

      <div className="max-w-[2560px] mx-auto space-y-8 relative z-10 2xl:px-8">

        {/* Header Section */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-500/5">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Layers size={14} /> Organization Hub
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Workspace <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Departments</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-medium">
              Manage your organizational sectors, track department-wide productivity, and create new divisions for your tasks.
            </p>
          </div>

          <form onSubmit={handleAddCategory} className="w-full lg:w-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-indigo-600 rounded-[1.5rem] blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative flex items-center bg-white dark:bg-slate-900 p-2 rounded-[1.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
              <div className="pl-4 pr-2">
                <Folder className="text-slate-400" size={20} />
              </div>
              <input
                type="text"
                placeholder="New Department..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full lg:w-64 px-2 py-3 bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none placeholder:text-slate-400"
                required
              />
              <button
                type="submit"
                className="p-3.5 bg-primary hover:bg-indigo-600 text-white rounded-xl transition-all shadow-md hover:shadow-indigo-500/25 flex items-center justify-center shrink-0"
              >
                <Plus size={20} strokeWidth={3} />
              </button>
            </div>
          </form>
        </header>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/40 dark:border-slate-800 rounded-[2.5rem] shadow-xl text-center">
            <div className="w-24 h-24 bg-indigo-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <LayoutGrid size={40} className="text-indigo-300 dark:text-indigo-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">No Departments Yet</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium text-lg">
              Start by creating your first department category using the form above to organize your tasks.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[2560px]:grid-cols-6 gap-6 lg:gap-8">
            {categories.map((cat, idx) => {
              const catTasks = tasks.filter(t => t.category === cat.name);
              const completedCount = catTasks.filter(t => t.status === "Completed").length;
              const pendingCount = catTasks.filter(t => t.status === "Pending").length;
              const inProgressCount = catTasks.filter(t => t.status === "In Progress").length;

              const totalTasks = catTasks.length;
              const completionRate = totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);

              const theme = getTheme(idx);

              return (
                <div
                  key={cat.id}
                  className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 lg:p-8 shadow-xl shadow-slate-200/20 dark:shadow-none hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-1 overflow-hidden flex flex-col"
                >
                  {/* Top glowing line */}
                  <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.from} ${theme.to} opacity-80 group-hover:opacity-100 transition-opacity`} />

                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.from} ${theme.to} text-white flex items-center justify-center shrink-0 shadow-lg`}>
                        <Folder size={24} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight line-clamp-1">{cat.name}</h3>
                        <div className="flex items-center gap-1.5 mt-1 text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">
                          {totalTasks} {totalTasks === 1 ? 'Task' : 'Tasks'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteCategory(cat.id, cat.name)}
                      className="p-2.5 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-500/20 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      title="Delete Category"
                    >
                      <Trash2 size={18} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-8 mt-auto">
                    <div className={`flex flex-col items-center justify-center p-4 rounded-2xl border ${theme.border} ${theme.bg} transition-colors`}>
                      <CheckCircle2 size={20} className={`${theme.text} mb-2`} />
                      <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{completedCount}</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Done</span>
                    </div>
                    <div className={`flex flex-col items-center justify-center p-4 rounded-2xl border ${theme.border} ${theme.bg} transition-colors`}>
                      <TrendingUp size={20} className={`${theme.text} mb-2`} />
                      <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{inProgressCount}</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Doing</span>
                    </div>
                    <div className={`flex flex-col items-center justify-center p-4 rounded-2xl border ${theme.border} ${theme.bg} transition-colors`}>
                      <Clock size={20} className={`${theme.text} mb-2`} />
                      <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{pendingCount}</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Wait</span>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Progress</span>
                      <span className={`text-xl font-black ${theme.text}`}>{completionRate}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`h-full bg-gradient-to-r ${theme.from} ${theme.to} transition-all duration-1000 ease-out rounded-full relative`}
                        style={{ width: `${completionRate}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
