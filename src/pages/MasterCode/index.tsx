import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    QrCode, Settings, Settings2, List, BarChart2, Database, Package, Leaf, 
    PlusCircle, CheckCircle, Circle, Tag, AlertOctagon, RotateCcw, 
    CheckCircle2, X, Pencil, Trash2, Search, UploadCloud, Plus, 
    ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, Check, PenTool,
    HelpCircle, Wallet, Factory, LayoutGrid, Clock, Briefcase, Box, FileCheck, AlertCircle, Zap, RefreshCw, BarChart3, Braces, Hash, Terminal, ListFilter, ChevronDown, TrendingUp, PieChart, Palette, Save
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

export default function MasterCode() {
    // --- 1. States Definitions ---
    const [activeTab, setActiveTab] = useState('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeGroup, setActiveGroup] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showGroupConfig, setShowGroupConfig] = useState(false);
    const [csvPreview, setCsvPreview] = useState<any[]>([]);
    const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [items, setItems] = useState<any[]>([]);
    
    // Group Data with Descriptions and Colors
    const [groups, setGroups] = useState([
        { id: 'FG', desc: 'สินค้าสำเร็จรูป', color: '#1f2a44' }, // primary-dark
        { id: 'RM', desc: 'วัตถุดิบ', color: '#596c33' }, // success
        { id: 'HW', desc: 'อุปกรณ์ฮาร์ดแวร์', color: '#ce870a' }, // accent 
        { id: 'FB', desc: 'ผ้าและวัสดุ', color: '#d1b028' }, // gold
        { id: 'PK', desc: 'บรรจุภัณฑ์', color: '#7691ad' } // dusty-blue
    ]);

    const [form, setForm] = useState<any>({
        rowId: null, group: 'FG', category: '', catCode: '', subCategory: '', subCatCode: '', note: ''
    });

    const [newGroupInput, setNewGroupInput] = useState({ id: '', desc: '', color: '1f2a44' });

    const typeChartRef = useRef<HTMLCanvasElement>(null);
    const barChartRef = useRef<HTMLCanvasElement>(null);
    const charts = useRef<any>({});

    // --- 2. Helper Functions ---
    const handleFileSelect = () => {
        setCsvPreview([
            { group: 'FG', category: 'Sofa', catCode: 'SO', subCategory: 'Fabric', subCatCode: 'FB', note: 'Standard Fabric' },
            { group: 'RM', category: 'Steel', catCode: 'ST', subCategory: 'Pipe', subCatCode: 'PI', note: 'SS304 Pipe' }
        ]);
    };

    const getGroupStyle = (groupId: string) => {
        const group = groups.find(g => g.id === groupId);
        const color = group ? group.color : '#7691ad';
        return {
            borderColor: color + '40', 
            color: color,
            backgroundColor: color + '10' 
        };
    };

    const formatUpdatedDate = (dateStr: string) => {
        if (!dateStr) return { day: '-', month: '-' };
        const date = new Date(dateStr);
        return {
            day: String(date.getDate()).padStart(2, '0'),
            month: date.toLocaleString('en-US', { month: 'short' })
        };
    };

    const openModal = (item: any = null) => {
        if (item) setForm({ ...item, group: item.groups[0] });
        else setForm({ rowId: null, group: groups[0]?.id || 'FG', category: '', catCode: '', subCategory: '', subCatCode: '', note: '' });
        setShowModal(true);
    };

    const saveItem = () => {
        const now = new Date().toISOString().split('T')[0];
        const mastCode = (form.catCode + form.subCatCode).toUpperCase();
        if (form.rowId) {
            setItems(prev => prev.map(i => i.rowId === form.rowId ? { ...form, groups: [form.group], mastCode, updatedAt: now } : i));
        } else {
            setItems(prev => [{ ...form, rowId: Date.now(), groups: [form.group], mastCode, updatedAt: now, updatedBy: 'ADMIN' }, ...prev]);
        }
        setShowModal(false);
    };

    const addGroup = () => {
        if (newGroupInput.id && newGroupInput.desc) {
            let colorStr = newGroupInput.color.trim();
            if (!colorStr.startsWith('#')) colorStr = '#' + colorStr;
            setGroups([...groups, { id: newGroupInput.id.toUpperCase(), desc: newGroupInput.desc, color: colorStr }]);
            setNewGroupInput({ id: '', desc: '', color: '1f2a44' });
        }
    };

    // --- 3. Effects ---
    useEffect(() => {
        setItems([
            { rowId: 1, mastCode: 'FGSF', groups: ['FG'], category: 'Sofa', catCode: 'FG', subCategory: 'Fabric', subCatCode: 'SF', note: 'Fabric 3-Seater Sofa', updatedAt: '2026-03-01', updatedBy: 'ADMIN' },
            { rowId: 2, mastCode: 'FGLT', groups: ['FG'], category: 'Sofa', catCode: 'FG', subCategory: 'Leather', subCatCode: 'LT', note: 'Premium Leather Sofa', updatedAt: '2026-03-02', updatedBy: 'ADMIN' },
            { rowId: 3, mastCode: 'RMTK', groups: ['RM'], category: 'Wood', catCode: 'RM', subCategory: 'Teak', subCatCode: 'TK', note: 'Raw Teak Wood A-Grade', updatedAt: '2026-03-05', updatedBy: 'PUR' },
            { rowId: 4, mastCode: 'RMOK', groups: ['RM'], category: 'Wood', catCode: 'RM', subCategory: 'Oak', subCatCode: 'OK', note: 'Imported Oak', updatedAt: '2026-03-05', updatedBy: 'PUR' },
            { rowId: 5, mastCode: 'FBLN', groups: ['FB'], category: 'Fabric', catCode: 'FB', subCategory: 'Linen', subCatCode: 'LN', note: 'Premium Linen Roll', updatedAt: '2026-03-08', updatedBy: 'PUR' },
            { rowId: 6, mastCode: 'HWHG', groups: ['HW'], category: 'Hardware', catCode: 'HW', subCategory: 'Hinge', subCatCode: 'HG', note: 'Soft Close Hinge', updatedAt: '2026-03-10', updatedBy: 'STORE' },
            { rowId: 7, mastCode: 'PKBX', groups: ['PK'], category: 'Packaging', catCode: 'PK', subCategory: 'Box', subCatCode: 'BX', note: 'Corrugated Box L', updatedAt: '2026-03-12', updatedBy: 'ADMIN' },
        ]);
    }, []);

    useEffect(() => {
        if (activeTab === 'analytics' && items.length > 0) {
            Object.keys(charts.current).forEach(k => charts.current[k]?.destroy());
            
            if (typeChartRef.current) {
                const counts: any = {};
                items.forEach(i => { const g = i.groups[0] || 'ETC'; counts[g] = (counts[g] || 0) + 1; });
                const chartColors = Object.keys(counts).map(gid => {
                    const found = groups.find(g => g.id === gid);
                    return found ? found.color : '#7691ad';
                });
                charts.current.type = new Chart(typeChartRef.current, {
                    type: 'doughnut',
                    data: {
                        labels: Object.keys(counts),
                        datasets: [{
                            data: Object.values(counts),
                            backgroundColor: chartColors,
                            borderWidth: 0, 
                            // @ts-ignore
                            cutout: '75%', 
                            borderRadius: 10
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10, weight: 'bold' } } } } }
                });
            }

            if (barChartRef.current) {
                const groupCounts: any = {};
                items.forEach(i => { const g = i.groups[0]; groupCounts[g] = (groupCounts[g] || 0) + 1; });
                charts.current.bar = new Chart(barChartRef.current, {
                    type: 'bar',
                    data: {
                        labels: Object.keys(groupCounts),
                        datasets: [{
                            label: 'Registry Count',
                            data: Object.values(groupCounts),
                            backgroundColor: '#ce870a',
                            borderRadius: 4
                        }]
                    },
                    options: { 
                        responsive: true, maintainAspectRatio: false, 
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } }
                    }
                });
            }
        }
    }, [activeTab, items, groups]);

    // --- 4. Memoized Logic ---
    const filteredItems = useMemo(() => {
        let res = items;
        if (activeGroup !== 'All') res = res.filter(i => i.groups.includes(activeGroup));
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            res = res.filter(i => i.mastCode.toLowerCase().includes(q) || i.category.toLowerCase().includes(q) || i.subCategory.toLowerCase().includes(q) || (i.note && i.note.toLowerCase().includes(q)));
        }
        return res;
    }, [items, activeGroup, searchQuery]);

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredItems.slice(start, start + itemsPerPage);
    }, [filteredItems, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <style>{`
.minimal-th { font-size: 12px !important; text-transform: uppercase; letter-spacing: 0.1em; color: white; padding: 16px 24px; font-weight: 900; background-color: #1f2a44; border-bottom: 2px solid #ce870a; white-space: nowrap; cursor: pointer; }
                .minimal-td { padding: 12px 24px; vertical-align: middle; color: #1f2a44; font-size: 12px !important; font-weight: 500; border-bottom: 1px solid rgba(0,0,0,0.05); white-space: nowrap; }
                .input-primary { width: 100%; background: white; border: 1px solid #d7d7d7; border-radius: 8px; padding: 8px 12px; font-size: 12px; color: #1f2a44; font-weight: bold; outline: none; transition: all 0.2s; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.02); }
                .input-primary:focus { border-color: #5372ba; box-shadow: 0 0 0 3px rgba(83,114,186,0.1); }
                .group-btn { border: 1px solid #d7d7d7; padding: 8px 12px; border-radius: 8px; transition: all 0.2s; background: white; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.02); }
                .group-btn.active { border-color: #1f2a44; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                .badge-code { background-color: #f7f3ee; color: #7691ad; font-family: 'JetBrains Mono'; font-weight: 800; font-size: 10px; padding: 2px 8px; border-radius: 6px; border: 1px solid #d7d7d7; }
            `}</style>

            <header className="flex flex-wrap items-center justify-between px-6 py-4 gap-4 shrink-0 bg-transparent">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm border border-silver">
                        <QrCode size={24} className="text-primary-dark" strokeWidth={2.5} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 leading-none">
                            <h2 className="text-primary-dark font-black tracking-tight text-2xl uppercase">MASTER</h2>
                            <h2 className="text-accent font-black tracking-tight text-2xl uppercase">CODE</h2>
                        </div>
                        <p className="text-dusty-blue text-[10px] font-bold mt-1 uppercase tracking-widest leading-none">Categorization Repository</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white p-1 rounded-xl border border-silver shadow-sm">
                        <button onClick={() => setActiveTab('list')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'list' ? 'bg-primary-dark text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Master List</button>
                        <button onClick={() => setActiveTab('analytics')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'analytics' ? 'bg-primary-dark text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Analytics</button>
                    </div>
                    <button onClick={() => setIsGuideOpen(true)} className="p-2 bg-white border border-silver rounded-xl text-dusty-blue hover:text-primary transition-all shadow-sm"><HelpCircle size={18} /></button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6 space-y-6 w-full relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-500">
                    <KpiCard title="Total Codes" val={items.length} color={'#1f2a44'} IconComponent={Database} desc="Registry Count" />
                    <KpiCard title="Finished Goods" val={items.filter(i=>i.groups.includes('FG')).length} color={'#ce870a'} IconComponent={Package} desc="Product Categories" />
                    <KpiCard title="Materials" val={items.filter(i=>!i.groups.includes('FG')).length} color={'#596c33'} IconComponent={Leaf} desc="Supply Items" />
                    <KpiCard title="Status" val="SYNCED" color={'#5372ba'} IconComponent={RefreshCw} desc="System Status" />
                </div>

                {activeTab === 'list' ? (
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-silver/50 flex flex-col overflow-hidden min-h-[500px] animate-in fade-in duration-500">
                        <div className="px-6 py-4 border-b border-silver flex flex-col lg:flex-row items-center justify-between gap-4 bg-bg-main">
                            <div className="flex items-center gap-3 w-full lg:w-auto">
                                <div className="relative">
                                    <button onClick={() => setGroupDropdownOpen(!groupDropdownOpen)} className="flex items-center gap-3 bg-white px-4 h-9 rounded-xl border border-silver shadow-sm hover:border-primary transition-all min-w-[180px]">
                                        <ListFilter size={14} className="text-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary-dark">{String(activeGroup)}</span>
                                        <span className="bg-bg-main text-[9px] font-bold px-2 py-0.5 rounded-md text-dusty-blue ml-auto">
                                            {activeGroup === 'All' ? items.length : items.filter(i=>i.groups.includes(activeGroup)).length}
                                        </span>
                                        <ChevronDown size={14} className={`text-dusty-blue transition-transform ${groupDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {groupDropdownOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setGroupDropdownOpen(false)}></div>
                                            <div className="absolute top-[110%] left-0 w-64 bg-white border border-silver shadow-xl rounded-xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                                                <button onClick={() => { setActiveGroup('All'); setGroupDropdownOpen(false); setCurrentPage(1); }} className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all ${activeGroup === 'All' ? 'bg-bg-main text-primary-dark' : 'hover:bg-slate-50 text-dusty-blue'}`}>
                                                    <span className="text-[10px] font-black uppercase tracking-widest">All Records</span>
                                                    <span className="bg-white border border-silver text-[9px] font-bold px-1.5 py-0.5 rounded-md">{items.length}</span>
                                                </button>
                                                {groups.map(g => (
                                                    <button key={g.id} onClick={() => { setActiveGroup(g.id); setGroupDropdownOpen(false); setCurrentPage(1); }} className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all ${activeGroup === g.id ? 'bg-bg-main text-primary-dark' : 'hover:bg-slate-50 text-dusty-blue'}`}>
                                                        <div className="flex flex-col text-left">
                                                            <div className="flex items-center gap-1.5">
                                                                <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: g.color}}></div>
                                                                <span className="text-[10px] font-black uppercase tracking-widest">{String(g.id)}</span>
                                                            </div>
                                                            <span className="text-[9px] font-bold text-slate-400 mt-0.5">{String(g.desc)}</span>
                                                        </div>
                                                        <span className="bg-white border border-silver text-[9px] font-bold px-1.5 py-0.5 rounded-md">{items.filter(i=>i.groups.includes(g.id)).length}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="relative flex-1 lg:w-64">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dusty-blue" />
                                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search catalogue..." className="w-full pl-9 pr-4 py-1.5 text-[11px] font-bold rounded-xl border border-silver focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white transition-all shadow-sm h-9" />
                                </div>
                            </div>
                            <div className="flex gap-2 shrink-0 ml-auto">
                                <button onClick={() => setShowUploadModal(true)} className="px-4 py-1.5 bg-white border border-silver text-primary-dark rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-slate-50 transition-all flex items-center gap-1.5 h-9 shadow-sm"><UploadCloud size={14} /> Import</button>
                                <button onClick={() => openModal()} className="sys-btn-primary h-9 flex items-center gap-2"><Plus size={14} className="text-gold" strokeWidth={3} /> NEW CODE</button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="minimal-th">Master Code</th>
                                        <th className="minimal-th text-center">Group</th>
                                        <th className="minimal-th">Category</th>
                                        <th className="minimal-th text-center">Cat. Code</th>
                                        <th className="minimal-th">Sub-Category</th>
                                        <th className="minimal-th text-center">Sub. Code</th>
                                        <th className="minimal-th text-center w-24">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-silver/50">
                                    {paginatedItems.map(item => {
                                        return (
                                            <tr key={item.rowId} className="hover:bg-slate-50/80 transition-colors group">
                                                <td className="minimal-td font-black text-primary-dark font-mono tracking-tight text-[12px]">{String(item.mastCode)}</td>
                                                <td className="minimal-td text-center">
                                                    <span 
                                                        className={`px-2 py-0.5 rounded-md border font-black text-[11px] uppercase tracking-widest`}
                                                        style={getGroupStyle(item.groups[0])}
                                                    >{String(item.groups[0])}</span>
                                                </td>
                                                <td className="minimal-td font-bold text-primary-dark">{String(item.category)}</td>
                                                <td className="minimal-td text-center">
                                                    <span className="badge-code uppercase">{String(item.catCode)}</span>
                                                </td>
                                                <td className="minimal-td font-bold text-dusty-blue">{String(item.subCategory)}</td>
                                                <td className="minimal-td text-center">
                                                    <span className="badge-code uppercase">{String(item.subCatCode)}</span>
                                                </td>
                                                <td className="minimal-td text-center">
                                                    <div className="flex justify-center items-center gap-[0.5px] opacity-50 group-hover:opacity-100 transition-all">
                                                        <button onClick={() => openModal(item)} className="w-8 h-8 flex items-center justify-center text-primary hover:bg-primary/10 rounded transition-colors"><Pencil size={16} /></button>
                                                        <button onClick={() => setItems(items.filter(i=>i.rowId!==item.rowId))} className="w-8 h-8 flex items-center justify-center text-danger hover:bg-danger/10 rounded transition-colors"><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-3 border-t border-silver bg-bg-main flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                            <div className="text-[10px] font-bold text-dusty-blue uppercase tracking-widest leading-none">
                                Total <span className="text-primary-dark font-black">{filteredItems.length}</span> Records
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={()=>setCurrentPage(p=>Math.max(1, p-1))} disabled={currentPage===1} className="p-1.5 rounded-lg border border-silver bg-white text-primary-dark disabled:opacity-50 hover:bg-slate-50 shadow-sm transition-all"><ChevronLeft size={14}/></button>
                                <div className="flex items-center px-3 h-8 bg-white border border-silver rounded-lg shadow-sm text-[10px] font-bold text-primary-dark tracking-widest">PAGE {currentPage} / {totalPages}</div>
                                <button onClick={()=>setCurrentPage(p=>Math.min(totalPages, p+1))} disabled={currentPage===totalPages} className="p-1.5 rounded-lg border border-silver bg-white text-primary-dark disabled:opacity-50 hover:bg-slate-50 shadow-sm transition-all"><ChevronRight size={14}/></button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-in fade-in duration-500">
                        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-silver/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col h-[400px]">
                            <h3 className="text-[10px] font-black text-primary-dark uppercase tracking-widest mb-6 flex items-center gap-2">
                                <PieChart size={16} className="text-primary" /> Registry Composition
                            </h3>
                            <div className="flex-1 relative"><canvas ref={typeChartRef}></canvas></div>
                        </div>
                        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-silver/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col h-[400px]">
                            <h3 className="text-[10px] font-black text-primary-dark uppercase tracking-widest mb-6 flex items-center gap-2">
                                <BarChart3 size={16} className="text-accent" /> Group Density
                            </h3>
                            <div className="flex-1 relative"><canvas ref={barChartRef}></canvas></div>
                        </div>
                    </div>
                )}
            </main>

            {/* CREATE / EDIT MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary-dark/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden border border-silver">
                        <div className="bg-bg-main border-b border-silver px-6 py-4 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white border border-silver rounded-xl flex items-center justify-center shadow-sm text-primary"><Database size={20} strokeWidth={2.5} /></div>
                                <div>
                                    <h3 className="text-[14px] font-black text-primary-dark uppercase tracking-widest leading-none">CREATE NEW CODE</h3>
                                    <p className="text-[9px] font-bold text-dusty-blue mt-1.5 uppercase tracking-widest leading-none">Categorization & Structural Logic</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => setShowGroupConfig(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-silver rounded-lg shadow-sm text-[9px] font-black text-primary-dark uppercase tracking-widest hover:bg-slate-50 transition-all">
                                    <Settings2 size={12} className="text-primary" /> CONFIG GROUPS
                                </button>
                                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-lg transition-all text-dusty-blue"><X size={20} /></button>
                            </div>
                        </div>

                        <div className="p-6 flex flex-col gap-6"> 
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-dusty-blue uppercase tracking-widest flex items-center gap-2">Group Type <span className="text-danger">*</span></label>
                                <div className="flex flex-wrap gap-2">
                                    {groups.map(g => (
                                        <button 
                                            key={g.id} 
                                            onClick={() => setForm({...form, group: g.id})} 
                                            className={`group-btn flex flex-col items-start gap-1 min-w-[120px] ${form.group === g.id ? 'active' : ''}`}
                                            style={form.group === g.id ? { borderColor: g.color, backgroundColor: g.color + '05', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' } : {}}
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: g.color}}></div>
                                                <span className="font-black text-[12px] font-mono leading-none" style={{ color: form.group === g.id ? g.color : '#1f2a44' }}>{String(g.id)}</span>
                                            </div>
                                            <span className={`text-[10px] font-bold leading-none ${form.group === g.id ? '' : 'text-slate-400'}`} style={{ color: form.group === g.id ? g.color : '' }}>{String(g.desc)}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                <div className="md:col-span-7 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-dusty-blue uppercase tracking-widest">Category Name <span className="text-danger">*</span></label>
                                            <input value={form.category} onChange={e=>setForm({...form, category: e.target.value})} className="input-primary" placeholder="Sofa, Wood, Hardware..." />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-dusty-blue uppercase tracking-widest">Code <span className="text-danger">*</span></label>
                                            <input value={form.catCode} maxLength={2} onChange={e=>setForm({...form, catCode: e.target.value.toUpperCase()})} className="input-primary text-center font-mono font-black text-sm bg-bg-main uppercase tracking-widest" placeholder="XX" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-dusty-blue uppercase tracking-widest">Sub Category <span className="text-danger">*</span></label>
                                            <input value={form.subCategory} onChange={e=>setForm({...form, subCategory: e.target.value})} className="input-primary" placeholder="Leather, Teak, Hinge..." />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-dusty-blue uppercase tracking-widest">Sub Code <span className="text-danger">*</span></label>
                                            <input value={form.subCatCode} maxLength={2} onChange={e=>setForm({...form, subCatCode: e.target.value.toUpperCase()})} className="input-primary text-center font-mono font-black text-sm bg-bg-main uppercase tracking-widest" placeholder="XX" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-dusty-blue uppercase tracking-widest">Note / Description</label>
                                        <textarea value={form.note} onChange={e=>setForm({...form, note: e.target.value})} className="input-primary h-16 pt-2 resize-none text-[11px]" placeholder="Optional details..." />
                                    </div>
                                </div>

                                <div className="md:col-span-5 flex flex-col justify-center">
                                    <div className="p-6 bg-primary-dark rounded-2xl shadow-xl relative overflow-hidden flex flex-col items-center justify-center gap-3 group font-mono min-h-[160px] border border-primary">
                                        <div className="absolute right-[-20%] top-[-10%] opacity-[0.05] text-white transform rotate-12 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Database size={150} /></div>
                                        <div className="text-[9px] font-black text-accent uppercase tracking-[0.3em] z-10">GENERATED CODE</div>
                                        <div className="flex items-center gap-4 text-3xl font-black text-white tracking-widest z-10 my-2">
                                            <div className="flex flex-col items-center">
                                                <span className="drop-shadow-sm">{String(form.catCode || 'XX')}</span>
                                                <div className="w-8 h-1 bg-white/50 mt-1.5 rounded-full"></div>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="drop-shadow-sm text-accent">{String(form.subCatCode || 'XX')}</span>
                                                <div className="w-8 h-1 bg-accent mt-1.5 rounded-full shadow-[0_0_8px_rgba(206,135,10,0.6)]"></div>
                                            </div>
                                        </div>
                                        <div className="text-[9px] text-dusty-blue uppercase italic z-10 font-bold">Registry Integrity Verified</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-bg-main border-t border-silver flex justify-between items-center shrink-0">
                            <button onClick={() => setForm({ ...form, category: '', catCode: '', subCategory: '', subCatCode: '', note: '' })} className="flex items-center gap-1.5 text-primary-dark font-black uppercase tracking-widest text-[10px] hover:text-primary transition-colors bg-white border border-silver px-4 py-2 rounded-lg shadow-sm"><RotateCcw size={12}/> Reset</button>
                            <div className="flex gap-3 items-center">
                                <button onClick={() => setShowModal(false)} className="text-[10px] font-black uppercase text-dusty-blue hover:text-primary-dark border border-transparent px-4 py-2 hover:bg-white hover:border-silver rounded-lg shadow-none hover:shadow-sm transition-all tracking-widest">Cancel</button>
                                <button onClick={saveItem} className="sys-btn-primary py-2 px-6 shadow-md flex items-center gap-2">
                                    <Save size={14} className="text-gold" /> SAVE DATA
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* GROUP CONFIG MODAL */}
            {showGroupConfig && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-primary-dark/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-silver animate-in zoom-in-95">
                        <div className="bg-bg-main border-b border-silver px-6 py-4 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-2.5"><Settings2 size={16} className="text-primary" /><h3 className="text-[12px] font-black text-primary-dark uppercase tracking-widest leading-none">GROUP REGISTRY</h3></div>
                            <button onClick={() => setShowGroupConfig(false)} className="p-1 hover:bg-white rounded-lg transition-all text-dusty-blue"><X size={18} /></button>
                        </div>
                        <div className="p-6 bg-white flex-1 flex flex-col gap-6 overflow-hidden">
                            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                                {groups.map((g, i) => (
                                    <div key={i} className="flex items-center justify-between p-2.5 bg-bg-main rounded-xl border border-silver group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-md shadow-inner border border-black/5" style={{ backgroundColor: g.color }}></div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black leading-none text-primary-dark uppercase tracking-widest">{String(g.id)}</span>
                                                <span className="text-[9px] font-bold text-dusty-blue mt-0.5">{String(g.desc)}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => setGroups(groups.filter(group => group.id !== g.id))} className="text-silver hover:text-danger p-1 bg-white rounded border border-transparent group-hover:border-silver transition-all"><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col gap-3 pt-4 border-t border-silver">
                                <div className="grid grid-cols-2 gap-2">
                                    <input value={newGroupInput.id} onChange={e=>setNewGroupInput({...newGroupInput, id: e.target.value.toUpperCase()})} className="input-primary py-2 text-[10px]" placeholder="ID (e.g. FG)" />
                                    <input value={newGroupInput.desc} onChange={e=>setNewGroupInput({...newGroupInput, desc: e.target.value})} className="input-primary py-2 text-[10px] font-bold" placeholder="Description" />
                                </div>
                                <div className="flex flex-col gap-2 bg-bg-main p-3 rounded-xl border border-silver">
                                    <label className="text-[9px] font-bold uppercase text-dusty-blue flex items-center gap-1.5"><Palette size={12} /> HEX Color:</label>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg shadow-inner border border-silver" style={{backgroundColor: (newGroupInput.color.startsWith('#') ? newGroupInput.color : '#' + newGroupInput.color)}}></div>
                                        <input 
                                            type="text" 
                                            value={newGroupInput.color} 
                                            onChange={e=>setNewGroupInput({...newGroupInput, color: e.target.value})} 
                                            className="input-primary font-mono font-black py-1.5 flex-1"
                                            placeholder="1F2A44"
                                            maxLength={7}
                                        />
                                    </div>
                                </div>
                                <button onClick={addGroup} className="w-full bg-primary-dark text-white py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-md font-black text-[10px] uppercase tracking-widest">
                                    <Plus size={14} className="text-gold" /> ADD GROUP
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* IMPORT MODAL */}
            {showUploadModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-primary-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-4xl h-[70vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-silver animate-in zoom-in-95">
                        <div className="bg-bg-main px-6 py-4 flex justify-between items-center text-primary-dark shrink-0 border-b border-silver">
                            <div className="flex items-center gap-2.5"><UploadCloud size={18} className="text-primary" /><h3 className="text-[14px] font-black uppercase tracking-widest leading-none">BULK DATA IMPORT</h3></div>
                            <button onClick={() => {setShowUploadModal(false); setCsvPreview([]);}} className="p-1 hover:bg-white rounded-lg transition-all text-dusty-blue"><X size={20} /></button>
                        </div>
                        <div className="flex-1 flex overflow-hidden">
                            <div className="w-64 bg-slate-50/50 border-r border-silver p-6 flex flex-col gap-6 shrink-0">
                                <h4 className="font-black text-[10px] uppercase tracking-widest text-primary-dark border-b border-silver pb-2">Prep Guide</h4>
                                <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 leading-relaxed font-bold text-dusty-blue text-[11px]">
                                    <div className="flex gap-2.5"><div className="w-5 h-5 rounded-md bg-primary-dark text-white flex items-center justify-center font-black text-[9px] shrink-0">1</div><p>CSV files only <span className="text-danger font-black">.csv</span></p></div>
                                    <div className="flex gap-2.5"><div className="w-5 h-5 rounded-md bg-primary-dark text-white flex items-center justify-center font-black text-[9px] shrink-0">2</div><p>Headers:<br/><code className="bg-white border border-silver px-1.5 py-0.5 rounded text-[9px] uppercase text-primary mt-1 inline-block text-wrap">group, category, catCode, subCategory, subCatCode, note</code></p></div>
                                </div>
                                <div className="mt-auto pt-4 border-t border-silver"><button className="w-full flex items-center justify-center gap-2 bg-white border border-silver py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-primary-dark hover:bg-bg-main transition-all shadow-sm"><FileCheck size={14} className="text-success" /> TEMPLATE</button></div>
                            </div>
                            <div className="flex-1 flex flex-col p-6 bg-white overflow-hidden justify-center items-center">
                                {csvPreview.length === 0 ? (
                                    <div onClick={handleFileSelect} className="w-full max-w-sm border-2 border-dashed border-silver p-12 rounded-3xl bg-bg-main/50 flex flex-col items-center gap-4 cursor-pointer hover:border-primary hover:bg-bg-main transition-all group">
                                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-silver flex items-center justify-center text-dusty-blue group-hover:text-primary group-hover:scale-110 transition-all"><UploadCloud size={24}/></div>
                                        <div className="text-center"><p className="text-[11px] font-black text-primary-dark uppercase tracking-widest">Select CSV file</p></div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col animate-in fade-in duration-500 overflow-hidden text-primary-dark w-full">
                                        <div className="flex justify-between items-end mb-3"><div><h4 className="text-[10px] font-black uppercase tracking-widest">Preview ({csvPreview.length} items)</h4></div><button onClick={() => setCsvPreview([])} className="text-[9px] font-black text-danger hover:underline uppercase flex items-center gap-1"><Trash2 size={16}/> CLEAR</button></div>
                                        <div className="flex-1 overflow-auto border border-silver rounded-xl bg-white custom-scrollbar shadow-sm text-[11px] font-bold">
                                            <table className="w-full text-left border-collapse whitespace-nowrap"><thead className="sticky top-0 z-10 bg-bg-main border-b border-silver font-black text-[9px] text-primary-dark uppercase tracking-widest"><th className="p-3 text-left">Group</th><th className="p-3 text-left">Category</th><th className="p-3 text-left">Cat.Code</th><th className="p-3 text-left">Sub-Cat</th><th className="p-3 text-left">Sub.Code</th><th className="p-3 text-left">Note</th></thead>
                                            <tbody className="divide-y divide-silver">{csvPreview.map((row, idx) => (<tr key={idx} className="hover:bg-slate-50 transition-colors"><td className="p-3 font-black text-primary">{String(row.group)}</td><td className="p-3">{String(row.category)}</td><td className="p-3 font-mono font-black">{String(row.catCode)}</td><td className="p-3">{String(row.subCategory)}</td><td className="p-3 font-mono font-black">{String(row.subCatCode)}</td><td className="p-3 text-dusty-blue truncate max-w-[150px]">{String(row.note)}</td></tr>))}</tbody></table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="p-4 bg-bg-main border-t border-silver flex justify-end shrink-0">
                            <button disabled={csvPreview.length === 0} onClick={() => {setShowUploadModal(false); setCsvPreview([]);}} className="sys-btn-primary py-2 px-8 flex items-center gap-2">
                                <Zap size={14} className="text-gold" /> START IMPORT
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
