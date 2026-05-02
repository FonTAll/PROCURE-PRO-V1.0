import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Truck, Search, Plus, Printer, Calendar, X, LayoutDashboard, CheckCircle, 
  UploadCloud, Eye, User, History, HelpCircle, List, Building2, MapPin, 
  Coins, Trash2, Pencil, Info, UserPlus, Save, ChevronLeft, ChevronRight, 
  Activity, Package, Star, ShieldCheck, CreditCard, Phone, Settings, 
  PlusCircle, Filter, AlertCircle, PieChart, BarChart2, Mail
} from 'lucide-react';
import Chart from 'chart.js/auto';

// --- Sub Component: KPI Card ---
const KpiCard = ({ title, val, color, IconComponent, desc }: any) => (
    <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-silver/50 relative overflow-hidden group h-full cursor-pointer">
        <div className="absolute -right-4 -bottom-4 opacity-[0.05] transform rotate-12 group-hover:scale-110 transition-transform duration-700 pointer-events-none z-0">
            <IconComponent size={100} style={{ color: color }} />
        </div>
        <div className="relative z-10 flex flex-col justify-between items-start h-full">
            <div className="flex-1 min-w-0 flex flex-col gap-0.5 w-full">
                <p className="text-[10px] font-bold text-dusty-blue uppercase tracking-wider truncate">{String(title)}</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                    <h4 className="text-2xl font-black font-mono tracking-tighter leading-none truncate text-primary-dark">{String(val)}</h4>
                </div>
                {desc && (
                    <p className="text-[9px] text-primary-dark font-bold mt-auto pt-3 flex items-center gap-1.5 truncate uppercase">
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{backgroundColor: color}}></span>
                        {String(desc)}
                    </p>
                )}
            </div>
            <div className="absolute top-0 right-0 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-white bg-bg-main overflow-hidden group-hover:scale-105 transition-transform" style={{ color: color }}>
                <div className="absolute inset-0 opacity-10" style={{ backgroundColor: color }}></div>
                <IconComponent size={20} strokeWidth={2.5} />
            </div>
        </div>
    </div>
);

