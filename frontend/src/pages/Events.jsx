import React, { useState, useEffect } from "react";
import { taskService } from "../services/taskService";
import { Calendar as CalendarIcon, MapPin, Users, ChevronRight, Info, CheckCircle2, Star } from "lucide-react";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // New Event Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEventName, setNewEventName] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventLocation, setNewEventLocation] = useState("");
  const [newEventAttendees, setNewEventAttendees] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const fetchedEvents = await taskService.getEvents();
      const fetchedEmps = await taskService.getEmployees();
      setEvents(fetchedEvents || []);
      setEmployees(fetchedEmps || []);
    }
    fetchData();
  }, []);

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentYear, currentMonth, i));
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return events.filter(e => e.date === dateString);
  };

  const getAttendees = (attendeeIds) => {
    if (!attendeeIds || attendeeIds.length === 0) return [];
    return attendeeIds.map(id => employees.find(emp => emp.id === id)).filter(Boolean);
  };

  const handleDateClick = (date) => {
    if (!date) return;
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    setSelectedDate(dateString);
    setNewEventName("");
    setNewEventDescription("");
    setNewEventLocation("");
    setNewEventAttendees([]);
    setIsModalOpen(true);
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEventName.trim()) return;

    const newEvent = {
      id: `e-${Date.now()}`,
      name: newEventName,
      date: selectedDate,
      description: newEventDescription,
      location: newEventLocation,
      attendeeIds: newEventAttendees,
    };

    setEvents(prev => [...prev, newEvent].sort((a, b) => new Date(a.date) - new Date(b.date)));
    setIsModalOpen(false);
  };

  const toggleAttendee = (empId) => {
    setNewEventAttendees(prev => 
      prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId]
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-fade-in pb-8 lg:pb-12">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[1.5rem] lg:rounded-[2rem] bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-5 sm:p-6 lg:p-10 shadow-premium flex flex-col md:flex-row justify-between items-center gap-4 lg:gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

        <div className="relative">
          <h2 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 flex items-center gap-3">
            <CalendarIcon size={32} className="text-indigo-500" />
            Software Events
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-semibold mt-2 text-sm max-w-xl leading-relaxed">
            Keep track of industry software events, conferences, and meetups. See which team members are attending to coordinate efforts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Calendar Section */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-[1.5rem] lg:rounded-[2rem] p-6 lg:p-8 shadow-premium">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-sm">
                {events.length} Events this month
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {dayNames.map(day => (
                <div key={day} className="text-center text-xs font-extrabold text-slate-400 uppercase tracking-wider py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 lg:gap-3">
              {days.map((date, idx) => {
                const dayEvents = getEventsForDate(date);
                const isToday = date && date.getDate() === today.getDate() && date.getMonth() === today.getMonth();

                return (
                  <div 
                    key={idx} 
                    onClick={() => handleDateClick(date)}
                    className={`min-h-[100px] lg:min-h-[120px] rounded-2xl p-2 transition-all duration-300 relative border cursor-pointer ${
                      !date ? "bg-transparent border-transparent cursor-default" : 
                      isToday ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30" : 
                      dayEvents.length > 0 ? "bg-white dark:bg-slate-800 border-indigo-100 dark:border-indigo-500/20 hover:border-indigo-300 shadow-sm hover:shadow-md" : 
                      "bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50 hover:border-slate-300"
                    }`}
                  >
                    {date && (
                      <>
                        <div className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full mb-2 ${
                          isToday ? "bg-indigo-600 text-white shadow-md" : "text-slate-600 dark:text-slate-300"
                        }`}>
                          {date.getDate()}
                        </div>
                        
                        <div className="space-y-1.5 overflow-hidden">
                          {dayEvents.map(ev => {
                            const attendees = getAttendees(ev.attendeeIds);
                            return (
                              <div 
                                key={ev.id} 
                                onClick={(e) => { e.stopPropagation(); setSelectedEvent(ev); }}
                                className="bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[10px] sm:text-xs font-bold p-1.5 sm:p-2 rounded-lg truncate hover:bg-indigo-100 transition-colors border border-indigo-100/50"
                              >
                                {ev.name}
                                {attendees.length > 0 && (
                                  <div className="flex -space-x-2 mt-1.5">
                                    {attendees.slice(0, 3).map((att, i) => (
                                      <img 
                                        key={i} 
                                        src={att.avatar} 
                                        alt={att.name} 
                                        title={att.name}
                                        className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 object-cover"
                                      />
                                    ))}
                                    {attendees.length > 3 && (
                                      <div className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 text-slate-600 flex items-center justify-center text-[8px] font-bold">
                                        +{attendees.length - 3}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Events List */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-[1.5rem] lg:rounded-[2rem] p-6 shadow-premium h-full">
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Star size={20} className="text-amber-500" />
              Upcoming Events
            </h3>

            <div className="space-y-4">
              {events.length === 0 ? (
                <div className="text-center py-10">
                  <CalendarIcon size={32} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-sm font-semibold text-slate-500">No events scheduled.</p>
                </div>
              ) : (
                events.map(ev => {
                  const attendees = getAttendees(ev.attendeeIds);
                  const evDate = new Date(ev.date);
                  const isSelected = selectedEvent?.id === ev.id;
                  
                  return (
                    <div 
                      key={ev.id}
                      onClick={() => setSelectedEvent(ev)}
                      className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer group ${
                        isSelected 
                          ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 shadow-md ring-2 ring-indigo-500/20" 
                          : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-indigo-200 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-center rounded-xl p-2 min-w-[50px] shrink-0">
                          <span className="block text-[10px] font-black uppercase">{monthNames[evDate.getMonth()].slice(0,3)}</span>
                          <span className="block text-lg font-black leading-none mt-0.5">{evDate.getDate()}</span>
                        </div>
                        <div className="flex-1 ml-4">
                          <h4 className="font-extrabold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 transition-colors">{ev.name}</h4>
                          <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-1">
                            <MapPin size={12} /> {ev.location}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 animate-fade-in">
                          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-4 leading-relaxed">
                            {ev.description}
                          </p>
                          
                          <div>
                            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                              <Users size={12} /> Attendees ({attendees.length})
                            </p>
                            {attendees.length > 0 ? (
                              <div className="space-y-2">
                                {attendees.map(att => (
                                  <div key={att.id} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                                    <img src={att.avatar} alt={att.name} className="w-6 h-6 rounded-full object-cover" />
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{att.name}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-400 italic">No attendees registered yet.</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative animate-fade-in border border-slate-200/50 dark:border-slate-700/50">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Add New Event</h3>
            <p className="text-sm font-medium text-slate-500 mb-6">Schedule an event for {selectedDate}</p>

            <form onSubmit={handleAddEvent} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Event Name</label>
                <input 
                  type="text" 
                  required
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 transition-colors"
                  placeholder="e.g. Technical Workshop"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Location</label>
                <input 
                  type="text" 
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 transition-colors"
                  placeholder="e.g. Remote / Room 204"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                <textarea 
                  rows="3"
                  value={newEventDescription}
                  onChange={(e) => setNewEventDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 transition-colors custom-scrollbar"
                  placeholder="Details about the event..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Attendees</label>
                <div className="max-h-40 overflow-y-auto custom-scrollbar border border-slate-200 dark:border-slate-700 rounded-xl p-2 space-y-1 bg-slate-50 dark:bg-slate-900">
                  {employees.map(emp => (
                    <div 
                      key={emp.id} 
                      onClick={() => toggleAttendee(emp.id)}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        newEventAttendees.includes(emp.id) 
                          ? "bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30" 
                          : "hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent"
                      }`}
                    >
                      <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full object-cover bg-white" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{emp.name}</p>
                        <p className="text-[10px] font-semibold text-slate-500">{emp.role || "Team Member"}</p>
                      </div>
                      {newEventAttendees.includes(emp.id) && (
                        <CheckCircle2 size={18} className="text-indigo-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-colors"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
