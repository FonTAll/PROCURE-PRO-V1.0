import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Search, 
  Clock, 
  List, 
  LayoutGrid, 
  HelpCircle, 
  X,
  Pencil, 
  Trash2, 
  CheckCircle2, 
  Save, 
  CalendarDays, 
  CheckSquare, 
  Package,
  Palmtree,
  ShoppingCart,
  Truck,
  Users,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Swal from 'sweetalert2';

// --- Global Palette for Procurement ---
const palette = {
    primaryDark: '#1f2a44',     // Navy (Primary Dark)
    primary: '#5372ba',         // Primary Blue
    accent: '#ce870a',          // Gold Accent
    danger: '#ff929a',          // Danger / Holiday
    purple: '#999dc7',          // Saturday / QC
    success: '#596c33',
    bg: '#f7f3ee'               // Main Bg
};

// --- Sub Component: KpiCard ---
interface KpiCardProps {
    title: string;
    val: number | string;
    color: string;
    IconComponent: any;
    desc: string;
}

const KpiCard = ({ title, val, color, IconComponent, desc }: KpiCardProps) => (
    <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-silver/50 relative overflow-hidden group h-full cursor-pointer">
        <div className="absolute -right-4 -bottom-4 opacity-[0.05] transform rotate-12 group-hover:scale-110 transition-transform duration-700 pointer-events-none z-0">
            <IconComponent size={100} style={{ color: color }} />
        </div>
        <div className="relative z-10 flex justify-between items-start">
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <p className="text-[10px] font-bold text-dusty-blue uppercase tracking-wider truncate">{title}</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                    <h4 className="text-2xl font-black font-mono tracking-tighter leading-none truncate text-primary-dark">{val}</h4>
                </div>
                {desc && (
                    <p className="text-[9px] text-deep-navy font-bold mt-1.5 flex items-center gap-1.5 truncate uppercase bg-white/40 w-fit px-2 py-0.5 rounded-full border border-black/5">
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{backgroundColor: color}}></span>
                        {desc}
                    </p>
                )}
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-white bg-slate-50 relative overflow-hidden group-hover:scale-105 transition-transform">
                <div className="absolute inset-0 opacity-10" style={{ backgroundColor: color }}></div>
                <IconComponent size={20} strokeWidth={2.5} style={{ color: color }} />
            </div>
        </div>
    </div>
);

// Form Types
interface EventForm {
    id: string;
    date: string;
    title: string;
    time: string;
    type: string;
    priority: string;
    status: string;
    isHoliday: boolean;
}

