import React, { useState, useEffect } from "react";
import { taskService } from "../services/taskService";
import { BarChart3, TrendingUp, Award, Calendar, CheckSquare, Clock, FileText, FileSpreadsheet, File, Printer } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function Reports() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    setTasks(taskService.getTasks());
    setEmployees(taskService.getEmployees());
  }, []);

  const totalTasks = tasks.length;
  const completed = tasks.filter(t => t.status === "Completed").length;
  const inProgress = tasks.filter(t => t.status === "In Progress").length;
  const pending = tasks.filter(t => t.status === "Pending").length;
  const hold = tasks.filter(t => t.status === "Hold").length;

  const priorityHigh = tasks.filter(t => t.priority === "High").length;
  const priorityMedium = tasks.filter(t => t.priority === "Medium").length;
  const priorityLow = tasks.filter(t => t.priority === "Low").length;

  // Ratios
  const completionRatio = totalTasks ? Math.round((completed / totalTasks) * 100) : 0;
  const progressRatio = totalTasks ? Math.round((inProgress / totalTasks) * 100) : 0;

  // Export Data Preparation
  const getExportData = () => {
    return tasks.map(task => {
      const assignee = employees.find(e => e.id === task.assigneeId);
      return {
        "ID": task.id,
        "Task Name": task.name,
        "Category": task.category,
        "Assignee": assignee ? assignee.name : "Unassigned",
        "Priority": task.priority,
        "Status": task.status,
        "Due Date": task.dueDate,
        "Description": task.description || "",
      };
    });
  };

  const exportToCSV = () => {
    const data = getExportData();
    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Task_Reports.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToExcel = () => {
    const data = getExportData();
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tasks Report");
    XLSX.writeFile(wb, "Task_Reports.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const data = getExportData();
    const tableColumn = ["ID", "Task Name", "Category", "Assignee", "Priority", "Status", "Due Date"];
    const tableRows = [];

    data.forEach(task => {
      const taskData = [
        task.ID,
        task["Task Name"],
        task.Category,
        task.Assignee,
        task.Priority,
        task.Status,
        task["Due Date"]
      ];
      tableRows.push(taskData);
    });

    doc.setFontSize(18);
    doc.text("Task Reports Summary", 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Total Tasks: ${totalTasks} | Completed: ${completed} | In Progress: ${inProgress} | Pending: ${pending}`, 14, 30);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235] } // Primary color
    });

    doc.save("Task_Reports.pdf");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 lg:space-y-8 max-w-[1200px] mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Enterprise Analytics Reports</h2>
          <p className="text-slate-500 font-medium mt-1">Deep insight logs into task completion speeds, velocities, and resources.</p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={exportToCSV} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-all">
            <FileText size={14} /> CSV
          </button>
          <button onClick={exportToExcel} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 hover:text-emerald-600 shadow-sm transition-all">
            <FileSpreadsheet size={14} /> Excel
          </button>
          <button onClick={exportToPDF} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 hover:text-rose-600 shadow-sm transition-all">
            <File size={14} /> PDF
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-dark shadow-glow transition-all">
            <Printer size={14} /> Print
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 print:hidden">
        
        {/* Core summary metrics */}
        <div className="bg-white border border-slate-200/50 p-5 lg:p-6 rounded-[1.5rem] lg:rounded-3xl shadow-premium flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SLA Resolution Rate</p>
            <h3 className="text-3xl font-black text-slate-800 mt-2">{completionRatio}%</h3>
          </div>
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><Award size={24} /></div>
        </div>

        <div className="bg-white border border-slate-200/50 p-5 lg:p-6 rounded-[1.5rem] lg:rounded-3xl shadow-premium flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Milestones</p>
            <h3 className="text-3xl font-black text-slate-800 mt-2">{progressRatio}%</h3>
          </div>
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><TrendingUp size={24} /></div>
        </div>

        <div className="bg-white border border-slate-200/50 p-5 lg:p-6 rounded-[1.5rem] lg:rounded-3xl shadow-premium flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scope Volume</p>
            <h3 className="text-3xl font-black text-slate-800 mt-2">{totalTasks} registered</h3>
          </div>
          <div className="p-4 bg-primary/10 text-primary rounded-2xl"><CheckSquare size={24} /></div>
        </div>

      </div>

      {/* Analytics Visualization cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 print:grid-cols-1">
        
        {/* Priority Breakdown (Bar chart representation using simple pure HTML/CSS bars) */}
        <div className="bg-white border border-slate-200/50 p-5 lg:p-8 rounded-[1.5rem] lg:rounded-3xl shadow-premium space-y-4 lg:space-y-6">
          <h4 className="font-extrabold text-slate-900 text-base">Scope Priority Distribution</h4>
          
          <div className="space-y-4">
            {/* High Priority */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Critical / High Priority</span>
                <span className="text-rose-600">{priorityHigh} Tasks</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${totalTasks ? (priorityHigh/totalTasks)*100 : 0}%` }} />
              </div>
            </div>

            {/* Medium Priority */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Standard / Medium Priority</span>
                <span className="text-amber-600">{priorityMedium} Tasks</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${totalTasks ? (priorityMedium/totalTasks)*100 : 0}%` }} />
              </div>
            </div>

            {/* Low Priority */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Tactical / Low Priority</span>
                <span className="text-blue-600">{priorityLow} Tasks</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${totalTasks ? (priorityLow/totalTasks)*100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Task Velocity Metrics */}
        <div className="bg-white border border-slate-200/50 p-5 lg:p-8 rounded-[1.5rem] lg:rounded-3xl shadow-premium space-y-4 lg:space-y-6">
          <h4 className="font-extrabold text-slate-900 text-base">Milestone Progress Breakdown</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block mb-1.5" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed Scope</p>
              <h5 className="text-2xl font-black text-slate-800 mt-1">{completed}</h5>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block mb-1.5" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Run</p>
              <h5 className="text-2xl font-black text-slate-800 mt-1">{inProgress}</h5>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block mb-1.5" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">In Queue</p>
              <h5 className="text-2xl font-black text-slate-800 mt-1">{pending}</h5>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block mb-1.5" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">On Hold</p>
              <h5 className="text-2xl font-black text-slate-800 mt-1">{hold}</h5>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