export default function SupplierDirectory() {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'dashboard'
  const [searchQuery, setSearchQuery] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Master Data Configuration ---
  const [masterConfig, setMasterConfig] = useState({
    categories: ['Supplier', 'Service', 'OEM'],
    subCategories: {
      'Supplier': ['Raw Material', 'Packaging', 'Hardware', 'Chemicals'],
      'Service': ['Logistics', 'Maintenance', 'Consulting', 'IT Support'],
      'OEM': ['Metal Parts', 'Plastic Injection', 'Electronic Assembly', 'Mold & Die']
    }
  });

  // Modal & UI States
  const [modalOpen, setModalOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('view'); 
  const [activeFormTab, setActiveFormTab] = useState('general');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Refs for Charts
  const chartStatusRef = useRef<HTMLCanvasElement>(null);
  const chartTypeRef = useRef<HTMLCanvasElement>(null);
  const chartInstances = useRef<any>({});

  // Mock Supplier Data (Expanded to 20 items)
  const [suppliers, setSuppliers] = useState([
    { id: 1, supplierID: 'SUP-001', supplierName: 'บริษัท ไทยสตีล จำกัด', category: 'Supplier', subCategory: 'Raw Material', contactName: 'คุณสมชาย', phone: '081-234-5678', creditTerm: 30, status: 'Active', rating: 4.5, taxID: '0105560000123' },
    { id: 2, supplierID: 'SUP-002', supplierName: 'Global Logistics Co.', category: 'Service', subCategory: 'Logistics', contactName: 'คุณวิภา', phone: '082-999-8888', creditTerm: 60, status: 'Active', rating: 4.8, taxID: '0105560000456' },
    { id: 3, supplierID: 'SUP-003', supplierName: 'Precision Parts OEM', category: 'OEM', subCategory: 'Metal Parts', contactName: 'คุณนพดล', phone: '02-111-2222', creditTerm: 30, status: 'Prospect', rating: 3.5, taxID: '0105560000789' },
    { id: 4, supplierID: 'SUP-004', supplierName: 'Color Master Paint', category: 'Supplier', subCategory: 'Chemicals', contactName: 'คุณชัยสิทธิ์', phone: '089-777-6666', creditTerm: 15, status: 'On-Hold', rating: 3.0, taxID: '0105560000999' },
    { id: 5, supplierID: 'SUP-005', supplierName: 'Siam Packaging Ltd.', category: 'Supplier', subCategory: 'Packaging', contactName: 'คุณอารี', phone: '02-333-4444', creditTerm: 30, status: 'Active', rating: 4.2, taxID: '0105561000111' },
    { id: 6, supplierID: 'SUP-006', supplierName: 'Tech Innovate Service', category: 'Service', subCategory: 'IT Support', contactName: 'คุณมานะ', phone: '085-444-5555', creditTerm: 45, status: 'Active', rating: 4.0, taxID: '0105561000222' },
    { id: 7, supplierID: 'SUP-007', supplierName: 'Metal Works OEM', category: 'OEM', subCategory: 'Mold & Die', contactName: 'คุณปัญญา', phone: '086-555-6666', creditTerm: 30, status: 'Active', rating: 4.7, taxID: '0105561000333' },
    { id: 8, supplierID: 'SUP-008', supplierName: 'SafeGuard Hardware', category: 'Supplier', subCategory: 'Hardware', contactName: 'คุณสมศักดิ์', phone: '02-777-8888', creditTerm: 30, status: 'Active', rating: 3.8, taxID: '0105561000444' },
    { id: 9, supplierID: 'SUP-009', supplierName: 'Green Energy Service', category: 'Service', subCategory: 'Maintenance', contactName: 'คุณนารี', phone: '081-888-9999', creditTerm: 60, status: 'On-Hold', rating: 3.2, taxID: '0105561000555' },
    { id: 10, supplierID: 'SUP-010', supplierName: 'Alpha Plastic OEM', category: 'OEM', subCategory: 'Plastic Injection', contactName: 'คุณวิชัย', phone: '082-111-3333', creditTerm: 45, status: 'Active', rating: 4.6, taxID: '0105561000666' },
    { id: 11, supplierID: 'SUP-011', supplierName: 'Chemical Solutions', category: 'Supplier', subCategory: 'Chemicals', contactName: 'คุณสุรพล', phone: '084-222-4444', creditTerm: 30, status: 'Active', rating: 4.1, taxID: '0105561000777' },
    { id: 12, supplierID: 'SUP-012', supplierName: 'Fast Track Logistics', category: 'Service', subCategory: 'Logistics', contactName: 'คุณจตุพร', phone: '02-888-0000', creditTerm: 30, status: 'Active', rating: 3.9, taxID: '0105561000888' },
    { id: 13, supplierID: 'SUP-013', supplierName: 'Circuit Board OEM', category: 'OEM', subCategory: 'Electronic Assembly', contactName: 'คุณนิพนธ์', phone: '087-333-1111', creditTerm: 60, status: 'Prospect', rating: 0, taxID: '0105561000999' },
    { id: 14, supplierID: 'SUP-014', supplierName: 'Wood Master Co.', category: 'Supplier', subCategory: 'Raw Material', contactName: 'คุณกิตติ', phone: '089-444-2222', creditTerm: 30, status: 'Active', rating: 4.4, taxID: '0105561001000' },
    { id: 15, supplierID: 'SUP-015', supplierName: 'Bright Box Packaging', category: 'Supplier', subCategory: 'Packaging', contactName: 'คุณกมล', phone: '02-123-4567', creditTerm: 15, status: 'Active', rating: 3.7, taxID: '0105561001001' },
    { id: 16, supplierID: 'SUP-016', supplierName: 'HR Consulting Group', category: 'Service', subCategory: 'Consulting', contactName: 'คุณรินดา', phone: '081-555-7777', creditTerm: 30, status: 'Active', rating: 4.3, taxID: '0105561001002' },
    { id: 17, supplierID: 'SUP-017', supplierName: 'Iron Cast OEM', category: 'OEM', subCategory: 'Metal Parts', contactName: 'คุณถาวร', phone: '082-777-9999', creditTerm: 30, status: 'On-Hold', rating: 2.8, taxID: '0105561001003' },
    { id: 18, supplierID: 'SUP-018', supplierName: 'Tool & Die Specialist', category: 'Supplier', subCategory: 'Hardware', contactName: 'คุณสุนทร', phone: '083-999-1111', creditTerm: 45, status: 'Active', rating: 4.9, taxID: '0105561001004' },
    { id: 19, supplierID: 'SUP-019', supplierName: 'Premium Resin Co.', category: 'Supplier', subCategory: 'Raw Material', contactName: 'คุณจันจิรา', phone: '084-111-2222', creditTerm: 30, status: 'Active', rating: 4.2, taxID: '0105561001005' },
    { id: 20, supplierID: 'SUP-020', supplierName: 'Elite Engineering', category: 'Service', subCategory: 'Maintenance', contactName: 'คุณเกรียงไกร', phone: '085-333-4444', creditTerm: 30, status: 'Active', rating: 4.1, taxID: '0105561001006' },
  ]);

  const [form, setForm] = useState<any>({});

  const filterCategories = ['All', 'Supplier', 'Service', 'OEM'];

  // Filtering Logic
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => {
      const matchSearch = s.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.supplierID.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = catFilter === 'All' ? true : s.category === catFilter;
      return matchSearch && matchCat;
    });
  }, [suppliers, searchQuery, catFilter]);

  // Pagination Logic
  const paginatedSuppliers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSuppliers.slice(start, start + itemsPerPage);
  }, [filteredSuppliers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage) || 1;

  const stats = {
    total: suppliers.length,
    active: suppliers.filter(s => s.status === 'Active').length,
    supplierCat: suppliers.filter(s => s.category === 'Supplier').length,
    avgRating: (suppliers.reduce((acc, curr) => acc + (curr.rating || 0), 0) / (suppliers.filter(s => s.rating > 0).length || 1)).toFixed(1)
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      const timer = setTimeout(() => initCharts(), 100);
      return () => clearTimeout(timer);
    }
  }, [activeTab, suppliers]);

  const initCharts = () => {
    Object.values(chartInstances.current).forEach((c: any) => c && c.destroy());
    const commonOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' as const, labels: { usePointStyle: true, font: { size: 10 } } } } };

    if (chartStatusRef.current) {
      chartInstances.current.status = new Chart(chartStatusRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Active', 'Prospect', 'On-Hold', 'Blacklisted'],
          datasets: [{
            data: ['Active', 'Prospect', 'On-Hold', 'Blacklisted'].map(status => suppliers.filter(s => s.status === status).length),
            backgroundColor: ['#596c33', '#5372ba', '#ce870a', '#ff929a'],
            borderWidth: 0, 
            // @ts-ignore
            cutout: '75%'
          }]
        },
        options: commonOptions
      });
    }

    if (chartTypeRef.current) {
      chartInstances.current.type = new Chart(chartTypeRef.current, {
        type: 'bar',
        data: {
          labels: masterConfig.categories,
          datasets: [{
            label: 'Suppliers',
            data: masterConfig.categories.map(c => suppliers.filter(s => s.category === c).length),
            backgroundColor: '#1f2a44', borderRadius: 4
          }]
        },
        options: { ...commonOptions, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } }, x: { grid: { display: false } } } }
      });
    }
  };

  // Handlers
  const openModal = (mode: 'create'|'edit'|'view', data: any = null) => {
    setModalMode(mode);
    setActiveFormTab('general');
    if (mode === 'create') {
      setForm({ 
        supplierID: `SUP-${String(suppliers.length + 1).padStart(3, '0')}`, 
        supplierName: '', 
        category: 'Supplier', 
        subCategory: masterConfig.subCategories['Supplier'][0], 
        status: 'Prospect', 
        rating: 0, 
        creditTerm: 30,
        vendorAddress: '',
        contactName: '',
        phone: '',
        email: '',
        taxID: ''
      });
    } else {
      setForm(JSON.parse(JSON.stringify(data)));
    }
    setModalOpen(true);
  };

  const handleSave = () => {
    if(!form.supplierName) return;
    if(modalMode === 'create') {
      setSuppliers([{...form, id: Date.now()}, ...suppliers]);
    } else {
      setSuppliers(suppliers.map(s => s.id === form.id ? form : s));
    }
    setModalOpen(false);
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Prospect': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'On-Hold': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <>
      <style>{`
`}</style>
      
      <div className="flex flex-col h-full overflow-hidden">
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 w-full relative">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm border border-silver">
                  <Truck size={24} className="text-primary-dark" strokeWidth={2.5} />
              </div>
              <div>
                  <h2 className="text-primary-dark font-black tracking-tight text-2xl uppercase leading-none">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-blue drop-shadow-sm">Supplier</span> Directory
                  </h2>
                  <p className="text-dusty-blue text-[10px] font-bold mt-1 uppercase tracking-widest leading-none">Vendor Management</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="flex bg-white p-1 border border-silver shadow-sm rounded-xl">
                <button onClick={() => setActiveTab('list')} className={`px-4 py-1.5 font-black transition-all flex items-center gap-2 uppercase tracking-widest rounded-lg text-[10px] ${activeTab === 'list' ? 'bg-primary-dark text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <List size={14} /> LIST VIEW
                </button>
                <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-1.5 font-black transition-all flex items-center gap-2 uppercase tracking-widest rounded-lg text-[10px] ${activeTab === 'dashboard' ? 'bg-primary-dark text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <LayoutDashboard size={14} /> DASHBOARD
                </button>
              </div>
              <button onClick={() => setIsGuideOpen(true)} className="p-2.5 transition-all rounded-xl bg-white text-dusty-blue hover:text-primary border border-silver shadow-sm">
                <HelpCircle size={18} />
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-500">
            <KpiCard title="Total Vendors" val={stats.total} color="#5372ba" IconComponent={Truck} />
            <KpiCard title="Active Suppliers" val={stats.active} color="#596c33" IconComponent={ShieldCheck} />
            <KpiCard title="Raw Material" val={stats.supplierCat} color="#6293b9" IconComponent={Package} />
            <KpiCard title="Avg. Rating" val={stats.avgRating} color="#ce870a" IconComponent={Star} />
          </div>

          {/* DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-in fade-in duration-500 min-h-[400px]">
               <div className="bg-white p-6 rounded-2xl border border-silver/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col h-[400px]">
                  <h3 className="text-[10px] font-black text-primary-dark uppercase tracking-widest mb-6 flex items-center gap-2"><PieChart size={16} className="text-primary"/> Supplier Status Overview</h3>
                  <div className="flex-1 relative"><canvas ref={chartStatusRef}></canvas></div>
               </div>
               <div className="bg-white p-6 rounded-2xl border border-silver/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col h-[400px]">
                  <h3 className="text-[10px] font-black text-primary-dark uppercase tracking-widest mb-6 flex items-center gap-2"><BarChart2 size={16} className="text-primary"/> Suppliers by Category</h3>
                  <div className="flex-1 relative"><canvas ref={chartTypeRef}></canvas></div>
               </div>
            </div>
          )}

          {/* LIST VIEW */}
          {activeTab === 'list' && (
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-silver/50 flex flex-col overflow-hidden min-h-[500px] animate-in fade-in duration-500">
              
              {/* Table Toolbar */}
              <div className="p-4 flex flex-col lg:flex-row items-center justify-between gap-4 border-b border-silver bg-bg-main overflow-x-auto no-scrollbar custom-scrollbar">
                
                <div className="flex items-center gap-4 flex-shrink-0 w-full lg:w-auto">
                  <div className="flex bg-white p-1 rounded-xl shadow-sm border border-silver flex-shrink-0">
                    {filterCategories.map(f => (
                      <button 
                        key={f} 
                        onClick={() => {setCatFilter(f); setCurrentPage(1);}} 
                        className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all whitespace-nowrap ${catFilter === f ? 'bg-primary-dark text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  <div className="h-6 w-px bg-silver flex-shrink-0"></div>

                  <div className="relative w-full lg:w-64 flex-shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dusty-blue" size={14} />
                    <input 
                      type="text" 
                      placeholder="Search Name or ID..." 
                      className="w-full bg-white border border-silver rounded-xl pl-9 pr-4 py-2 text-[11px] font-bold outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-primary-dark shadow-sm transition-all"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="flex justify-center items-center gap-2 px-4 py-2 rounded-xl border border-silver bg-white text-primary-dark hover:bg-slate-50 hover:border-primary-dark transition-all font-black uppercase tracking-widest text-[10px] shadow-sm"
                  >
                    <UploadCloud size={14} /> IMPORT
                    <input type="file" ref={fileInputRef} className="hidden" />
                  </button>
                  <button 
                    onClick={() => openModal('create')} 
                    className="sys-btn-primary flex items-center gap-2 py-2"
                  >
                    <Plus size={14} strokeWidth={3} className="text-gold" /> NEW SUPPLIER
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-x-auto custom-scrollbar">
                 <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead className="sticky top-0 z-10">
                      <tr>
                        <th className="font-black text-[12px] uppercase tracking-widest text-white px-6 py-4 bg-primary-dark border-b-2 border-accent">ID</th>
                        <th className="font-black text-[12px] uppercase tracking-widest text-white px-6 py-4 bg-primary-dark border-b-2 border-accent">SUPPLIER NAME</th>
                        <th className="font-black text-[12px] uppercase tracking-widest text-white px-6 py-4 bg-primary-dark border-b-2 border-accent text-center">CAT</th>
                        <th className="font-black text-[12px] uppercase tracking-widest text-white px-6 py-4 bg-primary-dark border-b-2 border-accent text-center">SUB CAT</th>
                        <th className="font-black text-[12px] uppercase tracking-widest text-white px-6 py-4 bg-primary-dark border-b-2 border-accent">CONTACT</th>
                        <th className="font-black text-[12px] uppercase tracking-widest text-gold px-6 py-4 bg-primary-dark border-b-2 border-accent text-center">TERM</th>
                        <th className="font-black text-[12px] uppercase tracking-widest text-white px-6 py-4 bg-primary-dark border-b-2 border-accent text-center">STATUS</th>
                        <th className="font-black text-[12px] uppercase tracking-widest text-white px-6 py-4 bg-primary-dark border-b-2 border-accent text-center">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-silver/50 text-[12px]">
                      {paginatedSuppliers.map(supp => (
                        <tr key={supp.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-6 py-3 border-b border-silver/50 text-[12px] font-medium align-middle font-mono font-bold text-primary-dark">{supp.supplierID}</td>
                          <td className="px-6 py-3 border-b border-silver/50 text-[12px] font-medium align-middle font-black text-primary-dark uppercase">{supp.supplierName}</td>
                          <td className="px-6 py-3 border-b border-silver/50 text-[12px] font-medium align-middle text-center">
                             <span className={`px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-widest border ${supp.category==='Supplier' ? 'bg-blue-50 text-blue-700 border-blue-200' : supp.category==='OEM' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>{supp.category}</span>
                          </td>
                          <td className="px-6 py-3 border-b border-silver/50 text-[12px] font-medium align-middle text-center text-dusty-blue font-bold italic">{supp.subCategory}</td>
                          <td className="px-6 py-3 border-b border-silver/50 text-[12px] font-medium align-middle">
                             <div className="font-black text-primary-dark">{supp.contactName}</div>
                             <div className="text-[10px] text-dusty-blue font-mono font-bold">{supp.phone}</div>
                          </td>
                          <td className="px-6 py-3 border-b border-silver/50 text-[12px] font-medium align-middle text-center font-mono font-black text-danger">{supp.creditTerm} Days</td>
                          <td className="px-6 py-3 border-b border-silver/50 text-[12px] font-medium align-middle text-center">
                             <span className={`px-2 py-0.5 rounded-md border font-black text-[11px] uppercase tracking-wider ${getStatusClass(supp.status)}`}>{supp.status}</span>
                          </td>
                          <td className="px-6 py-3 border-b border-silver/50 text-[12px] font-medium align-middle text-center">
                             <div className="flex justify-center gap-[0.5px]">
                                <button onClick={()=>openModal('view', supp)} className="w-8 h-8 flex items-center justify-center text-primary hover:bg-primary/10 rounded transition-colors"><Eye size={16}/></button>
                                <button onClick={()=>openModal('edit', supp)} className="w-8 h-8 flex items-center justify-center text-accent hover:bg-accent/10 rounded transition-colors"><Pencil size={16}/></button>
                             </div>
                          </td>
                        </tr>
                      ))}
                      {paginatedSuppliers.length === 0 && (
                        <tr><td colSpan={8} className="px-4 py-10 text-center text-dusty-blue italic font-bold">No records found.</td></tr>
                      )}
                    </tbody>
                 </table>
              </div>

              {/* Pagination Controls */}
              <div className="px-6 py-3 border-t border-silver flex flex-col md:flex-row justify-between items-center gap-4 bg-bg-main">
                <div className="flex items-center gap-3 text-[10px] font-bold text-dusty-blue uppercase tracking-widest">
                  <p>Showing <span className="font-black text-primary-dark">{filteredSuppliers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-black text-primary-dark">{Math.min(currentPage * itemsPerPage, filteredSuppliers.length)}</span> of <span className="font-black text-primary-dark">{filteredSuppliers.length}</span></p>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-silver bg-white text-primary-dark disabled:opacity-50 hover:bg-slate-50 shadow-sm transition-all"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <div className="flex items-center px-3 h-8 bg-white border border-silver rounded-lg shadow-sm text-[10px] font-bold text-primary-dark">
                    PAGE {currentPage} / {totalPages}
                  </div>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-silver bg-white text-primary-dark disabled:opacity-50 hover:bg-slate-50 shadow-sm transition-all"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DETAIL MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-primary-dark/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-silver">
              <div className="px-6 py-4 flex justify-between items-center bg-bg-main text-primary-dark shrink-0 border-b border-silver">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white shadow-sm border border-silver rounded-xl flex items-center justify-center text-primary"><User size={20} /></div>
                    <div>
                      <h2 className="text-[14px] font-black uppercase tracking-widest">{modalMode==='create' ? 'Register New Supplier' : 'Supplier Profile'}</h2>
                      <p className="text-[10px] font-bold text-dusty-blue uppercase tracking-widest mt-0.5">ID: {form.supplierID}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setConfigModalOpen(true)} className="p-1.5 hover:bg-white rounded-lg transition-colors border border-silver bg-white shadow-sm flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-dusty-blue">
                        <Settings size={14} /> Config
                    </button>
                    <button onClick={()=>setModalOpen(false)} className="hover:bg-white p-1.5 rounded-lg text-dusty-blue transition-colors border border-transparent shadow-none hover:shadow-sm"><X size={20}/></button>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50/50">
                  <div className="w-full md:w-56 bg-bg-main border-r border-silver p-4 space-y-2 flex flex-row md:flex-col overflow-x-auto shrink-0 custom-scrollbar">
                      {[
                        { id: 'general', label: 'General Info', icon: Info },
                        { id: 'address', label: 'Address', icon: MapPin },
                        { id: 'financial', label: 'Financial', icon: CreditCard },
                        { id: 'contact', label: 'Contact', icon: User }
                      ].map(tab => (
                        <button key={tab.id} onClick={()=>setActiveFormTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-left uppercase text-[10px] font-black tracking-widest whitespace-nowrap ${activeFormTab === tab.id ? 'bg-primary-dark text-gold shadow-md' : 'text-slate-500 hover:bg-white'}`}>
                          <tab.icon size={14}/> {tab.label}
                        </button>
                      ))}
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white">
                      <div className="space-y-5">
                        {activeFormTab === 'general' && (
                          <div className="bg-white p-5 rounded-xl border border-silver shadow-sm grid grid-cols-2 gap-4">
                            <div className="col-span-2 space-y-1">
                                <label className="text-[10px] font-bold text-dusty-blue uppercase tracking-widest">Supplier Name</label>
                                <input disabled={modalMode==='view'} value={form.supplierName || ''} onChange={e=>setForm({...form, supplierName: e.target.value})} className="w-full px-3 py-2 text-[12px] border border-silver rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none font-black text-primary-dark bg-white disabled:bg-slate-50 disabled:opacity-70 shadow-sm transition-all" placeholder="Company Name..." />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-dusty-blue uppercase tracking-widest">Category</label>
                                <select disabled={modalMode==='view'} value={form.category || 'Supplier'} onChange={e=>{
                                    const newCat = e.target.value;
                                    setForm({...form, category: newCat, subCategory: masterConfig.subCategories[newCat as keyof typeof masterConfig.subCategories]?.[0] || ''});
                                }} className="w-full px-3 py-2 text-[11px] border border-silver rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white font-bold text-primary-dark shadow-sm">
                                  {masterConfig.categories.map(c=><option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-dusty-blue uppercase tracking-widest">Sub Category</label>
                                <select disabled={modalMode==='view'} value={form.subCategory || ''} onChange={e=>setForm({...form, subCategory: e.target.value})} className="w-full px-3 py-2 text-[11px] border border-silver rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white font-bold text-primary-dark shadow-sm">
                                  {masterConfig.subCategories[form.category as keyof typeof masterConfig.subCategories]?.map((sc: string) => <option key={sc} value={sc}>{sc}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1 col-span-2">
                                <label className="text-[10px] font-bold text-dusty-blue uppercase tracking-widest">Tax ID</label>
                                <input disabled={modalMode==='view'} value={form.taxID || ''} onChange={e=>setForm({...form, taxID: e.target.value})} className="w-full px-3 py-2 text-[12px] font-mono font-bold text-primary-dark border border-silver rounded-lg bg-white disabled:bg-slate-50 shadow-sm" placeholder="0000000000000" />
                            </div>
                          </div>
                        )}

                        {activeFormTab === 'financial' && (
                          <div className="bg-white p-5 rounded-xl border border-silver shadow-sm grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-dusty-blue uppercase tracking-widest">Credit Term (Days)</label>
                                <input type="number" disabled={modalMode==='view'} value={form.creditTerm || 0} onChange={e=>setForm({...form, creditTerm: e.target.value})} className="w-full px-3 py-2 text-[12px] font-black text-primary-dark border border-silver rounded-lg bg-white disabled:bg-slate-50 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-dusty-blue uppercase tracking-widest">Status</label>
                                <select disabled={modalMode==='view'} value={form.status || 'Prospect'} onChange={e=>setForm({...form, status: e.target.value})} className="w-full px-3 py-2 text-[11px] font-black uppercase tracking-wider text-primary-dark border border-silver rounded-lg bg-white shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none">
                                  <option>Prospect</option><option>Active</option><option>On-Hold</option><option>Blacklisted</option>
                                </select>
                            </div>
                          </div>
                        )}

                        {activeFormTab === 'address' && (
                          <div className="bg-white p-5 rounded-xl border border-silver shadow-sm grid grid-cols-1 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-dusty-blue uppercase tracking-widest flex items-center gap-1.5"><MapPin size={12}/> Company Address</label>
                                <textarea disabled={modalMode==='view'} rows={4} value={form.vendorAddress || ''} onChange={e=>setForm({...form, vendorAddress: e.target.value})} className="w-full px-3 py-2 text-[12px] font-bold text-primary-dark border border-silver rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none resize-none bg-white disabled:bg-slate-50 shadow-sm" placeholder="Address..." />
                            </div>
                          </div>
                        )}

                        {activeFormTab === 'contact' && (
                          <div className="bg-white p-5 rounded-xl border border-silver shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1 col-span-2">
                                <label className="text-[10px] font-bold text-dusty-blue uppercase tracking-widest flex items-center gap-1.5"><User size={12}/> Contact Person</label>
                                <input disabled={modalMode==='view'} value={form.contactName || ''} onChange={e=>setForm({...form, contactName: e.target.value})} className="w-full px-3 py-2 text-[12px] font-black text-primary-dark border border-silver rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white disabled:bg-slate-50 shadow-sm" placeholder="Name..." />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-dusty-blue uppercase tracking-widest flex items-center gap-1.5"><Phone size={12}/> Phone Number</label>
                                <input disabled={modalMode==='view'} value={form.phone || ''} onChange={e=>setForm({...form, phone: e.target.value})} className="w-full px-3 py-2 text-[12px] font-mono font-bold text-primary-dark border border-silver rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white disabled:bg-slate-50 shadow-sm" placeholder="Phone..." />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-dusty-blue uppercase tracking-widest flex items-center gap-1.5"><Mail size={12}/> Email</label>
                                <input type="email" disabled={modalMode==='view'} value={form.email || ''} onChange={e=>setForm({...form, email: e.target.value})} className="w-full px-3 py-2 text-[12px] font-bold text-primary-dark border border-silver rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white disabled:bg-slate-50 shadow-sm" placeholder="Email..." />
                            </div>
                          </div>
                        )}
                      </div>
                  </div>
              </div>

              <div className="p-4 bg-bg-main border-t border-silver flex justify-between items-center">
                <button onClick={()=>setModalOpen(false)} className="px-5 py-2 rounded-lg border border-silver font-black text-[10px] uppercase text-primary-dark hover:bg-white transition-all shadow-sm">Close</button>
                <div className="flex gap-2">
                   {modalMode==='view' ? (
                     <button onClick={()=>setModalMode('edit')} className="bg-primary text-white px-6 py-2 rounded-lg font-black shadow-md uppercase tracking-widest flex items-center gap-2 hover:bg-primary-dark transition-all text-[10px]"><Pencil size={14}/> Edit</button>
                   ) : (
                     <button onClick={handleSave} className="bg-primary-dark text-gold px-6 py-2 rounded-lg font-black shadow-md uppercase tracking-widest flex items-center gap-2 hover:bg-primary transition-all text-[10px]"><Save size={14}/> Save</button>
                   )}
                </div>
              </div>
            </div>
        </div>
      )}

      {/* CONFIG MODAL */}
      {configModalOpen && (
         <div className="fixed inset-0 bg-primary-dark/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-silver">
               <div className="px-6 py-4 bg-bg-main text-primary-dark flex justify-between items-center border-b border-silver shrink-0">
                  <h3 className="text-[12px] font-black uppercase tracking-widest flex items-center gap-2"><Settings size={16}/> Category Config</h3>
                  <button onClick={()=>setConfigModalOpen(false)} className="hover:bg-white p-1.5 rounded-lg transition-colors border border-transparent shadow-none hover:shadow-sm"><X size={18}/></button>
               </div>
               <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6 bg-slate-50/50">
                  <section className="space-y-3">
                     <div className="flex justify-between items-center border-b border-silver pb-2">
                        <h4 className="font-black text-primary-dark uppercase text-[10px] tracking-widest">Master Categories</h4>
                        <button className="text-[10px] font-black text-primary flex items-center gap-1 hover:underline"><PlusCircle size={12}/> ADD</button>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {masterConfig.categories.map(c => (
                           <div key={c} className="bg-white px-3 py-1.5 rounded-lg flex items-center gap-2 border border-silver shadow-sm">
                              <span className="font-black text-[10px] text-primary-dark">{c}</span>
                              <button className="text-slate-300 hover:text-danger transition-colors"><X size={12}/></button>
                           </div>
                        ))}
                     </div>
                  </section>
                  <section className="space-y-3">
                     <div className="flex justify-between items-center border-b border-silver pb-2">
                        <h4 className="font-black text-primary-dark uppercase text-[10px] tracking-widest">Sub Categories Mappings</h4>
                     </div>
                     <div className="grid grid-cols-1 gap-4">
                        {Object.entries(masterConfig.subCategories).map(([cat, subs]) => (
                           <div key={cat} className="p-4 bg-white border border-silver rounded-xl shadow-sm">
                              <div className="font-black text-[10px] text-primary uppercase mb-3 flex items-center gap-1.5 tracking-wider">
                                 <div className="w-1.5 h-1.5 rounded-full bg-primary"></div> {cat}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                 {(subs as string[]).map(s => (
                                    <span key={s} className="bg-slate-50 border border-silver px-2.5 py-1 rounded-md text-[10px] font-bold text-primary-dark flex items-center gap-1.5 group transition-colors hover:border-slate-300">
                                       {s} <X size={10} className="cursor-pointer text-slate-400 group-hover:text-danger transition-colors" />
                                    </span>
                                 ))}
                                 <button className="text-primary p-1 hover:bg-slate-50 rounded-md transition-all border border-transparent hover:border-primary/30"><PlusCircle size={14}/></button>
                              </div>
                            </div>
                        ))}
                     </div>
                  </section>
               </div>
               <div className="p-4 bg-bg-main border-t border-silver flex justify-end">
                  <button onClick={()=>setConfigModalOpen(false)} className="bg-primary-dark text-gold px-8 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md hover:bg-primary hover:text-white transition-all">Done</button>
               </div>
            </div>
         </div>
      )}

      {/* Guide Drawer */}
      {isGuideOpen && (
        <>
          <div className="fixed inset-0 bg-primary-dark/40 backdrop-blur-sm z-[200] animate-in fade-in duration-200" onClick={() => setIsGuideOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl z-[250] flex flex-col animate-in slide-in-from-right duration-300">
            <div className="px-6 py-5 flex justify-between items-center bg-primary-dark text-white shrink-0 border-b-[3px] border-accent">
              <h2 className="text-[14px] font-black uppercase tracking-widest flex items-center gap-2"><HelpCircle size={18} className="text-accent" /> Guide</h2>
              <button onClick={() => setIsGuideOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 text-primary-dark space-y-6 text-[12px]">
               <section>
                  <h4 className="font-black border-b border-silver pb-2 uppercase flex items-center gap-2 mb-3 tracking-widest text-[10px]"><LayoutDashboard size={14}/> 1. Categories</h4>
                  <p className="leading-relaxed font-bold text-slate-500">The system separates suppliers into 3 main categories: Supplier, Service, and OEM with related Sub Categories.</p>
               </section>
               <div className="bg-bg-main p-4 rounded-xl border border-silver flex gap-3">
                  <Settings className="text-primary shrink-0" size={20}/>
                  <div>
                    <p className="font-black text-primary-dark text-[10px] uppercase tracking-widest mb-1">Master Data Config</p>
                    <p className="text-[11px] text-dusty-blue leading-relaxed font-bold">You can add/edit/remove Categories and Sub Categories via the Config button in the Create Modal.</p>
                  </div>
               </div>
            </div>
            <div className="p-4 border-t border-silver flex justify-end bg-bg-main"><button onClick={()=>setIsGuideOpen(false)} className="bg-primary-dark text-gold px-6 py-2 rounded-lg font-black text-[10px] uppercase tracking-wider shadow-md hover:bg-primary hover:text-white transition-colors">Understood</button></div>
          </div>
        </>
      )}

    </>
  );
}
