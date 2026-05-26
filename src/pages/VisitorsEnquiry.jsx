import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Plus,
  Search,
  MessageSquare,
  HelpCircle,
  TrendingUp,
  Camera,
  X,
  Check,
  Image as ImageIcon,
  Briefcase,
  Users,
  Edit,
  Trash,
  Calendar,
  Building,
  ChevronRight,
  Info
} from "lucide-react";

export default function VisitorsEnquiry() {
  const { type } = useParams();
  const navigate = useNavigate();
  const activeTab = type || "external";
  const [globalSearch, setGlobalSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [enquiries, setEnquiries] = useState(() => {
    const saved = localStorage.getItem("navanala_visitors");
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: "e1",
        type: "external",
        clientName: "TechCorp Global",
        placesVisited: "Innovation Lab, Main Server Room",
        comments: "Very impressed with the new server setup and security protocols.",
        detailsAsked: "Asked for the detailed specs of the cooling systems and backup generators.",
        improvementsSuggested: "Suggested more automated logging in the visitor logs.",
        pictures: ["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=300&h=200"],
        date: "2026-05-20"
      },
      {
        id: "e2",
        type: "internal",
        clientName: "HR Department Leads",
        placesVisited: "Cafeteria, New Wellness Center",
        comments: "The wellness center looks great, very spacious.",
        detailsAsked: "Asked about the schedule for yoga classes.",
        improvementsSuggested: "Requested a coffee machine closer to the relaxation area.",
        pictures: ["https://images.unsplash.com/photo-1572025442646-866d16c84a54?auto=format&fit=crop&q=80&w=300&h=200"],
        date: "2026-05-21"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("navanala_visitors", JSON.stringify(enquiries));
  }, [enquiries]);

  // Form states
  const [clientName, setClientName] = useState("");
  const [placesVisited, setPlacesVisited] = useState("");
  const [comments, setComments] = useState("");
  const [detailsAsked, setDetailsAsked] = useState("");
  const [improvementsSuggested, setImprovementsSuggested] = useState("");
  const [pictures, setPictures] = useState([]);
  const [editingId, setEditingId] = useState(null);

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
      alert("Failed to load images. Please try smaller files to avoid browser memory limits.");
    }
  };

  const removePicture = (indexToRemove) => {
    setPictures(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const openModal = (enquiry = null) => {
    if (enquiry && enquiry.id) {
      setClientName(enquiry.clientName);
      setPlacesVisited(enquiry.placesVisited);
      setComments(enquiry.comments);
      setDetailsAsked(enquiry.detailsAsked);
      setImprovementsSuggested(enquiry.improvementsSuggested);
      setPictures(enquiry.pictures || []);
      setEditingId(enquiry.id);
    } else {
      setClientName("");
      setPlacesVisited("");
      setComments("");
      setDetailsAsked("");
      setImprovementsSuggested("");
      setPictures([]);
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      setEnquiries(enquiries.map(enq =>
        enq.id === editingId
          ? { ...enq, clientName, placesVisited, comments, detailsAsked, improvementsSuggested, pictures }
          : enq
      ));
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
      setEnquiries([newEnquiry, ...enquiries]);
    }
    closeModal();
  };

  const deleteEnquiry = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setEnquiries(enquiries.filter(e => e.id !== id));
    }
  };

  const filteredEnquiries = enquiries.filter(e =>
    e.type === activeTab &&
    (e.clientName.toLowerCase().includes(globalSearch.toLowerCase()) ||
      e.placesVisited.toLowerCase().includes(globalSearch.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 font-sans text-slate-900 dark:text-slate-100 relative overflow-hidden transition-colors duration-500">
      {/* Decorative Background Effects */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none z-0" />
      <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">

        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 p-8 rounded-[2rem] shadow-xl shadow-indigo-500/5">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <MapPin size={14} /> Visitor Log Book
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Visitors <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Enquiry</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-medium">
              Maintain a comprehensive record of visits from external clients and internal staff. Monitor feedback, pinpoint locations visited, and track action items.
            </p>
          </div>

          <button
            onClick={() => openModal()}
            className="group relative flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-bold text-sm overflow-hidden shadow-2xl shadow-slate-900/20 hover:shadow-indigo-500/20 transition-all hover:-translate-y-1 w-full md:w-auto justify-center shrink-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Plus size={20} className="relative z-10 group-hover:rotate-90 transition-transform duration-500" />
            <span className="relative z-10 group-hover:text-white">Log New Visit</span>
          </button>
        </header>

        {/* Controls: Search and Tabs */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          {/* Tabs */}
          <div className="flex p-1.5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg rounded-[1.5rem] w-full lg:w-auto border border-white/40 dark:border-slate-800 shadow-lg shadow-slate-200/20 dark:shadow-none">
            <button
              onClick={() => navigate("/visitors/external")}
              className={`flex-1 lg:w-48 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${activeTab === "external"
                  ? "bg-white dark:bg-slate-800 text-primary shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
            >
              <Briefcase size={18} />
              External
            </button>
            <button
              onClick={() => navigate("/visitors/internal")}
              className={`flex-1 lg:w-48 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${activeTab === "internal"
                  ? "bg-white dark:bg-slate-800 text-primary shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
            >
              <Users size={18} />
              Internal
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-96 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search visits by name or place..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg border border-white/40 dark:border-slate-800 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-lg shadow-slate-200/20 dark:shadow-none placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Cards Grid */}
        {filteredEnquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/40 dark:border-slate-800 rounded-[2.5rem] shadow-xl text-center">
            <div className="w-24 h-24 bg-indigo-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <MapPin size={40} className="text-indigo-300 dark:text-indigo-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">No visits found</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium text-lg">
              There are no {activeTab === "external" ? "external" : "internal"} visits recorded yet. Start by logging the first visitor.
            </p>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-white dark:bg-slate-800 text-primary dark:text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 border border-slate-100 dark:border-slate-700"
            >
              <Plus size={18} /> Add First Entry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:gap-8">
            {filteredEnquiries.map(enquiry => (
              <div
                key={enquiry.id}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 lg:p-8 shadow-xl shadow-slate-200/20 dark:shadow-none hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-indigo-500/20 flex items-center justify-center shrink-0 border border-white/50 dark:border-slate-700">
                      {activeTab === "external" ? (
                        <Building size={24} className="text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <Users size={24} className="text-indigo-600 dark:text-indigo-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{enquiry.clientName}</h3>
                      <div className="flex items-center gap-2 mt-1 text-slate-500 dark:text-slate-400 text-sm font-semibold">
                        <Calendar size={14} />
                        {enquiry.date}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => openModal(enquiry)}
                      className="p-2.5 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-500/20 rounded-xl transition-all"
                      title="Edit"
                    >
                      <Edit size={16} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => deleteEnquiry(enquiry.id)}
                      className="p-2.5 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-500/20 rounded-xl transition-all"
                      title="Delete"
                    >
                      <Trash size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                {/* Places Visited Badges */}
                <div className="mb-8">
                  <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Locations Visited</div>
                  <div className="flex flex-wrap gap-2">
                    {enquiry.placesVisited.split(',').map((place, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium border border-slate-200 dark:border-slate-700">
                        <MapPin size={14} className="text-primary" />
                        {place.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 p-5 rounded-2xl space-y-3 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                      <MessageSquare size={16} /> Comments
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{enquiry.comments}</p>
                  </div>

                  <div className="bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10 p-5 rounded-2xl space-y-3 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                      <HelpCircle size={16} /> Details Asked
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{enquiry.detailsAsked}</p>
                  </div>

                  <div className="bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 p-5 rounded-2xl space-y-3 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                      <TrendingUp size={16} /> Improvements
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{enquiry.improvementsSuggested}</p>
                  </div>
                </div>

                {/* Pictures Gallery */}
                {enquiry.pictures && enquiry.pictures.length > 0 && (
                  <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Attached Media
                      </div>
                      <div className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                        {enquiry.pictures.length} photos
                      </div>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar snap-x">
                      {enquiry.pictures.map((pic, idx) => (
                        <div key={idx} className="relative w-32 h-32 rounded-2xl overflow-hidden shrink-0 snap-start border border-slate-200 dark:border-slate-700 group/pic cursor-pointer">
                          <img src={pic} alt={`Visit ${idx + 1}`} className="w-full h-full object-cover group-hover/pic:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-slate-900/0 group-hover/pic:bg-slate-900/20 transition-colors duration-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modern Glassmorphic Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 py-12">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-md transition-opacity"
            onClick={closeModal}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-full animate-in fade-in zoom-in-95 duration-300 border border-white/50 dark:border-slate-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  {activeTab === "external" ? <Building size={24} /> : <Users size={24} />}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    {editingId ? "Edit Visit Record" : "Log New Visit"}
                  </h2>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                    {activeTab === "external" ? "External Company Client" : "Internal Department Member"}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="overflow-y-auto px-8 py-8 custom-scrollbar">
              <form id="enquiryForm" onSubmit={handleSave} className="space-y-8">

                {/* Section 1: Basic Info */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-lg font-black text-slate-800 dark:text-slate-200">
                    <Info size={20} className="text-primary" /> Basic Information
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {activeTab === "external" ? "Client Company Name" : "Internal Dept/Employee Name"} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder={activeTab === "external" ? "e.g. Acme Corp" : "e.g. Finance Dept - John Doe"}
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        Places Visited <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={placesVisited}
                        onChange={(e) => setPlacesVisited(e.target.value)}
                        placeholder="e.g. Server Room, Main Office"
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white"
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
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Comments <span className="text-rose-500">*</span></label>
                      <textarea
                        required
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="General impressions and thoughts..."
                        rows={4}
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Details Asked <span className="text-rose-500">*</span></label>
                      <textarea
                        required
                        value={detailsAsked}
                        onChange={(e) => setDetailsAsked(e.target.value)}
                        placeholder="Specific questions raised..."
                        rows={4}
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Improvements <span className="text-rose-500">*</span></label>
                      <textarea
                        required
                        value={improvementsSuggested}
                        onChange={(e) => setImprovementsSuggested(e.target.value)}
                        placeholder="Suggestions for improvement..."
                        rows={4}
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none text-slate-900 dark:text-white"
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
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="enquiryForm"
                className="px-8 py-3.5 bg-primary hover:bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-indigo-600/30 transition-all hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Check size={18} strokeWidth={3} />
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
