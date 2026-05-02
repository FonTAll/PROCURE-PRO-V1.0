import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    Package, Settings, List, BarChart2, Database, Box, Leaf, 
    PlusCircle, CheckCircle, Circle, Tag, AlertOctagon, RotateCcw, 
    CheckCircle2, X, Pencil, Trash2, Search, UploadCloud, Plus, 
    ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, Check, 
    HelpCircle, Info, RefreshCw, FileText, Settings2, DollarSign, Clock, Layers,
    Zap, Terminal, Layout, Scale, Calculator, Table, Filter, ChevronDown, ListFilter,
    MoreHorizontal, FileCheck, AlertCircle, Coins, Wallet, Factory, LayoutGrid,
    Cpu, Cog, Hash, Braces, Wand2, ArrowRight, BarChart3, PieChart, Palette
} from 'lucide-react';
import Chart from 'chart.js/auto';

// --- Mock Code Master Registry ---
const CODE_MASTER_REGISTRY: Record<string, any> = {
    'FG': [
        { cat: 'Clothes Rack', code: 'CR', subs: [{ name: 'Rack A', code: 'RA' }, { name: 'Rack B', code: 'RB' }] },
        { cat: 'Laundry', code: 'LD', subs: [{ name: 'Steel', code: 'ST' }, { name: 'Wood', code: 'WD' }] }
    ],
    'RM': [
        { cat: 'Raw Material', code: 'MT', subs: [{ name: 'Steel Pipe', code: 'SP' }, { name: 'Wood Board', code: 'WB' }] }
    ],
    'HW': [
        { cat: 'Hardware', code: 'HW', subs: [{ name: 'Hinge', code: 'HG' }, { name: 'Screw', code: 'SC' }] }
    ],
    'FB': [
        { cat: 'Fabric', code: 'FB', subs: [{ name: 'Linen', code: 'LN' }, { name: 'Cotton', code: 'CT' }] }
    ],
    'PK': [
        { cat: 'Packaging', code: 'PK', subs: [{ name: 'Box', code: 'BX' }, { name: 'Wrap', code: 'WP' }] }
    ]
};