export default function CalendarPage() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'list'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 15)); // Default to March 2026
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Event Management States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  
  // Pagination States for List View
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Initial Events customized for Procurement
  const [events, setEvents] = useState([
    { id: 'HL-001', date: '2026-01-01', title: 'วันขึ้นปีใหม่', time: 'All Day', type: 'Holiday', priority: 'High', status: 'Confirmed', color: 'bg-red-50 text-rose-600 border-rose-100', isHoliday: true },
    { id: 'HL-002', date: '2026-04-06', title: 'วันจักรี', time: 'All Day', type: 'Holiday', priority: 'High', status: 'Confirmed', color: 'bg-red-50 text-rose-600 border-rose-100', isHoliday: true },
    { id: 'HL-003', date: '2026-04-13', title: 'วันสงกรานต์', time: 'All Day', type: 'Holiday', priority: 'High', status: 'Confirmed', color: 'bg-red-50 text-rose-600 border-rose-100', isHoliday: true },
    
    // Procurement Mock Data
    { id: 'EV-001', date: '2026-03-09', title: 'PR Approval: IT Equipment', time: '09:00', type: 'PR Approval', priority: 'High', status: 'Scheduled', color: 'bg-blue-50 text-blue-700 border-blue-100', isHoliday: false },
    { id: 'EV-002', date: '2026-03-12', title: 'PO Issuance: Raw Materials', time: '13:00', type: 'PO Issuance', priority: 'Critical', status: 'Confirmed', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', isHoliday: false },
    { id: 'EV-003', date: '2026-03-15', title: 'Vendor Meeting: TechSupplies Co', time: '10:00', type: 'Vendor Meeting', priority: 'Normal', status: 'Scheduled', color: 'bg-purple-50 text-purple-700 border-purple-100', isHoliday: false },
    { id: 'EV-004', date: '2026-03-18', title: 'Delivery: Office Supplies', time: '08:00', type: 'Delivery', priority: 'High', status: 'Confirmed', color: 'bg-amber-50 text-amber-700 border-amber-100', isHoliday: false },
    { id: 'EV-005', date: '2026-03-20', title: 'Supplier Audit: WoodCrafters', time: '15:30', type: 'Audit', priority: 'Normal', status: 'Confirmed', color: 'bg-slate-50 text-slate-700 border-slate-100', isHoliday: false },
  ]);

  const [eventForm, setEventForm] = useState<EventForm>({
    id: '', date: '', title: '', time: '', type: 'PR Approval', priority: 'Normal', status: 'Scheduled', isHoliday: false
  });

  const daysOfWeek = [
    { label: 'SUN', color: palette.danger },
    { label: 'MON', color: palette.primaryDark },
    { label: 'TUE', color: palette.primaryDark },
    { label: 'WED', color: palette.primaryDark },
    { label: 'THU', color: palette.primaryDark },
    { label: 'FRI', color: palette.primaryDark },
    { label: 'SAT', color: palette.purple }
  ];

  // Calendar Logic
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push({ day: null, dateStr: '', isToday: false, isWeekend: false });
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ 
        day: i, 
        dateStr,
        isToday: dateStr === new Date().toISOString().split('T')[0],
        isWeekend: (new Date(year, month, i).getDay() === 0 || new Date(year, month, i).getDay() === 6)
      });
    }
    return days;
  }, [currentDate]);

  // Filtering Logic
  const filteredEvents = useMemo(() => {
    return events.filter(ev => {
      const matchSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ev.type.toLowerCase().includes(searchQuery.toLowerCase());
      const evMonth = ev.date.substring(0, 7);
      const currMonth = currentDate.toISOString().substring(0, 7);
      return matchSearch && (activeTab === 'list' ? true : evMonth === currMonth);
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, searchQuery, currentDate, activeTab]);

  // Pagination Logic
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(start, start + itemsPerPage);
  }, [filteredEvents, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage) || 1;

  // Handlers
  const handlePrevMonth = () => { setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)); setCurrentPage(1); };
  const handleNextMonth = () => { setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)); setCurrentPage(1); };
  const handleSetToday = () => { setCurrentDate(new Date()); setCurrentPage(1); };

  const openEventModal = (mode: 'create' | 'edit', data: any = null, type: 'Event' | 'Holiday' = 'Event') => {
    setModalMode(mode);
    if (mode === 'create') {
      const isHolidays = type === 'Holiday';
      setEventForm({
        id: isHolidays ? `HL-${String(events.length + 1).padStart(3, '0')}` : `EV-${String(events.length + 1).padStart(3, '0')}`,
        date: data?.dateStr || new Date().toISOString().split('T')[0],
        title: '',
        time: isHolidays ? 'All Day' : '08:00',
        type: isHolidays ? 'Holiday' : 'PR Approval',
        priority: isHolidays ? 'High' : 'Normal',
        status: 'Scheduled',
        isHoliday: isHolidays
      });
    } else {
      const cleanedTitle = data.title.replace(/^\*/, '');
      setEventForm({ ...data, title: cleanedTitle });
    }
    setIsModalOpen(true);
  };

  const handleSaveEvent = () => {
    if (!eventForm.title || !eventForm.date) {
        Swal.fire({
            icon: 'warning',
            title: 'Missing Info',
            text: 'Please fill out all required fields.',
            confirmButtonColor: palette.primary
        });
        return;
    }
    const processedTitle = eventForm.title.replace(/^\*/, '');
    const typeColors: Record<string, string> = {
      'PR Approval': 'bg-blue-50 text-blue-700 border-blue-100',
      'PO Issuance': 'bg-emerald-50 text-emerald-700 border-emerald-100',
      'Vendor Meeting': 'bg-purple-50 text-purple-700 border-purple-100',
      'Delivery': 'bg-amber-50 text-amber-700 border-amber-100',
      'Audit': 'bg-slate-50 text-slate-700 border-slate-100',
      'Holiday': 'bg-red-50 text-rose-600 border-rose-100'
    };
    if (modalMode === 'create') {
      const newEntry = { 
        ...eventForm, title: processedTitle, color: typeColors[eventForm.type] || 'bg-slate-50 text-slate-700 border-slate-100' 
      };
      setEvents([...events, newEntry]);
      Swal.fire({
        icon: 'success',
        title: 'Saved',
        text: 'The schedule has been successfully created.',
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      setEvents(events.map(e => e.id === eventForm.id ? { ...eventForm, title: processedTitle, color: typeColors[eventForm.type] } : e));
      Swal.fire({
        icon: 'success',
        title: 'Updated',
        text: 'The schedule has been updated.',
        timer: 1500,
        showConfirmButton: false
      });
    }
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "คุณต้องการลบรายการนี้ใช่หรือไม่?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: palette.danger,
        cancelButtonColor: '#94a3b8',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            setEvents(events.filter(e => e.id !== id));
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'The schedule has been deleted.',
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Settings for minimal tables */}
      <style>{`
.calendar-grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); }
        .day-cell { min-height: 120px; border-right: 1px solid #d7d7d7; border-bottom: 1px solid #d7d7d7; }
        .day-cell:nth-child(7n) { border-right: none; }
        .minimal-th { font-size: 12px !important; text-transform: uppercase; letter-spacing: 0.1em; color: white; padding: 18px 16px; font-weight: 800; background-color: #1f2a44; border-bottom: 3px solid ${palette.accent}; white-space: nowrap; }
        .minimal-td { padding: 14px 16px; vertical-align: middle; color: #1f2a44; font-size: 12px !important; font-weight: 500; border-bottom: 1px solid rgba(0,0,0,0.05); }
      `}</style>

      {/* Header */}
      <header className="flex flex-wrap items-center justify-between px-6 py-4 gap-4 shrink-0 bg-transparent">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm border border-silver">
                <CalendarIcon size={24} className="text-primary-dark" strokeWidth={2.5} />
            </div>
            <div>
                <h2 className="text-primary-dark font-black tracking-tight text-2xl uppercase leading-none">
                    Procurement <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-blue drop-shadow-sm">Calendar</span>
                </h2>
                <p className="text-dusty-blue text-[10px] font-bold mt-1 uppercase tracking-widest leading-none">Schedule & Activities Planning</p>
            </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white p-1 rounded-xl border border-silver shadow-sm">
            <button onClick={() => setActiveTab('calendar')} className={`px-4 py-1.5 text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-2 rounded-lg ${activeTab === 'calendar' ? 'bg-primary-dark text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                <LayoutGrid size={14} /> Calendar
            </button>
            <button onClick={() => setActiveTab('list')} className={`px-4 py-1.5 text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-2 rounded-lg ${activeTab === 'list' ? 'bg-primary-dark text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                <List size={14} /> Event List
            </button>
          </div>
          <button onClick={() => setIsGuideOpen(true)} className="p-2 bg-white border border-silver rounded-xl text-dusty-blue hover:text-primary transition-all shadow-sm">
            <HelpCircle size={18} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6 space-y-6 w-full relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard title="Active PR/PO" val={filteredEvents.filter(e=>!e.isHoliday && (e.type === 'PR Approval' || e.type === 'PO Issuance')).length} color={palette.primary} IconComponent={ShoppingCart} desc="In Pipeline" />
            <KpiCard title="Upcoming Deliveries" val={events.filter(e=>e.type === 'Delivery' && new Date(e.date) >= new Date()).length} color={palette.success} IconComponent={Truck} desc="Scheduled Receipts" />
            <KpiCard title="Vendor Activities" val={events.filter(e=>e.type==='Vendor Meeting' || e.type==='Audit').length} color={palette.accent} IconComponent={Users} desc="Meetings & Audits" />
            <KpiCard title="Total Tasks" val={filteredEvents.length} color={palette.primaryDark} IconComponent={CalendarDays} desc="This Month" />
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-silver/50 flex flex-col overflow-hidden min-h-[600px]">
          
          <div className="px-6 py-4 border-b border-silver flex flex-col lg:flex-row items-center justify-between gap-4 bg-bg-main">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-silver shadow-sm">
                <button onClick={handlePrevMonth} className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors text-dusty-blue"><ChevronLeft size={18}/></button>
                <div className="px-4 text-[14px] font-black text-primary-dark uppercase tracking-widest min-w-[160px] text-center">
                  {currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                <button onClick={handleNextMonth} className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors text-dusty-blue"><ChevronRight size={18}/></button>
              </div>
              <button onClick={handleSetToday} className="px-5 h-9 bg-white border border-silver text-primary-dark font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all text-[10px] shadow-sm">Today</button>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dusty-blue" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search activities..." className="w-full pl-9 pr-4 py-2 text-[11px] font-bold rounded-xl border border-silver focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white transition-all shadow-sm" />
              </div>
              <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEventModal('create', null, 'Event')} className="sys-btn-primary flex items-center gap-2">
                    <Plus size={14} strokeWidth={3} className="text-gold" /> Add Task
                  </button>
                  <button onClick={() => openEventModal('create', null, 'Holiday')} className="px-4 h-9 bg-rose-50 text-danger border border-danger/30 rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-rose-100 transition-all flex items-center gap-2 shadow-sm">
                    <Palmtree size={14} strokeWidth={2.5} /> Holiday
                  </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'calendar' ? (
              <div className="flex flex-col">
                <div className="calendar-grid border-b border-silver">
                  {daysOfWeek.map((day, idx) => (
                    <div key={idx} style={{ backgroundColor: day.color }} className="py-2 text-center text-[10px] font-black tracking-[0.2em] text-white">
                      {day.label}
                    </div>
                  ))}
                </div>
                <div className="calendar-grid bg-white/50">
                  {calendarDays.map((d, idx) => {
                    const dayEvents = events.filter(e => e.date === d.dateStr);
                    const isSunday = idx % 7 === 0;
                    const isSaturday = idx % 7 === 6;

                    return (
                      <div key={idx} className={`day-cell p-2 transition-colors relative group ${!d.day ? 'bg-black/5 opacity-50' : 'bg-white hover:bg-slate-50/80'} ${isSunday && d.day ? 'bg-rose-50/30' : ''} ${isSaturday && d.day ? 'bg-slate-50/50' : ''}`}>
                        {d.day && (
                          <>
                            <div className="flex justify-between items-start mb-2">
                              <span className={`w-6 h-6 flex items-center justify-center rounded-full font-black text-[12px] ${d.isToday ? 'bg-primary text-white shadow-sm' : 'text-primary-dark'} ${isSunday && !d.isToday ? 'text-danger' : ''}`}>{d.day}</span>
                            </div>
                            <div className="space-y-1 overflow-y-auto max-h-[85px] custom-scrollbar pb-6">
                              {dayEvents.map((ev, i) => (
                                <div key={i} onClick={() => openEventModal('edit', ev)} className={`px-2 py-1 rounded-[6px] text-[9.5px] font-bold border truncate shadow-sm cursor-pointer hover:scale-[1.02] transition-all flex items-center gap-1.5 ${ev.color}`}>
                                  {ev.isHoliday && <Palmtree size={10} className="shrink-0" />}
                                  {ev.title.replace(/^\*/, '')}
                                </div>
                              ))}
                            </div>
                            <button onClick={() => openEventModal('create', d, 'Event')} className="absolute bottom-2 right-2 w-6 h-6 bg-primary-dark rounded-lg shadow-sm flex items-center justify-center text-gold opacity-0 group-hover:opacity-100 transition-all active:scale-95">
                              <Plus size={14} strokeWidth={3} />
                            </button>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead className="sticky top-0 z-10">
                    <tr>
                      <th className="minimal-th">Date & Time</th>
                      <th className="minimal-th text-gold">Task Description</th>
                      <th className="minimal-th">Category</th>
                      <th className="minimal-th text-center">Priority</th>
                      <th className="minimal-th text-center">Status</th>
                      <th className="minimal-th text-center w-24">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-silver/50">
                    {paginatedEvents.map((ev) => (
                      <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="minimal-td">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-black text-primary-dark uppercase flex items-center gap-1.5 leading-none">
                              <CalendarDays size={14} className="text-dusty-blue" />
                              {new Date(ev.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            <span className="text-[10px] text-dusty-blue font-bold flex items-center gap-1.5 leading-none pl-5">
                              <Clock size={11} className="text-gold"/> {ev.time}
                            </span>
                          </div>
                        </td>
                        <td className="minimal-td">
                          <div className={`flex items-center gap-2 font-black uppercase tracking-tight ${ev.isHoliday ? 'text-danger' : 'text-primary-dark'}`}>
                            {ev.isHoliday && <Palmtree size={14} className="text-danger" />}
                            {ev.title.replace(/^\*/, '')}
                          </div>
                        </td>
                        <td className="minimal-td">
                          <span className={`px-2.5 py-1 rounded-md text-[9px] font-black border uppercase tracking-[0.1em] shadow-sm inline-block ${ev.color}`}>
                            {ev.type}
                          </span>
                        </td>
                        <td className="minimal-td text-center">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shadow-sm border ${ev.priority === 'High' || ev.priority === 'Critical' ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                            {ev.priority}
                          </span>
                        </td>
                        <td className="minimal-td text-center">
                          <div className={`flex items-center justify-center gap-1.5 text-[10px] font-black uppercase border rounded-lg py-1 px-2.5 w-fit mx-auto shadow-sm ${ev.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                             {ev.status === 'Completed' ? <CheckCircle2 size={12}/> : <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"/>}
                             {ev.status}
                          </div>
                        </td>
                        <td className="minimal-td text-center">
                          <div className="flex justify-center gap-[0.5px]">
                            <button onClick={() => openEventModal('edit', ev)} className="w-8 h-8 flex items-center justify-center text-primary hover:bg-primary/10 rounded transition-colors"><Pencil size={16}/></button>
                            <button onClick={() => handleDeleteEvent(ev.id)} className="w-8 h-8 flex items-center justify-center text-danger hover:bg-danger/10 rounded transition-colors"><Trash2 size={16}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {paginatedEvents.length === 0 && (
                      <tr><td colSpan={6} className="px-6 py-16 text-center text-dusty-blue italic font-bold uppercase tracking-widest">No matching activities in current scope</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {activeTab === 'list' && (
            <div className="px-6 py-3 border-t border-silver bg-bg-main flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 font-mono">
                <div className="text-[10px] font-bold text-dusty-blue uppercase tracking-widest">Displaying {paginatedEvents.length} of {filteredEvents.length} records</div>
                <div className="flex items-center gap-1">
                    <button onClick={()=>setCurrentPage(p=>Math.max(1, p-1))} disabled={currentPage===1} className="p-1.5 rounded-lg border border-silver bg-white text-primary-dark disabled:opacity-50 hover:bg-slate-50 shadow-sm transition-all"><ChevronLeft size={14}/></button>
                    <div className="flex items-center px-3 h-8 bg-white border border-silver rounded-lg shadow-sm text-[10px] font-bold text-primary-dark">PAGE {currentPage} / {totalPages}</div>
                    <button onClick={()=>setCurrentPage(p=>Math.min(totalPages, p+1))} disabled={currentPage===totalPages} className="p-1.5 rounded-lg border border-silver bg-white text-primary-dark disabled:opacity-50 hover:bg-slate-50 shadow-sm transition-all"><ChevronRight size={14}/></button>
                </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal: Add / Edit Event */}
      <AnimatePresence>
      {isModalOpen && (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-primary-dark/40 backdrop-blur-sm"
        >
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-silver flex flex-col"
            >
                <div className="bg-bg-main border-b border-silver px-6 py-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        {eventForm.isHoliday ? <Palmtree size={20} className="text-danger" /> : <CalendarDays size={20} className="text-primary" />}
                        <h2 className="text-[14px] font-black text-primary-dark uppercase tracking-widest">{modalMode === 'create' ? (eventForm.isHoliday ? 'New Holiday' : 'Create Task') : 'Modify Entry'}</h2>
                    </div>
                    <button onClick={()=>setIsModalOpen(false)} className="p-1.5 text-dusty-blue hover:text-primary-dark hover:bg-white rounded-lg transition-all"><X size={18}/></button>
                </div>

                <div className="p-6 space-y-5 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-dusty-blue uppercase tracking-widest">{eventForm.isHoliday ? 'Holiday Name' : 'Task Description'}</label>
                        <input value={eventForm.title} onChange={e=>setEventForm({...eventForm, title: e.target.value})} className="w-full border border-silver rounded-lg px-3 py-2 text-[12px] font-bold text-primary-dark focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all shadow-sm" placeholder={eventForm.isHoliday ? "ระบุชื่อวันสำคัญ..." : "PR Approval / Follow up meeting..."} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-dusty-blue uppercase tracking-widest">Date</label>
                            <input type="date" value={eventForm.date} onChange={e=>setEventForm({...eventForm, date: e.target.value})} className="w-full border border-silver rounded-lg px-3 py-2 text-[12px] font-bold text-primary-dark focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all shadow-sm" />
                        </div>
                        {!eventForm.isHoliday && (
                          <div className="space-y-1">
                              <label className="text-[10px] font-bold text-dusty-blue uppercase tracking-widest">Time</label>
                              <div className="relative">
                                <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dusty-blue" />
                                <input type="time" value={eventForm.time} onChange={e=>setEventForm({...eventForm, time: e.target.value})} className="w-full pl-9 border border-silver rounded-lg py-2 text-[12px] font-bold text-primary-dark focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all shadow-sm" />
                              </div>
                          </div>
                        )}
                    </div>

                    {!eventForm.isHoliday && (
                      <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-1 relative">
                              <label className="text-[10px] font-bold text-dusty-blue uppercase tracking-widest">Category</label>
                              <select value={eventForm.type} onChange={e=>setEventForm({...eventForm, type: e.target.value})} className="w-full border border-silver rounded-lg px-2 py-2 text-[11px] font-bold text-primary-dark outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer shadow-sm appearance-none">
                                <option>PR Approval</option><option>PO Issuance</option><option>Vendor Meeting</option><option>Delivery</option><option>Audit</option>
                              </select>
                          </div>
                          <div className="space-y-1 relative">
                              <label className="text-[10px] font-bold text-dusty-blue uppercase tracking-widest">Priority</label>
                              <select value={eventForm.priority} onChange={e=>setEventForm({...eventForm, priority: e.target.value})} className="w-full border border-silver rounded-lg px-2 py-2 text-[11px] font-bold text-primary-dark outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer shadow-sm appearance-none">
                                <option>Low</option><option>Normal</option><option>High</option><option>Critical</option>
                              </select>
                          </div>
                          <div className="space-y-1 relative">
                              <label className="text-[10px] font-bold text-dusty-blue uppercase tracking-widest">Status</label>
                              <select value={eventForm.status} onChange={e=>setEventForm({...eventForm, status: e.target.value})} className="w-full border border-silver rounded-lg px-2 py-2 text-[11px] font-black text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer uppercase shadow-sm appearance-none">
                                <option>Scheduled</option><option>Confirmed</option><option>Completed</option>
                              </select>
                          </div>
                      </div>
                    )}
                </div>

                <div className="p-4 bg-bg-main border-t border-silver flex justify-end gap-3 shrink-0">
                    <button onClick={()=>setIsModalOpen(false)} className="px-5 py-2 rounded-lg border border-silver bg-white text-primary-dark font-black uppercase text-[10px] hover:bg-slate-50 transition-colors shadow-sm">Cancel</button>
                    <button onClick={handleSaveEvent} className={`px-6 py-2 rounded-lg font-black uppercase text-[10px] shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-white ${eventForm.isHoliday ? 'bg-danger hover:bg-danger/90' : 'bg-primary hover:bg-primary/90'}`}>
                        <Save size={14} className={eventForm.isHoliday ? "text-white" : "text-gold"} /> Save Entry
                    </button>
                </div>
            </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* User Guide Drawer */}
      <AnimatePresence>
      {isGuideOpen && (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex justify-end"
        >
            <div className="absolute inset-0 bg-primary-dark/40 backdrop-blur-sm" onClick={() => setIsGuideOpen(false)} />
            <motion.div 
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col font-system"
            >
                <div className="bg-primary-dark px-6 py-5 flex justify-between items-center text-white border-b-[3px] border-accent">
                    <div className="flex items-center gap-2.5">
                      <HelpCircle size={20} className="text-accent" />
                      <h3 className="text-[14px] font-black uppercase tracking-widest">Calendar Guide</h3>
                    </div>
                    <button onClick={() => setIsGuideOpen(false)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-all"><X size={18} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-8 text-dark-slate">
                    <section>
                      <h4 className="font-black text-primary-dark border-b border-silver pb-2 mb-3 flex items-center gap-2">
                        <span className="bg-primary text-white font-mono w-5 h-5 rounded-full flex items-center justify-center text-[10px]">01</span> การเพิ่มงานจัดซื้อ
                      </h4>
                      <p className="text-[12px] leading-relaxed font-medium">กดปุ่ม <span className="font-bold text-primary">"Add Task"</span> เพื่อเพิ่มตารางงานที่เกี่ยวกับงานจัดซื้อ เช่น การอนุมัติ PR, การออก PO หรือการเข้าพบ Vendor ระบบจะแยกสีตามประเภทเพื่อให้ตรวจสอบง่ายขึ้น</p>
                    </section>
                    <section>
                      <h4 className="font-black text-primary-dark border-b border-silver pb-2 mb-3 flex items-center gap-2">
                        <span className="bg-danger text-white font-mono w-5 h-5 rounded-full flex items-center justify-center text-[10px]">02</span> วันหยุดนักขัตฤกษ์
                      </h4>
                      <p className="text-[12px] leading-relaxed font-medium">ใช้ปุ่ม <span className="font-bold text-danger">"Holiday"</span> สำหรับเพิ่มวันหยุดสำคัญ โดยระบบจะแสดงไอคอน <b>ต้นมะพร้าว</b> นำหน้าชื่อในปฏิทินโดยอัตโนมัติ สีพื้นหลังมุมมองปฏิทินจะปรับเป็นโทนแดงอ่อนเพื่อเน้นย้ำ</p>
                    </section>
                </div>
                <div className="p-5 border-t border-silver bg-bg-main flex justify-end">
                  <button onClick={() => setIsGuideOpen(false)} className="px-6 py-2.5 bg-primary-dark text-white rounded-lg font-black text-[10px] uppercase shadow-md hover:bg-primary transition-all">ปิดคู่มือ</button>
                </div>
            </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
