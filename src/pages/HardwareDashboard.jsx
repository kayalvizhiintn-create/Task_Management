import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Server,
  Wifi,
  WifiOff,
  Thermometer,
  Zap,
  Wrench,
  AlertTriangle,
  Activity,
  ChevronRight,
  Calendar,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Clock
} from "lucide-react";

export default function HardwareDashboard() {
  const [currentUser, setCurrentUser] = useState({ name: "Admin" });

  const [metrics, setMetrics] = useState({
    totalDevices: 0,
    activeDevices: 0,
    faultDevices: 0,
    temperature: 0,
    powerUsage: 0,
    maintenance: 0
  });

  const [devices, setDevices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [workloads, setWorkloads] = useState([]);

  // Fetch real data here when backend is ready
  useEffect(() => {
    // Left intentionally empty until real endpoints are connected
  }, []);

  // Compute stat card figures for donut chart
  const totalCount = metrics.totalDevices;
  const activeCount = metrics.activeDevices;
  const faultCount = metrics.faultDevices;
  const maintCount = metrics.maintenance;
  const warningCount = 0; // derived mock

  const activePct = totalCount ? Math.round((activeCount / totalCount) * 100) : 0;
  const faultPct = totalCount ? Math.round((faultCount / totalCount) * 100) : 0;
  const warningPct = totalCount ? Math.round((warningCount / totalCount) * 100) : 0;
  const maintPct = totalCount ? Math.round((maintCount / totalCount) * 100) : 0;

  // SVG Chart Calculation
  const radius1 = 80;
  const circ1 = 2 * Math.PI * radius1;
  const strokeActive = circ1 - (activePct / 100) * circ1;

  const radius2 = radius1 - 16;
  const circ2 = 2 * Math.PI * radius2;
  const strokeWarning = circ2 - (warningPct / 100) * circ2;

  const radius3 = radius1 - 30;
  const circ3 = 2 * Math.PI * radius3;
  const strokeFault = circ3 - (faultPct / 100) * circ3;

  // Velocity (Power Draw History)
  const powerData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    return {
      day: dayName,
      count: "0",
      active: i === 6
    };
  });

  const maxPower = Math.max(...powerData.map(d => parseFloat(d.count)), 10);
  const formattedPowerData = powerData.map(d => ({
    ...d,
    height: `${(parseFloat(d.count) / maxPower) * 100}%`
  }));

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Warning": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Maintenance": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Fault": return "bg-rose-100 text-rose-700 border-rose-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8 max-w-[2560px] mx-auto animate-fade-in pb-10 2xl:px-8">

      {/* Top Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Hardware Infrastructure
          </h2>
          <p className="text-slate-500 font-medium mt-1">Real-time device telemetry and hardware metrics.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold shadow-glow hover:shadow-lg transition-all duration-200 flex items-center gap-2">
            <span>Scan Devices</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>

      {/* Top Statistics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-4">

        {/* Total Devices */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-900/40 p-4 rounded-2xl shadow-premium hover:shadow-floating transition-all duration-300 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Total Devices</p>
            <Server size={16} className="text-indigo-400" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">{metrics.totalDevices}</h3>
        </div>

        {/* Active Devices */}
        <div className="bg-gradient-to-br from-slate-900 to-emerald-950 border border-emerald-900/40 p-4 rounded-2xl shadow-premium hover:shadow-floating transition-all duration-300 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Active Devices</p>
            <Wifi size={16} className="text-emerald-400" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">{metrics.activeDevices}</h3>
        </div>

        {/* Fault Devices */}
        <div className="bg-gradient-to-br from-slate-900 to-amber-950 border border-amber-900/40 p-4 rounded-2xl shadow-premium hover:shadow-floating transition-all duration-300 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Fault Devices</p>
            <WifiOff size={16} className="text-amber-400" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">{metrics.faultDevices}</h3>
        </div>

        {/* Temperature */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 border border-blue-900/40 p-4 rounded-2xl shadow-premium hover:shadow-floating transition-all duration-300 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Temperature</p>
            <Thermometer size={16} className="text-blue-400" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">{metrics.temperature}°C</h3>
        </div>

        {/* Power Usage */}
        <div className="bg-gradient-to-br from-slate-900 to-rose-950 border border-rose-900/40 p-4 rounded-2xl shadow-premium hover:shadow-floating transition-all duration-300 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Power Usage</p>
            <Zap size={16} className="text-rose-400" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">{metrics.powerUsage} kW</h3>
        </div>

        {/* Maintenance */}
        <div className="bg-gradient-to-br from-slate-900 to-purple-950 border border-purple-900/40 p-4 rounded-2xl shadow-premium hover:shadow-floating transition-all duration-300 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Maintenance</p>
            <Wrench size={16} className="text-purple-400" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">{metrics.maintenance}</h3>
        </div>

      </div>

      {/* Middle Section: Device Status Analytics & Power History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">

        {/* Status Donut Chart Card */}
        <div className="bg-white border border-slate-200/50 p-5 lg:p-8 rounded-[1.5rem] lg:rounded-3xl shadow-premium flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-extrabold text-slate-900 text-base">Device Status Analytics</h4>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-wider">Live Metrics</span>
          </div>

          <div className="relative flex justify-center items-center py-4">
            <svg width="220" height="220" className="transform -rotate-90">
              <circle cx="110" cy="110" r={radius1} stroke="#f1f5f9" strokeWidth="18" fill="transparent" />

              <circle
                cx="110" cy="110" r={radius1} stroke="#10b981" strokeWidth="18" fill="transparent"
                strokeDasharray={circ1} strokeDashoffset={strokeActive} strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <circle
                cx="110" cy="110" r={radius2} stroke="#f59e0b" strokeWidth="12" fill="transparent"
                strokeDasharray={circ2} strokeDashoffset={strokeWarning} strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <circle
                cx="110" cy="110" r={radius3} stroke="#ef4444" strokeWidth="8" fill="transparent"
                strokeDasharray={circ3} strokeDashoffset={strokeFault} strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col justify-center items-center text-center">
              <span className="text-3xl font-black text-slate-800">{totalCount}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Devices</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center mt-6 pt-6 border-t border-slate-100">
            <div>
              <div className="flex items-center gap-1 justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-bold text-slate-800">{activePct}%</span>
              </div>
              <p className="text-[9px] text-slate-400 mt-0.5 font-bold uppercase tracking-wider">Active</p>
            </div>
            <div>
              <div className="flex items-center gap-1 justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-[11px] font-bold text-slate-800">{warningPct}%</span>
              </div>
              <p className="text-[9px] text-slate-400 mt-0.5 font-bold uppercase tracking-wider">Warning</p>
            </div>
            <div>
              <div className="flex items-center gap-1 justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-[11px] font-bold text-slate-800">{maintPct}%</span>
              </div>
              <p className="text-[9px] text-slate-400 mt-0.5 font-bold uppercase tracking-wider">Maint</p>
            </div>
            <div>
              <div className="flex items-center gap-1 justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-[11px] font-bold text-slate-800">{faultPct}%</span>
              </div>
              <p className="text-[9px] text-slate-400 mt-0.5 font-bold uppercase tracking-wider">Fault</p>
            </div>
          </div>
        </div>

        {/* Power Draw History Widget */}
        <div className="bg-white border border-slate-200/50 p-5 lg:p-8 rounded-[1.5rem] lg:rounded-3xl shadow-premium flex flex-col justify-between lg:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-indigo-50/50 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                  <BarChart3 size={18} />
                </div>
                <h4 className="font-extrabold text-slate-900 text-lg tracking-tight">Power Draw History</h4>
              </div>
              <p className="text-sm text-slate-500 font-medium">7-day power consumption metrics</p>
            </div>

            <div className="text-right">
              <h3 className="text-3xl font-black text-indigo-600">{metrics.powerUsage}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current kW</p>
            </div>
          </div>

          <div className="relative z-10 flex-1 flex items-end gap-2 sm:gap-4 h-48 mt-8">
            {formattedPowerData.map((stat, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end items-center group h-full">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-md mb-2 whitespace-nowrap shadow-lg translate-y-2 group-hover:translate-y-0 absolute bottom-[calc(100%+8px)] z-20 pointer-events-none">
                  {stat.count} kW
                </div>
                <div className="w-full max-w-[48px] bg-slate-100 rounded-t-xl relative overflow-hidden group-hover:bg-indigo-50 transition-colors duration-300 flex-1 flex flex-col justify-end">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-1000 ease-out group-hover:bg-indigo-600 relative overflow-hidden shadow-inner ${stat.active ? 'bg-indigo-500' : 'bg-slate-300'}`}
                    style={{ height: stat.height }}
                  >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/30 to-transparent" />
                  </div>
                </div>
                <span className={`text-xs font-bold mt-3 transition-colors ${stat.active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'}`}>{stat.day}</span>
              </div>
            ))}
          </div>

          <div className="relative z-10 mt-8 pt-6 border-t border-slate-100 grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Avg. Draw</span>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-slate-800">0</span>
                <span className="text-xs font-semibold text-slate-500">kW</span>
              </div>
            </div>
            <div className="flex flex-col border-l border-slate-100 pl-4">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Peak Temp</span>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-slate-800">0°C</span>
              </div>
            </div>
            <div className="flex flex-col border-l border-slate-100 pl-4">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">PUE Ratio</span>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-slate-800">0</span>
                <span className="text-xs font-semibold text-slate-500">avg</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section: Device Workloads & (Recent Activity + Deadlines) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">

        {/* Device Workload Summary */}
        <div className="bg-white border border-slate-200/50 p-5 lg:p-8 rounded-[1.5rem] lg:rounded-3xl shadow-premium lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-extrabold text-slate-900 text-base">Key Hardware Load Summary</h4>
              <button className="text-xs font-bold text-primary hover:text-primary-dark transition-all flex items-center gap-1">
                <span>All Hardware</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="pb-3.5">Device Name</th>
                    <th className="pb-3.5 text-center">CPU / Memory Load</th>
                    <th className="pb-3.5 text-center">Active Conns</th>
                    <th className="pb-3.5 text-center">Load Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-semibold">
                  {workloads.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-slate-400 text-xs">No hardware loads available.</td>
                    </tr>
                  )}
                  {workloads.map((device) => {
                    let ratingColor = "bg-sky-50 text-sky-600 border-sky-100";
                    if (device.load >= 90) {
                      ratingColor = "bg-rose-50 text-rose-600 border-rose-100";
                    } else if (device.load >= 70) {
                      ratingColor = "bg-amber-50 text-amber-600 border-amber-100";
                    } else {
                      ratingColor = "bg-indigo-50 text-indigo-600 border-indigo-100";
                    }

                    return (
                      <tr key={device.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                            <Server size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{device.name}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">{device.role}</p>
                          </div>
                        </td>
                        <td className="py-3.5 text-center text-slate-800 font-bold">{device.load}%</td>
                        <td className="py-3.5 text-center text-slate-500 font-bold">{device.activeConn}</td>
                        <td className="py-3.5 text-center">
                          <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border ${ratingColor}`}>
                            {device.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Side Widget column (Deadlines & Activity Log) */}
        <div className="space-y-4 lg:space-y-6">

          {/* Upcoming Maintenance Widget */}
          <div className="bg-white border border-slate-200/50 p-5 lg:p-6 rounded-[1.5rem] lg:rounded-3xl shadow-premium">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-extrabold text-slate-900 text-sm">Upcoming Maintenance</h4>
              <span className="text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                <Calendar size={10} /> Active Alerts
              </span>
            </div>

            <div className="space-y-3.5">
              {alerts.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs">No upcoming maintenance.</div>
              ) : (
                alerts.map((task) => {
                  const today = new Date();
                  const due = new Date(task.dueDate);
                  const diffTime = due - today;
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                  let urgencyBg = "bg-slate-50 border-slate-100 text-slate-600";
                  if (diffDays <= 2) urgencyBg = "bg-rose-50 border-rose-100 text-rose-600";
                  else if (diffDays <= 5) urgencyBg = "bg-amber-50 border-amber-100 text-amber-600";

                  return (
                    <div
                      key={task.id}
                      className={`block p-3.5 border rounded-2xl hover:border-primary/30 transition-all duration-200 cursor-pointer ${urgencyBg}`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <span className="font-bold text-xs truncate max-w-[180px] text-slate-800">{task.name}</span>
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-inherit shrink-0">
                          {diffDays <= 0 ? "Today" : `In ${diffDays}d`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2.5 text-[10px] font-semibold text-slate-400">
                        <span className="uppercase tracking-wider">{task.category}</span>
                        <span>Due: {task.dueDate}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Activity Panel */}
          <div className="bg-white border border-slate-200/50 p-5 lg:p-6 rounded-[1.5rem] lg:rounded-3xl shadow-premium">
            <h4 className="font-extrabold text-slate-900 text-sm mb-4">Hardware Log Panel</h4>
            <div className="space-y-4">
              {activities.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs">No hardware activity available.</div>
              ) : (
                activities.slice(0, 4).map((act) => {
                  let dotColor = "bg-blue-500";
                  if (act.type === "complete") dotColor = "bg-emerald-500";
                  else if (act.type === "delete") dotColor = "bg-rose-500";
                  else if (act.type === "assign") dotColor = "bg-purple-500";

                  return (
                    <div key={act.id} className="flex gap-3 text-xs leading-relaxed">
                      <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${dotColor}`} />
                      <div className="flex flex-col">
                        <p className="font-medium text-slate-700">{act.text}</p>
                        <span className="text-[10px] text-slate-400 font-semibold mt-0.5">{act.time}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>

      {/* NEW SECTION: Detailed Task Breakdown -> Detailed Device Breakdown */}
      <div className="bg-white border border-slate-200/50 p-5 lg:p-8 rounded-[1.5rem] lg:rounded-3xl shadow-premium">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-extrabold text-slate-900 text-lg">Detailed Device Breakdown</h4>
          <button className="text-xs font-bold text-primary hover:text-primary-dark transition-all flex items-center gap-1">
            <span>View All Devices</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="pb-3.5 pl-2">Device Description</th>
                <th className="pb-3.5">Category</th>
                <th className="pb-3.5">Managed By</th>
                <th className="pb-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {devices.map((device) => {
                return (
                  <tr key={device.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 pl-2">
                      <p className="font-bold text-slate-800">{device.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5 line-clamp-1">{device.id} - {device.name}</p>
                    </td>
                    <td className="py-4">
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">{device.category}</span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700">{device.assignee}</span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border ${getStatusBadge(device.status)}`}>
                        {device.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {devices.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-400 font-medium text-sm">No devices available to display.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