// --- Sub Component: KPI Card ---
const KpiCard = ({ title, val, color, IconComponent, desc }: any) => (
    <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-silver/50 relative overflow-hidden group h-full cursor-pointer text-[11px]">
        <div className="absolute -right-4 -bottom-4 opacity-[0.05] transform rotate-12 group-hover:scale-110 transition-transform duration-700 pointer-events-none z-0">
            <IconComponent size={100} style={{ color: color }} />
        </div>
        <div className="relative z-10 flex flex-col justify-between items-start h-full w-full">
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

export default function ItemMaster() {
    const [activeTab, setActiveTab] = useState('masterList'); 
    const [searchQuery, setSearchQuery] = useState('');
    const [activeGroup, setActiveGroup] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [modalSubMenu, setModalSubMenu] = useState('general');
    
    const [showNameConfig, setShowNameConfig] = useState(false);
    const [showCodeConfig, setShowCodeConfig] = useState(false);
    const [showBrandConfig, setShowBrandConfig] = useState(false);
    
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [csvPreview, setCsvPreview] = useState<any[]>([]);
    const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false); 

    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    
    const [items, setItems] = useState<any[]>([]);
    const [groups] = useState([
        { id: 'FG', desc: 'Finished Goods', color: '#1f2a44' },
        { id: 'RM', desc: 'Raw Material', color: '#596c33' },
        { id: 'HW', desc: 'Hardware', color: '#ce870a' },
        { id: 'FB', desc: 'Fabric', color: '#d1b028' },
        { id: 'PK', desc: 'Packaging', color: '#7691ad' }
    ]);
    
    const [units] = useState(['Set', 'Pcs', 'Kg', 'Roll', 'Sheet', 'M', 'Yard']);
    const [brands] = useState(['HomePro', 'Index Living Mall', 'IKEA', 'Global House', 'Thai Watsadu', 'DoHome', 'Boonthavorn']);

    const [form, setForm] = useState<any>({
        rowId: null, itemCode: '', itemName: '', itemType: 'FG', category: '', catCode: '', 
        subCategory: '', subCatCode: '', model: '', subModel: '', brand: 'HomePro',
        baseUnit: 'Pcs', purchaseUnit: 'Pcs', conversionRate: 1, 
        stdCost: 0, stdPrice: 0, leadTime: 0, moq: 0, status: 'Active'
    });

    const [nameRules, setNameRules] = useState({
        fg: '[SubCategory] รุ่น [Model] [Sub-Model]-[Brand]®',
        wiwo: '[Sub-Model] [Model] [SubCategory]',
        rm: '[SubCategory] [Model] [Sub-Model]'
    });

    const [codeRules, setCodeRules] = useState<any>({
        padding: 3,
        separator: '-',
        showPrefix: { FG: false, RM: true, HW: true, FB: true, PK: true }
    });

    const typeChartRef = useRef<HTMLCanvasElement>(null);
    const charts = useRef<any>({});

    useEffect(() => {
        setItems([
            { rowId: 1, itemCode: 'CRRA-001', itemName: 'Rack A รุ่น Modern Pro S1-HomePro®', itemType: 'FG', category: 'Clothes Rack', subCategory: 'Rack A', baseUnit: 'Set', stdCost: 580, stdPrice: 1200, leadTime: 7, moq: 10, status: 'Active', updatedAt: '2026-04-10' },
            { rowId: 2, itemCode: 'RM-MTWB-001', itemName: 'Steel Tube 50mm Industrial', itemType: 'RM', category: 'Raw Material', subCategory: 'Steel Tube', baseUnit: 'M', stdCost: 150, stdPrice: 0, leadTime: 3, moq: 100, status: 'Active', updatedAt: '2026-04-11' },
        ]);
    }, []);

    const categoryOptions = useMemo(() => CODE_MASTER_REGISTRY[form.itemType] || [], [form.itemType]);
    const subCategoryOptions = useMemo(() => {
        const found = categoryOptions.find((c: any) => c.cat === form.category);
        return found ? found.subs : [];
    }, [categoryOptions, form.category]);

    useEffect(() => {
        if (!form.rowId && form.catCode && form.subCatCode) {
            let prefix = "";
            if (codeRules.showPrefix[form.itemType]) prefix = `${form.itemType}-`;
            
            const groupKey = `${prefix}${form.catCode}${form.subCatCode}`;
            const relevantItems = items.filter(i => i.itemCode.startsWith(groupKey));
            
            let nextSeq = 1;
            if (relevantItems.length > 0) {
                const seqs = relevantItems.map(i => parseInt(i.itemCode.split('-').pop()) || 0);
                nextSeq = Math.max(...seqs) + 1;
            }
            const seqStr = String(nextSeq).padStart(codeRules.padding, '0');
            const newCode = `${groupKey}${codeRules.separator}${seqStr}`;

            let pattern = form.itemType === 'FG' ? nameRules.fg : nameRules.wiwo;
            if (form.itemType === 'RM') pattern = nameRules.rm;

            let nameParts = pattern;
            const mappings: any = {
                '[SubCategory]': form.subCategory,
                '[Model]': form.model,
                '[Sub-Model]': form.subModel,
                '[Brand]': form.brand,
                '[Category]': form.category,
                '[Code]': seqStr
            };

            Object.entries(mappings).forEach(([tag, val]) => {
                if (!val) {
                    if (tag === '[Model]') nameParts = nameParts.replace('รุ่น', '');
                    if (tag === '[Brand]') nameParts = nameParts.replace('-', '').replace('®', '');
                    nameParts = nameParts.replace(tag, '');
                } else {
                    nameParts = nameParts.replace(tag, String(val));
                }
            });

            setForm((prev: any) => ({ ...prev, itemCode: newCode, itemName: nameParts.trim().replace(/\s+/g, ' ') }));
        }
    }, [form.itemType, form.category, form.subCategory, form.model, form.subModel, form.brand, form.catCode, form.subCatCode, nameRules, codeRules, form.rowId, items]);

    useEffect(() => {
        if (activeTab === 'analytics' && items.length > 0) {
            Object.keys(charts.current).forEach(k => charts.current[k]?.destroy());
            
            if (typeChartRef.current) {
                const counts: any = {};
                items.forEach(i => { counts[i.itemType] = (counts[i.itemType] || 0) + 1; });
                
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
        }
    }, [activeTab, items, groups]);

    const filteredItems = useMemo(() => {
        let res = items;
        if (activeGroup !== 'All') res = res.filter(i => i.itemType === activeGroup);
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            res = res.filter(i => i.itemCode.toLowerCase().includes(q) || i.itemName.toLowerCase().includes(q));
        }
        return res;
    }, [items, activeGroup, searchQuery]);

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredItems.slice(start, start + itemsPerPage);
    }, [filteredItems, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;

    const handleNewItem = () => {
        setForm({
            rowId: null, itemCode: '', itemName: '', itemType: 'FG', category: '', catCode: '', 
            subCategory: '', subCatCode: '', model: '', subModel: '', brand: brands[0],
            baseUnit: 'Pcs', purchaseUnit: 'Pcs', conversionRate: 1, 
            stdCost: 0, stdPrice: 0, leadTime: 0, moq: 0, status: 'Active'
        });
        setModalSubMenu('general');
        setShowModal(true);
    };

    const handleSaveItem = () => {
        const now = new Date().toISOString().split('T')[0];
        setItems(prev => [{ ...form, rowId: Date.now(), updatedAt: now }, ...prev]);
        setShowModal(false);
    };

    const getGroupStyle = (groupId: string) => {
        const group = groups.find(g => g.id === groupId);
        const color = group ? group.color : '#7691ad';
        return { borderColor: color + '40', color: color, backgroundColor: color + '10' };
    };

    const handleFileSelect = () => {
        setCsvPreview([
            { itemType: 'FG', category: 'Laundry', subCategory: 'Steel', model: 'T10', brand: 'HomePro', baseUnit: 'Set', cost: 450, price: 990 },
            { itemType: 'RM', category: 'Raw Material', subCategory: 'Steel Tube', model: '-', brand: '-', baseUnit: 'Kg', cost: 85, price: 0 }
        ]);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <style>{`
.minimal-th { font-size: 12px !important; text-transform: uppercase; letter-spacing: 0.1em; color: white; padding: 16px 24px; font-weight: 900; background-color: #1f2a44; border-bottom: 2px solid #ce870a; white-space: nowrap; cursor: pointer; }
                .minimal-td { padding: 12px 24px; vertical-align: middle; color: #1f2a44; font-size: 12px !important; font-weight: 500; border-bottom: 1px solid rgba(0,0,0,0.05); white-space: nowrap; }
                .input-field { width: 100%; background: white; border: 1px solid #d7d7d7; border-radius: 8px; padding: 8px 12px; font-size: 12px; color: #1f2a44; font-weight: bold; outline: none; transition: all 0.2s; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.02); }
                .input-field:focus { border-color: #5372ba; box-shadow: 0 0 0 3px rgba(83,114,186,0.1); }
                .sidebar-item { padding: 8px 12px; border-radius: 8px; font-size: 10px; font-weight: 800; display: flex; align-items: center; gap: 8px; transition: all 0.3s; cursor: pointer; color: #7691ad; text-transform: uppercase; border: 1px solid transparent; }
                .sidebar-item.active { background: white; color: #1f2a44; border-color: #d7d7d7; box-shadow: 0 2px 6px rgba(0,0,0,0.02); }
                .config-btn { font-size: 8px; font-weight: 900; color: #ce870a; display: flex; align-items: center; gap: 2px; text-transform: uppercase; transition: all 0.2s; }
                .config-btn:hover { color: #1f2a44; }
                .badge-code { background-color: #f7f3ee; color: #7691ad; font-family: 'JetBrains Mono'; font-weight: 800; font-size: 10px; padding: 2px 8px; border-radius: 6px; border: 1px solid #d7d7d7; }
            `}</style>            

            {/* Header - Transparent */}
            <header className="flex flex-wrap items-center justify-between px-6 py-4 gap-4 shrink-0 bg-transparent">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm border border-silver">
                        <Package size={24} className="text-primary-dark" strokeWidth={2.5} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 leading-none">
                            <h2 className="text-primary-dark font-black tracking-tight text-2xl uppercase">ITEM</h2>
                            <h2 className="text-accent font-black tracking-tight text-2xl uppercase">MASTER</h2>
                        </div>
                        <p className="text-dusty-blue text-[10px] font-bold mt-1 uppercase tracking-widest leading-none">Resource Central Registry</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-white p-1 rounded-xl border border-silver shadow-sm">
                        <button onClick={() => setActiveTab('masterList')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'masterList' ? 'bg-primary-dark text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}><List size={14} /> Master List</button>
                        <button onClick={() => setActiveTab('analytics')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-primary-dark text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}><BarChart3 size={14} /> Analytics</button>
                    </div>
                    <button onClick={() => setIsGuideOpen(true)} className="p-2 bg-white border border-silver rounded-xl text-dusty-blue hover:text-primary transition-all shadow-sm"><HelpCircle size={18} /></button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6 space-y-6 w-full relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-500">
                    <KpiCard title="Master Registry" val={items.length} color={'#1f2a44'} IconComponent={Database} desc="SKUs Defined" />
                    <KpiCard title="FG Components" val={items.filter(i=>i.itemType==='FG').length} color={'#ce870a'} IconComponent={Box} desc="Market Ready Items" />
                    <KpiCard title="Material Supply" val={items.filter(i=>i.itemType!=='FG').length} color={'#596c33'} IconComponent={Leaf} desc="RM & Components" />
                    <KpiCard title="Registry Pulse" val="SYNCED" color={'#5372ba'} IconComponent={RefreshCw} desc="Real-time Synchronization" />
                </div>

                {activeTab === 'masterList' ? (
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-silver/50 flex flex-col overflow-hidden min-h-[500px] animate-in fade-in duration-500">
                        <div className="px-6 py-4 border-b border-silver flex flex-col lg:flex-row items-center justify-between gap-4 bg-bg-main">
                            <div className="flex items-center gap-3 w-full lg:w-auto">
                                <div className="relative">
                                    <button onClick={() => setGroupDropdownOpen(!groupDropdownOpen)} className="flex items-center gap-3 bg-white px-4 h-9 rounded-xl border border-silver shadow-sm hover:border-primary transition-all min-w-[180px]">
                                        <ListFilter size={14} className="text-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary-dark">{activeGroup}</span>
                                        <span className="bg-bg-main text-[9px] font-bold px-2 py-0.5 rounded-md text-dusty-blue ml-auto">
                                            {activeGroup === 'All' ? items.length : items.filter(i=>i.itemType===activeGroup).length}
                                        </span>
                                        <ChevronDown size={14} className={`text-dusty-blue transition-transform ${groupDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {groupDropdownOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setGroupDropdownOpen(false)}></div>
                                            <div className="absolute top-[110%] left-0 w-64 bg-white border border-silver shadow-xl rounded-xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                                                <button onClick={() => { setActiveGroup('All'); setGroupDropdownOpen(false); setCurrentPage(1); }} className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all ${activeGroup === 'All' ? 'bg-bg-main text-primary-dark' : 'hover:bg-slate-50 text-dusty-blue'}`}>
                                                    <span className="text-[10px] font-black uppercase tracking-widest">All Items</span>
                                                    <span className="bg-white border border-silver text-[9px] font-bold px-1.5 py-0.5 rounded-md">{items.length}</span>
                                                </button>
                                                {groups.map(g => (
                                                    <button key={g.id} onClick={() => { setActiveGroup(g.id); setGroupDropdownOpen(false); setCurrentPage(1); }} className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all ${activeGroup === g.id ? 'bg-bg-main text-primary-dark' : 'hover:bg-slate-50 text-dusty-blue'}`}>
                                                        <div className="flex flex-col text-left">
                                                            <div className="flex items-center gap-1.5">
                                                                <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: g.color}}></div>
                                                                <span className="text-[10px] font-black uppercase tracking-widest">{g.id}</span>
                                                            </div>
                                                            <span className="text-[9px] font-bold text-slate-400 mt-0.5">{g.desc}</span>
                                                        </div>
                                                        <span className="bg-white border border-silver text-[9px] font-bold px-1.5 py-0.5 rounded-md">{items.filter(i=>i.itemType===g.id).length}</span>
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
                                <button onClick={handleNewItem} className="sys-btn-primary h-9 flex items-center gap-2"><Plus size={14} className="text-gold" strokeWidth={3} /> NEW ITEM</button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="minimal-th">Item Code</th>
                                        <th className="minimal-th text-center text-accent">GROUP</th>
                                        <th className="minimal-th">Item Name & Description</th>
                                        <th className="minimal-th">Category Path</th>
                                        <th className="minimal-th text-center">Unit</th>
                                        <th className="minimal-th text-right">Std Price</th>
                                        <th className="minimal-th text-center w-24">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-silver/50">
                                    {paginatedItems.map(item => (
                                        <tr key={item.rowId} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="minimal-td font-black text-primary-dark font-mono tracking-tight text-[12px]">{String(item.itemCode)}</td>
                                            <td className="minimal-td text-center">
                                                <span 
                                                    className={`px-2 py-0.5 rounded-md border font-black text-[11px] uppercase tracking-widest`}
                                                    style={getGroupStyle(item.itemType)}
                                                >{String(item.itemType)}</span>
                                            </td>
                                            <td className="minimal-td font-bold text-primary-dark">{String(item.itemName)}</td>
                                            <td className="minimal-td"><div className="flex items-center gap-1.5"><span className="text-dusty-blue font-bold uppercase text-[9px]">{String(item.category)}</span><ChevronRight size={10} className="text-silver" /><span className="text-primary-dark font-bold text-[10px]">{String(item.subCategory)}</span></div></td>
                                            <td className="minimal-td text-center font-bold text-dusty-blue uppercase text-[10px]">{String(item.baseUnit)}</td>
                                            <td className="minimal-td text-right font-black font-mono">฿{item.stdPrice.toLocaleString()}</td>
                                            <td className="minimal-td text-center">
                                                <div className="flex justify-center items-center gap-[0.5px] opacity-50 group-hover:opacity-100 transition-all">
                                                    <button className="w-8 h-8 flex items-center justify-center text-primary hover:bg-primary/10 rounded transition-colors"><Pencil size={16} /></button>
                                                    <button onClick={()=>setItems(items.filter(i=>i.rowId!==item.rowId))} className="w-8 h-8 flex items-center justify-center text-danger hover:bg-danger/10 rounded transition-colors"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-3 border-t border-silver bg-bg-main flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                            <div className="text-[10px] font-bold text-dusty-blue uppercase tracking-widest leading-none">Total <span className="text-primary-dark font-black">{filteredItems.length}</span> Records</div>
                            <div className="flex items-center gap-1">
                                <button onClick={()=>setCurrentPage(p=>Math.max(1, p-1))} disabled={currentPage===1} className="p-1.5 rounded-lg border border-silver bg-white text-primary-dark disabled:opacity-50 hover:bg-slate-50 shadow-sm transition-all"><ChevronLeft size={14}/></button>
                                <div className="flex items-center px-3 h-8 bg-white border border-silver rounded-lg shadow-sm text-[10px] font-bold text-primary-dark tracking-widest">PAGE {currentPage} / {totalPages}</div>
                                <button onClick={()=>setCurrentPage(p=>Math.min(totalPages, p+1))} disabled={currentPage===totalPages} className="p-1.5 rounded-lg border border-silver bg-white text-primary-dark disabled:opacity-50 hover:bg-slate-50 shadow-sm transition-all"><ChevronRight size={14}/></button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-in fade-in duration-500 min-h-[400px]">
                        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-silver/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col h-full">
                            <h3 className="text-[10px] font-black text-primary-dark uppercase tracking-widest mb-6 flex items-center gap-2">
                                <PieChart size={16} className="text-accent" /> Group Composition
                            </h3>
                            <div className="flex-1 relative"><canvas ref={typeChartRef}></canvas></div>
                        </div>
                        <div className="bg-primary-sidebar rounded-2xl p-8 border border-silver/20 flex flex-col justify-center relative overflow-hidden h-full">
                            <div className="absolute right-[-20px] top-[-20px] opacity-[0.05] text-white transform rotate-12"><BarChart3 size={300} /></div>
                            <div className="relative z-10 space-y-6">
                                <h3 className="text-lg font-black text-white uppercase tracking-widest">Inventory Intelligence</h3>
                                <p className="text-dusty-blue text-[11px] leading-relaxed max-w-sm">Advanced insights into your registry categorization and asset valuation. System optimized for high-volume data analytics.</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10"><span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Portfolio Health</span><span className="text-[14px] font-black text-white">OPTIMIZED</span></div>
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10"><span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Sync Latency</span><span className="text-[14px] font-black text-success">0.8ms</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* CREATE / EDIT MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary-dark/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden border border-silver">
                        <div className="bg-bg-main border-b border-silver px-6 py-4 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white border border-silver rounded-xl flex items-center justify-center shadow-sm text-primary"><Plus size={20} strokeWidth={2.5} /></div>
                                <div><h3 className="text-[14px] font-black text-primary-dark uppercase tracking-widest leading-none">CREATE NEW ITEM</h3><p className="text-[9px] font-bold text-dusty-blue mt-1.5 uppercase tracking-widest leading-none">Resource Central Registry Workflow</p></div>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-lg transition-all text-dusty-blue"><X size={20} /></button>
                        </div>

                        <div className="flex-1 flex overflow-hidden">
                            <div className="w-56 bg-slate-50/50 border-r border-silver p-4 flex flex-col gap-2 shrink-0">
                                <button onClick={() => setModalSubMenu('general')} className={`sidebar-item ${modalSubMenu === 'general' ? 'active' : ''}`}><Info size={14} /> General Info</button>
                                <button onClick={() => setModalSubMenu('inventory')} className={`sidebar-item ${modalSubMenu === 'inventory' ? 'active' : ''}`}><Coins size={14} /> Inventory & Costing</button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white">
                                {modalSubMenu === 'general' && (
                                    <div className="space-y-6 animate-in fade-in duration-300">
                                        <div className="space-y-5">
                                            {/* Item Name */}
                                            <div className="flex flex-col gap-2">
                                                <div className="flex justify-between items-end px-1">
                                                    <label className="text-[10px] font-black text-dusty-blue uppercase tracking-widest">Item Name (Auto-Result)</label>
                                                    <button onClick={() => setShowNameConfig(true)} className="config-btn">
                                                        <Settings2 size={12}/> Name Rules
                                                    </button>
                                                </div>
                                                <div className="bg-primary-dark rounded-xl h-14 flex items-center px-5 shadow-inner border border-primary relative overflow-hidden group">
                                                    <div className="absolute right-[-5px] top-[-5px] opacity-[0.05] text-white"><Braces size={50} /></div>
                                                    <span className="text-[14px] font-black font-thai text-accent drop-shadow-sm truncate z-10 tracking-wide uppercase">
                                                        {String(form.itemName || 'Awaiting mapping result...')}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-dusty-blue uppercase tracking-widest">Item Group *</label>
                                                    <select value={form.itemType} onChange={e=>setForm({...form, itemType: e.target.value, category: '', subCategory: '', catCode: '', subCatCode: ''})} className="input-field font-black uppercase">
                                                        {groups.map(k => <option key={k.id} value={k.id}>{k.id} - {k.desc}</option>)}
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-dusty-blue uppercase tracking-widest">Category</label>
                                                    <select value={form.category} onChange={e=>{
                                                        const sel = categoryOptions.find((o: any)=>o.cat === e.target.value);
                                                        setForm({...form, category: e.target.value, catCode: sel?.code || '', subCategory: '', subCatCode: ''})
                                                    }} className="input-field">
                                                        <option value="">-- Choose Category --</option>
                                                        {categoryOptions.map((o: any) => <option key={o.cat} value={o.cat}>{o.cat}</option>)}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-dusty-blue uppercase tracking-widest">Sub Category</label>
                                                    <select value={form.subCategory} onChange={e=>{
                                                        const sel = subCategoryOptions.find((o: any)=>o.name === e.target.value);
                                                        setForm({...form, subCategory: e.target.value, subCatCode: sel?.code || ''})
                                                    }} className="input-field">
                                                        <option value="">-- Select Sub --</option>
                                                        {subCategoryOptions.map((o: any) => <option key={o.name} value={o.name}>{o.name}</option>)}
                                                    </select>
                                                </div>
                                                
                                                {/* Generated Item Code */}
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex justify-between items-end px-1">
                                                        <label className="text-[10px] font-black text-dusty-blue uppercase tracking-widest leading-none">Generated Item Code</label>
                                                        <button onClick={() => setShowCodeConfig(true)} className="config-btn">
                                                            <Settings2 size={12}/> Code Rules
                                                        </button>
                                                    </div>
                                                    <div className="bg-primary-dark rounded-xl h-10 flex items-center justify-center gap-3 px-4 shadow-inner border border-primary relative overflow-hidden">
                                                        {codeRules.showPrefix[form.itemType] && (
                                                            <div className="flex flex-col items-center z-10 w-6">
                                                                <span className="font-mono text-sm font-black text-white leading-none tracking-widest opacity-80 uppercase">{String(form.itemType)}</span>
                                                                <div className="w-full h-0.5 bg-silver mt-1 opacity-40 rounded-full"></div>
                                                            </div>
                                                        )}
                                                        <div className="flex flex-col items-center z-10 w-8">
                                                            <span className="font-mono text-sm font-black text-white leading-none tracking-widest">{String(form.catCode || 'XX') + String(form.subCatCode || 'XX')}</span>
                                                            <div className="w-full h-0.5 bg-accent mt-1 rounded-full shadow-[0_0_4px_rgba(206,135,10,0.6)]"></div>
                                                        </div>
                                                        <div className="flex items-center gap-2 z-10 opacity-40">
                                                            <span className="text-slate-500 font-bold text-sm">-</span>
                                                            <span className="font-mono text-sm font-black text-slate-300">
                                                                {form.itemCode ? String(form.itemCode.split('-').pop()) : '001'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-silver">
                                                <div className="space-y-1"><label className="text-[10px] font-black text-dusty-blue uppercase tracking-widest">Model</label><input value={form.model} onChange={e=>setForm({...form, model: e.target.value})} className="input-field" placeholder="Series" /></div>
                                                <div className="space-y-1"><label className="text-[10px] font-black text-dusty-blue uppercase tracking-widest">Sub-Model</label><input value={form.subModel} onChange={e=>setForm({...form, subModel: e.target.value})} className="input-field" placeholder="Desc" /></div>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-center px-1">
                                                        <label className="text-[10px] font-black text-dusty-blue uppercase tracking-widest">Brand</label>
                                                        <button onClick={() => setShowBrandConfig(true)} className="config-btn"><Cog size={10} /> CONFIG</button>
                                                    </div>
                                                    <select value={form.brand} onChange={e=>setForm({...form, brand: e.target.value})} className="input-field uppercase">
                                                        <option value="">-- No Brand --</option>
                                                        {brands.map(b => <option key={b} value={b}>{b}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {modalSubMenu === 'inventory' && (
                                    <div className="space-y-6 animate-in fade-in duration-300">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-center px-1">
                                                        <label className="text-[10px] font-black text-dusty-blue uppercase tracking-widest">Base Unit (Usage)</label>
                                                        <button className="config-btn"><Cog size={10}/> UNITS</button>
                                                    </div>
                                                    <select value={form.baseUnit} onChange={e=>setForm({...form, baseUnit: e.target.value})} className="input-field uppercase">
                                                        {units.map(u => <option key={u} value={u}>{u}</option>)}
                                                    </select>
                                                </div>
                                                <div className="bg-bg-main p-4 rounded-xl border border-silver space-y-3">
                                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-dark flex items-center gap-2"><Scale size={12} className="text-primary" /> Unit Conversion</h4>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        <div className="space-y-1"><label className="text-[9px] font-bold text-dusty-blue uppercase">Purchasing Unit</label><select value={form.purchaseUnit} onChange={e=>setForm({...form, purchaseUnit: e.target.value})} className="input-field">{units.map(u => <option key={u} value={u}>{u}</option>)}</select></div>
                                                        <div className="flex items-end gap-2"><div className="flex-1 space-y-1"><label className="text-[9px] font-bold text-dusty-blue uppercase">Rate</label><input type="number" value={form.conversionRate} onChange={e=>setForm({...form, conversionRate: e.target.value})} className="input-field text-right font-black" /></div><div className="pb-2 text-[9px] font-bold text-primary-dark uppercase italic">1 {form.purchaseUnit} = {form.conversionRate} {form.baseUnit}</div></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-1"><label className="text-[10px] font-black text-dusty-blue uppercase tracking-widest">Std Cost (฿)</label><input type="number" value={form.stdCost} onChange={e=>setForm({...form, stdCost: e.target.value})} className="input-field text-right font-black font-mono" /></div>
                                                    <div className="space-y-1"><label className="text-[10px] font-black text-accent uppercase tracking-widest">Std Price (฿)</label><input type="number" value={form.stdPrice} onChange={e=>setForm({...form, stdPrice: e.target.value})} className="input-field text-right font-black font-mono focus:border-accent focus:ring-accent/20" /></div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-silver">
                                                    <div className="space-y-1"><label className="text-[10px] font-black text-dusty-blue uppercase tracking-widest">Lead Time (Day)</label><div className="relative"><Clock size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-dusty-blue" /><input type="number" value={form.leadTime} onChange={e=>setForm({...form, leadTime: e.target.value})} className="input-field font-black font-mono" /></div></div>
                                                    <div className="space-y-1"><label className="text-[10px] font-black text-dusty-blue uppercase tracking-widest">MOQ</label><div className="relative"><Package size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-dusty-blue" /><input type="number" value={form.moq} onChange={e=>setForm({...form, moq: e.target.value})} className="input-field font-black font-mono" /></div></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-bg-main border-t border-silver flex justify-end items-center gap-3 shrink-0">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-transparent hover:bg-white hover:border-silver hover:shadow-sm rounded-lg text-[10px] font-black uppercase text-dusty-blue transition-all tracking-widest">Cancel</button>
                            <button onClick={handleSaveItem} className="sys-btn-primary py-2 px-6 flex items-center gap-2">
                                <Plus size={14} className="text-gold" strokeWidth={3} /> SAVE MASTER RECORD
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* BRAND CONFIG MODAL */}
            {showBrandConfig && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-primary-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-silver animate-in zoom-in-95">
                        <div className="bg-bg-main px-6 py-4 flex justify-between items-center text-primary-dark shrink-0 border-b border-silver">
                            <div className="flex items-center gap-2"><Cog size={16} className="text-primary" /><h3 className="text-[12px] font-black uppercase tracking-widest leading-none">BRAND REGISTRY</h3></div>
                            <button onClick={() => setShowBrandConfig(false)} className="p-1 hover:bg-white rounded-md transition-all text-dusty-blue"><X size={18} /></button>
                        </div>
                        <div className="p-6 bg-white flex-1 flex flex-col gap-4 overflow-hidden">
                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2">
                                {brands.map((b, i) => (
                                    <div key={i} className="flex items-center justify-between p-2.5 bg-bg-main rounded-xl border border-silver group">
                                        <span className="text-[10px] font-black text-primary-dark uppercase tracking-widest">{String(b)}</span>
                                        <button className="text-silver hover:text-danger p-1 bg-white rounded border border-transparent group-hover:border-silver transition-all"><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* NAME CONFIG MODAL */}
            {showNameConfig && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-primary-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-silver animate-in zoom-in-95">
                        <div className="bg-bg-main px-6 py-4 flex justify-between items-center text-primary-dark shrink-0 border-b border-silver">
                            <div className="flex items-center gap-2"><Terminal size={16} className="text-primary" /><h3 className="text-[12px] font-black uppercase tracking-widest leading-none">NAME MAPPING RULES</h3></div>
                            <button onClick={() => setShowNameConfig(false)} className="p-1 hover:bg-white rounded-md transition-all text-dusty-blue"><X size={18} /></button>
                        </div>
                        <div className="p-6 space-y-4 bg-white flex-1 overflow-y-auto">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest block border-b border-silver pb-2">Generation Formulae</label>
                                <div><label className="text-[9px] font-bold text-dusty-blue uppercase mb-1 block">FG Pattern</label><textarea value={nameRules.fg} onChange={e=>setNameRules({...nameRules, fg: e.target.value})} className="input-field h-12 pt-2 resize-none" /></div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className="text-[9px] font-bold text-dusty-blue uppercase mb-1 block">OTHERS Pattern</label><textarea value={nameRules.wiwo} onChange={e=>setNameRules({...nameRules, wiwo: e.target.value})} className="input-field h-12 pt-2 resize-none" /></div>
                                    <div><label className="text-[9px] font-bold text-dusty-blue uppercase mb-1 block">RM Pattern</label><textarea value={nameRules.rm} onChange={e=>setNameRules({...nameRules, rm: e.target.value})} className="input-field h-12 pt-2 resize-none" /></div>
                                </div>
                            </div>
                            <button onClick={() => setShowNameConfig(false)} className="sys-btn-primary w-full py-2.5 flex items-center justify-center gap-2"><RefreshCw size={14} /> APPLY MAPPING</button>
                        </div>
                    </div>
                </div>
            )}

            {/* CODE CONFIG MODAL */}
            {showCodeConfig && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-primary-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-silver animate-in zoom-in-95">
                        <div className="bg-bg-main px-6 py-4 flex justify-between items-center text-primary-dark shrink-0 border-b border-silver">
                            <div className="flex items-center gap-2"><Hash size={16} className="text-primary" /><h3 className="text-[12px] font-black uppercase tracking-widest leading-none">CODE RULES</h3></div>
                            <button onClick={() => setShowCodeConfig(false)} className="p-1 hover:bg-white rounded-md transition-all text-dusty-blue"><X size={18} /></button>
                        </div>
                        <div className="p-6 space-y-6 bg-white flex-1 overflow-y-auto">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest block font-mono border-b border-silver pb-2 leading-none">Item Group Prefix Control</label>
                                <div className="grid grid-cols-2 gap-3 font-mono">
                                    {Object.keys(codeRules.showPrefix).map(type => (
                                        <div key={type} className="flex items-center justify-between p-2.5 bg-bg-main rounded-xl border border-silver">
                                            <span className="text-[10px] font-black text-primary-dark uppercase">{String(type)} Prefix</span>
                                            <button 
                                                onClick={() => setCodeRules({...codeRules, showPrefix: {...codeRules.showPrefix, [type]: !codeRules.showPrefix[type]}})}
                                                className={`w-10 h-5 rounded-full relative transition-colors ${codeRules.showPrefix[type] ? 'bg-success' : 'bg-silver'}`}
                                            >
                                                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${codeRules.showPrefix[type] ? 'left-[22px]' : 'left-0.5'}`} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-silver">
                                <div><label className="text-[10px] font-black text-dusty-blue uppercase mb-1.5 block text-center">Padding Length</label><input type="number" value={codeRules.padding} onChange={e=>setCodeRules({...codeRules, padding: Number(e.target.value)})} className="input-field font-black text-center" /></div>
                                <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-xl border border-dashed border-silver italic text-[9px] text-dusty-blue text-center font-bold tracking-widest leading-tight">Auto-Restart at 001<br/>per Unique Group</div>
                            </div>
                            <button onClick={() => setShowCodeConfig(false)} className="sys-btn-primary w-full py-2.5 flex items-center justify-center gap-2"><RefreshCw size={14} className="text-gold" /> APPLY RULES</button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Guide Drawer */}
            {isGuideOpen && (
                <div className="fixed inset-0 z-[500] flex justify-end animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-primary-dark/40 backdrop-blur-sm" onClick={() => setIsGuideOpen(false)} />
                    <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 border-l border-silver">
                        <div className="bg-primary-dark px-6 py-5 flex justify-between items-center text-white border-b-4 border-accent">
                            <div className="flex items-center gap-2"><HelpCircle size={18} className="text-accent" /><h3 className="text-[14px] font-black uppercase tracking-widest">Registry Guide</h3></div>
                            <button onClick={() => setIsGuideOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-all"><X size={18} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-primary-dark leading-relaxed text-[12px]">
                            <section>
                                <h4 className="font-black border-b border-silver pb-2 mb-3 flex items-center gap-2 uppercase text-[11px]"><Settings2 size={14} className="text-primary"/> 1. Item Groups</h4>
                                <ul className="list-disc pl-5 space-y-1 font-bold text-[10px] text-dusty-blue">
                                    <li><b>FG:</b> Finished Goods</li>
                                    <li><b>RM/FB/HW:</b> Raw Materials & Parts</li>
                                    <li><b>PK:</b> Packaging</li>
                                </ul>
                            </section>
                            <section>
                                <h4 className="font-black border-b border-silver pb-2 mb-3 flex items-center gap-2 uppercase text-[11px]"><Wand2 size={14} className="text-primary"/> 2. Name Mapping</h4>
                                <p className="mb-2 font-bold text-[10px] text-dusty-blue">Names auto-generate from category, model, and brand. Blank fields are skipped.</p>
                            </section>
                            <section>
                                <h4 className="font-black border-b border-silver pb-2 mb-3 flex items-center gap-2 uppercase text-[11px]"><Hash size={14} className="text-primary"/> 3. Code Rules</h4>
                                <p className="mb-2 font-bold text-[10px] text-dusty-blue">Format: <b>[Prefix]-[CatSub]-[Sequence]</b></p>
                            </section>
                        </div>
                        <div className="p-4 border-t border-silver bg-bg-main flex justify-end"><button onClick={() => setIsGuideOpen(false)} className="bg-primary-dark text-white px-6 py-2 rounded-lg font-black text-[10px] uppercase shadow-md hover:bg-primary transition-all">Close</button></div>
                    </div>
                </div>
            )}

            {/* IMPORT MODAL */}
            {showUploadModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-primary-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-4xl h-[70vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-silver animate-in zoom-in-95">
                        <div className="bg-bg-main px-6 py-4 flex justify-between items-center text-primary-dark shrink-0 border-b border-silver">
                            <div className="flex items-center gap-2"><UploadCloud size={18} className="text-primary" /><h3 className="text-[14px] font-black uppercase tracking-widest leading-none">BULK DATA IMPORT</h3></div>
                            <button onClick={() => {setShowUploadModal(false); setCsvPreview([]);}} className="p-1 hover:bg-white rounded-lg transition-all text-dusty-blue"><X size={20} /></button>
                        </div>
                        <div className="flex-1 flex overflow-hidden">
                            <div className="w-64 bg-slate-50/50 border-r border-silver p-6 flex flex-col gap-6 shrink-0">
                                <h4 className="font-black text-[10px] uppercase tracking-widest text-primary-dark border-b border-silver pb-2">Prep Guide</h4>
                                <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 leading-relaxed font-bold text-[11px] text-dusty-blue">
                                    <div className="flex gap-2"><div className="w-5 h-5 rounded-md bg-primary-dark text-white flex items-center justify-center font-black text-[9px] shrink-0">1</div><p>CSV files only <span className="text-danger font-black">.csv</span></p></div>
                                    <div className="flex gap-2"><div className="w-5 h-5 rounded-md bg-primary-dark text-white flex items-center justify-center font-black text-[9px] shrink-0">2</div><p>Headers:<br/><code className="bg-white border border-silver p-1 rounded font-mono text-[9px] uppercase text-primary mt-1 block">itemGroup, category, subCategory, model, brand, baseUnit, cost, price</code></p></div>
                                </div>
                                <div className="mt-auto pt-4 border-t border-silver"><button className="w-full flex items-center justify-center gap-2 bg-white border border-silver py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary-dark hover:bg-bg-main transition-all shadow-sm"><FileCheck size={14} className="text-success" /> TEMPLATE</button></div>
                            </div>
                            <div className="flex-1 flex flex-col p-6 bg-white overflow-hidden justify-center items-center">
                                {csvPreview.length === 0 ? (
                                    <div 
                                        onClick={handleFileSelect}
                                        className="w-full max-w-sm border-2 border-dashed border-silver p-10 rounded-3xl bg-bg-main/50 flex flex-col items-center gap-4 cursor-pointer hover:border-primary hover:bg-bg-main transition-all group"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-silver flex items-center justify-center text-dusty-blue group-hover:text-primary group-hover:scale-110 transition-all">
                                            <UploadCloud size={24}/>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[11px] font-black text-primary-dark uppercase tracking-widest">Select CSV file</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col animate-in fade-in duration-500 overflow-hidden text-primary-dark w-full">
                                        <div className="flex justify-between items-end mb-3"><div><h4 className="text-[10px] font-black uppercase tracking-widest">Import Preview ({csvPreview.length} items)</h4></div><button onClick={() => setCsvPreview([])} className="text-[9px] font-black text-danger hover:underline uppercase flex items-center gap-1 font-mono"><Trash2 size={16}/> CLEAR</button></div>
                                        <div className="flex-1 overflow-auto border border-silver rounded-xl bg-white custom-scrollbar shadow-sm text-[11px] font-bold">
                                            <table className="w-full text-left border-collapse whitespace-nowrap"><thead className="sticky top-0 z-10 bg-bg-main border-b border-silver font-black text-[9px] text-primary-dark uppercase tracking-widest"><th className="p-3">Group</th><th className="p-3">Category</th><th className="p-3">Sub-Cat</th><th className="p-3">Model</th><th className="p-3">Brand</th><th className="p-3">Unit</th><th className="p-3 text-right">Cost</th><th className="p-3 text-right">Price</th></thead>
                                            <tbody className="divide-y divide-silver">{csvPreview.map((row, idx) => (<tr key={idx} className="hover:bg-slate-50 transition-colors font-mono"><td className="p-3 font-black text-primary">{row.itemType}</td><td className="p-3 text-primary-dark">{row.category}</td><td className="p-3 text-primary-dark">{row.subCategory}</td><td className="p-3 font-mono text-dusty-blue">{row.model}</td><td className="p-3 text-accent">{row.brand}</td><td className="p-3 text-dusty-blue">{row.baseUnit}</td><td className="p-3 text-right">฿{row.cost.toLocaleString()}</td><td className="p-3 text-right">฿{row.price.toLocaleString()}</td></tr>))}</tbody></table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="p-4 bg-bg-main border-t border-silver flex justify-end shrink-0"><button disabled={csvPreview.length === 0} className="sys-btn-primary py-2 px-8 flex items-center gap-2 disabled:opacity-30 tracking-widest"><Zap size={14} className="text-gold" /> START IMPORT</button></div>
                    </div>
                </div>
            )}
        </div>
    );
}
