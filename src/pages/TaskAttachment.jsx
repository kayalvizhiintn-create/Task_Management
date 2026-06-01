import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { taskService } from "../services/taskService";
import { ArrowLeft, Maximize, ZoomIn, ZoomOut, Download, X } from "lucide-react";

export default function TaskAttachment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const fetchedTask = taskService.getTaskById(id);
    if (fetchedTask) setTask(fetchedTask);
  }, [id]);

  if (!task || !task.attachment) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Attachment Not Found</h2>
        <p className="text-slate-400 mb-8">This task doesn't have an attachment or has been deleted.</p>
        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-primary rounded-xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-colors">
          <ArrowLeft size={18} /> Go Back
        </button>
      </div>
    );
  }

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = task.attachment;
    a.download = `Task_${task.id}_Attachment.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen h-screen bg-[#0B1121] flex flex-col overflow-hidden fixed inset-0 z-[9999]">
      {/* Header bar */}
      <div className="h-16 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-lg">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white transition-colors" title="Go Back">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-white font-bold text-sm sm:text-lg leading-tight truncate max-w-[200px] sm:max-w-md">{task.name}</h1>
            <p className="text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-0.5">Image Viewer</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button onClick={handleDownload} className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 hover:text-indigo-300 transition-colors mr-2" title="Download Image">
            <Download size={18} />
          </button>
          
          <div className="w-px h-6 bg-slate-800 mx-1 hidden sm:block" />

          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white transition-colors" title="Zoom Out">
            <ZoomOut size={18} />
          </button>
          <span className="text-white text-xs font-bold w-12 text-center hidden sm:block">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(4, z + 0.25))} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white transition-colors" title="Zoom In">
            <ZoomIn size={18} />
          </button>
          <button onClick={() => setZoom(1)} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white transition-colors ml-1 mr-2" title="Fit to Screen">
            <Maximize size={18} />
          </button>
          
          <div className="w-px h-6 bg-slate-800 mx-1 hidden sm:block" />

          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors ml-2 shadow-lg" title="Cancel / Close">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Image Container */}
      <div className="flex-1 overflow-auto flex items-center justify-center relative custom-scrollbar bg-black">
        <div 
          className="transition-transform duration-300 ease-out flex items-center justify-center min-h-full w-full"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          <img 
            src={task.attachment} 
            alt="Task Attachment" 
            className="w-full h-[calc(100vh-4rem)] object-contain"
          />
        </div>
      </div>
    </div>
  );
}
