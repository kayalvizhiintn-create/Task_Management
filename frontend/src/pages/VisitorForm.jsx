import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Camera, Trash, Info, MessageSquare, Image as ImageIcon, Save } from "lucide-react";

export default function VisitorForm() {
  const navigate = useNavigate();
  const { id, type } = useParams(); // 'id' for edit, 'type' for add

  const [clientName, setClientName] = useState("");
  const [placesVisited, setPlacesVisited] = useState("");
  const [comments, setComments] = useState("");
  const [detailsAsked, setDetailsAsked] = useState("");
  const [improvementsSuggested, setImprovementsSuggested] = useState("");
  const [pictures, setPictures] = useState([]);
  const [activeTab, setActiveTab] = useState(type || "external");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem("navanala_visitors");
      if (saved) {
        const enquiries = JSON.parse(saved);
        const enquiry = enquiries.find(e => e.id === id);
        if (enquiry) {
          setClientName(enquiry.clientName || "");
          setPlacesVisited(enquiry.placesVisited || "");
          setComments(enquiry.comments || "");
          setDetailsAsked(enquiry.detailsAsked || "");
          setImprovementsSuggested(enquiry.improvementsSuggested || "");
          setPictures(enquiry.pictures || []);
          setActiveTab(enquiry.type || "external");
        }
      }
    }
    setLoading(false);
  }, [id]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };

    try {
      const base64Files = await Promise.all(files.map(file => convertToBase64(file)));
      setPictures(prev => [...prev, ...base64Files]);
    } catch (error) {
      console.error("Error converting images to Base64:", error);
      alert("Failed to load images. Please try smaller files.");
    }
  };

  const removePicture = (indexToRemove) => {
    setPictures(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const saved = localStorage.getItem("navanala_visitors");
    let enquiries = saved ? JSON.parse(saved) : [];

    if (id) {
      enquiries = enquiries.map(enq =>
        enq.id === id
          ? { ...enq, clientName, placesVisited, comments, detailsAsked, improvementsSuggested, pictures }
          : enq
      );
    } else {
      const newEnquiry = {
        id: `e${Date.now()}`,
        type: activeTab,
        clientName,
        placesVisited,
        comments,
        detailsAsked,
        improvementsSuggested,
        pictures,
        date: new Date().toISOString().split('T')[0]
      };
      enquiries = [newEnquiry, ...enquiries];
    }
    
    localStorage.setItem("navanala_visitors", JSON.stringify(enquiries));

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate(`/visitors/${activeTab}`);
    }, 1500);
  };

  if (loading) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8 animate-fade-in pb-8 lg:pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 lg:p-8 rounded-[2rem] shadow-premium border border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-slide-up relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/visitors/${activeTab}`)}
            className="p-3 bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light rounded-2xl shadow-sm hover:shadow-md transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {id ? "Edit Visit Record" : "Log New Visit"}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-semibold text-sm">
              {activeTab === "external" ? "External Company Client" : "Internal Department Member"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 lg:p-8 rounded-[2rem] shadow-premium border border-slate-100 dark:border-slate-700/50 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Section 1: Basic Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-black text-slate-800 dark:text-slate-200">
              <Info size={20} className="text-primary" /> Basic Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {activeTab === "external" ? "Client Company Name" : "Internal Dept/Employee Name"} *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Places Visited *
                </label>
                <input
                  type="text"
                  required
                  value={placesVisited}
                  onChange={(e) => setPlacesVisited(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Feedback Details */}
          <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-lg font-black text-slate-800 dark:text-slate-200">
              <MessageSquare size={20} className="text-indigo-500" /> Feedback & Discussion
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Comments *</label>
                <textarea
                  required
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={4}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Details Asked *</label>
                <textarea
                  required
                  value={detailsAsked}
                  onChange={(e) => setDetailsAsked(e.target.value)}
                  rows={4}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Improvements *</label>
                <textarea
                  required
                  value={improvementsSuggested}
                  onChange={(e) => setImprovementsSuggested(e.target.value)}
                  rows={4}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Media */}
          <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-lg font-black text-slate-800 dark:text-slate-200">
                <Camera size={20} className="text-slate-500" /> Attached Photos
              </div>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                Optional
              </span>
            </div>

            <div className="relative group border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-8 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-primary transition-all text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="w-16 h-16 bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <ImageIcon size={28} className="text-slate-400 group-hover:text-primary transition-colors" />
              </div>
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">Upload Visit Photos</h4>
              <p className="text-sm text-slate-500 font-medium">Drag & drop or click to browse (JPG, PNG)</p>
            </div>

            {pictures.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {pictures.map((pic, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-sm">
                    <img src={pic} alt="Upload preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <button
                        type="button"
                        onClick={() => removePicture(idx)}
                        className="p-2.5 bg-white text-rose-500 rounded-full hover:bg-rose-50 hover:scale-110 transition-all shadow-xl"
                      >
                        <Trash size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="pt-6 border-t border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(`/visitors/${activeTab}`)}
              className="px-6 py-3.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl font-bold text-sm transition-all shadow-sm w-full sm:w-auto text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold text-sm shadow-glow transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Save size={18} />
              Save Record
            </button>
          </div>
        </form>
      </div>

      {showToast && (
        <div className="fixed bottom-8 right-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-2xl shadow-premium flex items-center gap-3 border border-slate-800 dark:border-slate-100 z-50 animate-slide-up">
          <div className="bg-emerald-500/20 p-1.5 rounded-full">
            <CheckCircle2 size={20} className="text-emerald-500" />
          </div>
          <span className="text-sm font-bold tracking-wide">Record saved successfully!</span>
        </div>
      )}
    </div>
  );
}
