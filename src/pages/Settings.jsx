import React, { useState, useEffect } from "react";
import { Bell, Shield, CheckCircle2, Moon, Sun, Palette, Mail, Smartphone, X } from "lucide-react";

export default function SettingsPage() {
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("navanala_theme") || "light");

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("navanala_theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8 animate-fade-in pb-8 lg:pb-12">



      {showToast && (
        <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-floating flex items-center gap-3 border border-slate-800 z-50 animate-slide-up">
          <div className="bg-emerald-500/20 p-1.5 rounded-full">
            <CheckCircle2 size={20} className="text-emerald-500" />
          </div>
          <div className="mr-6">
            <h4 className="text-sm font-bold">Success</h4>
            <p className="text-xs text-slate-300 font-medium">Settings updated successfully.</p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="relative overflow-hidden rounded-[1.5rem] lg:rounded-[2rem] bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-5 sm:p-6 lg:p-10 shadow-premium">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 dark:bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

        <div className="relative flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
              Workspace Settings
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-semibold mt-2 text-sm max-w-lg leading-relaxed">
              Tweak the visual appearance and configure your notification preferences.
            </p>
          </div>
          <button
            onClick={handleSaveSettings}
            className="group relative px-6 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-sm font-extrabold shadow-lg hover:shadow-xl transition-all overflow-hidden whitespace-nowrap shrink-0"
          >
            <div className="absolute inset-0 bg-white/20 dark:bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            <span className="relative flex items-center gap-2">
              <Shield size={16} /> Save Settings
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Theme Selector */}
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 p-5 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] shadow-sm hover:shadow-premium transition-shadow duration-300 h-full">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2.5 bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-secondary-light rounded-xl">
              <Palette size={20} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Appearance</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleThemeChange('light')}
              className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-glow' : 'border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-900/30'}`}
            >
              <div className={`p-3 rounded-full ${theme === 'light' ? 'bg-white shadow-sm text-primary' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>
                <Sun size={24} strokeWidth={theme === 'light' ? 2.5 : 2} />
              </div>
              <span className={`text-xs font-bold ${theme === 'light' ? 'text-primary' : 'text-slate-600 dark:text-slate-400'}`}>Light Mode</span>
            </button>

            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-glow' : 'border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-900/30'}`}
            >
              <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-slate-900 shadow-sm text-primary-light' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>
                <Moon size={24} strokeWidth={theme === 'dark' ? 2.5 : 2} />
              </div>
              <span className={`text-xs font-bold ${theme === 'dark' ? 'text-primary-light' : 'text-slate-600 dark:text-slate-400'}`}>Dark Mode</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 p-5 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] shadow-sm hover:shadow-premium transition-shadow duration-300 h-full">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2.5 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Notifications</h3>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/30 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div className="mt-0.5">
                <Mail size={18} className="text-slate-400 dark:text-slate-500" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-bold text-slate-900 dark:text-white block">Email Updates</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block mt-1 leading-snug">Receive daily summaries and critical alerts directly in your inbox.</span>
              </div>
              <div className="relative inline-flex items-center cursor-pointer shrink-0">
                <input type="checkbox" className="sr-only peer" checked={notifEmail} onChange={(e) => setNotifEmail(e.target.checked)} />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary dark:peer-checked:bg-primary-dark"></div>
              </div>
            </label>

            <label className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/30 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div className="mt-0.5">
                <Smartphone size={18} className="text-slate-400 dark:text-slate-500" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-bold text-slate-900 dark:text-white block">Push Notifications</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block mt-1 leading-snug">Get instant popups on your device when tasks are assigned to you.</span>
              </div>
              <div className="relative inline-flex items-center cursor-pointer shrink-0">
                <input type="checkbox" className="sr-only peer" checked={notifPush} onChange={(e) => setNotifPush(e.target.checked)} />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary dark:peer-checked:bg-primary-dark"></div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
