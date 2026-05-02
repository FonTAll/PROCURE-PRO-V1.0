import React, { useState, useMemo } from 'react';
import { 
    ShoppingCart, Plus, Search, ChevronDown, ListFilter, 
    FileText, CheckCircle2, Clock, AlertCircle, X, 
    Trash2, Pencil, Calendar, Eye, Kanban, List, Stamp
} from 'lucide-react';
import { KpiCard } from '../../components/shared/KpiCard';

const formatCurrency = (val: number) => {
    return '฿' + (Number(val) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export default function PurchaseRequisition() {
    const [activeTab, setActiveTab] = useState('kanban');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('2026-03'); 
    const [showModal, setShowModal] = useState(false);

    const [prs, setPrs] = useState<any[]>([
        { id: 'PR-2603-001', date: '2026-03-05', reqBy: 'สมชาย', dept: 'Production', total: 125000, status: 'Approved', items: 3 },
        { id: 'PR-2603-002', date: '2026-03-11', reqBy: 'วิภา', dept: 'Warehouse', total: 45000, status: 'Pending Approval', items: 1 },
        { id: 'PR-2603-003', date: '2026-03-12', reqBy: 'บ๊อบ', dept: 'IT', total: 8500, status: 'Draft', items: 2 },
        { id: 'PR-2603-004', date: '2026-03-14', reqBy: 'สมร', dept: 'HR', total: 12000, status: 'Rejected', items: 5 }
    ]);

    const filteredPrs = useMemo(() => {
        return prs.filter(p => {
            const matchSearch = p.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                p.reqBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                p.dept.toLowerCase().includes(searchQuery.toLowerCase());
            const matchDate = p.date.startsWith(selectedMonth);
            return matchSearch && matchDate;
        });
    }, [prs, searchQuery, selectedMonth]);

    const getBoardItems = (status: string) => filteredPrs.filter(p => p.status === status);

    const stats = {
        total: filteredPrs.length,
        pending: filteredPrs.filter(p=>p.status==='Pending Approval').length,
        approvedTotal: filteredPrs.filter(p=>p.status==='Approved').reduce((acc, curr) => acc + curr.total, 0),
        rate: filteredPrs.length > 0 ? Math.round((filteredPrs.filter(p=>p.status==='Approved').length / filteredPrs.length) * 100) : 0
    };

    return (
        <div className="flex flex-col h-full overflow-hidden relative">
            <header className="flex flex-wrap items-center justify-between px-6 py-4 gap-4 shrink-0 bg-transparent no-print">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm border border-silver">
                        <ShoppingCart size={24} className="text-primary-dark" strokeWidth={2.5} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 leading-none">
                            <h2 className="text-primary-dark font-black tracking-tight text-2xl uppercase">PURCHASE</h2>
                            <h2 className="text-accent font-black tracking-tight text-2xl uppercase">REQUISITION</h2>
                        </div>
                        <p className="text-dusty-blue text-[11px] font-bold mt-1 uppercase tracking-widest leading-none">Manage internal requests</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="flex items-center bg-white border border-silver rounded-lg overflow-hidden shadow-sm">
                        <div className="px-3 py-2 bg-slate-50 border-r border-silver text-dusty-blue"><Calendar size={14} /></div>
                        <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="px-3 py-1.5 text-[12px] font-bold text-primary-dark outline-none cursor-pointer" />
                    </div>

                    <div className="flex bg-white p-1 border border-silver shadow-sm rounded-lg">
                        <button onClick={() => setActiveTab('kanban')} className="px-6 py-2 font-bold transition-all flex items-center gap-2 uppercase tracking-widest rounded-md text-[11px] " style={activeTab === 'kanban' ? { backgroundColor: '#1f2a44', color: 'white' } : { color: '#7691ad' }}><Kanban size={14} /> BOARD</button>
                        <button onClick={() => setActiveTab('list')} className="px-6 py-2 font-bold transition-all flex items-center gap-2 uppercase tracking-widest rounded-md text-[11px] " style={activeTab === 'list' ? { backgroundColor: '#ce870a', color: 'white' } : { color: '#7691ad' }}><List size={14} /> LIST VIEW</button>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6 space-y-6 w-full relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-500">
                    <KpiCard label="Total Requests" value={stats.total} colorValue="#1f2a44" colorAccent="#5372ba" icon="file-text" desc="Current Month" />
                    <KpiCard label="Pending Approval" value={stats.pending} colorValue="#ce870a" colorAccent="#d1b028" icon="clock" desc="Needs Action" />
                    <KpiCard label="Approved Amount" value={formatCurrency(stats.approvedTotal)} colorValue="#596c33" colorAccent="#596c33" icon="dollar-sign" desc="Total Approved" />
                    <KpiCard label="Approval Rate" value={`${stats.rate}%`} colorValue="#1f2a44" colorAccent="#7691ad" icon="activity" desc="Efficiency" />
                </div>

                {activeTab === 'kanban' && (
                    <div className="animate-in fade-in duration-500 w-full overflow-x-auto pb-4 custom-scrollbar">
                        <div className="flex gap-6 min-w-max h-[620px] items-start">
                            {/* Draft */}
                            <div className="w-[300px] flex flex-col h-[620px] bg-slate-50 rounded-2xl border border-silver shadow-sm overflow-hidden">
                                <div className="flex justify-between items-center px-4 py-3 bg-slate-200 border-b border-silver shadow-sm z-10"><h4 className="font-black text-primary-dark text-[11px] tracking-widest uppercase">Draft</h4><span className="bg-white text-primary-dark text-[11px] px-2 py-0.5 rounded font-black">{getBoardItems('Draft').length}</span></div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                                    {getBoardItems('Draft').map(pr => (
                                        <div key={pr.id} className="bg-white p-2.5 rounded-xl shadow-sm border border-silver hover:shadow-md transition-all cursor-pointer flex flex-col gap-1.5 relative group" onClick={() => setShowModal(true)}>
                                            <div className="flex justify-between items-center"><span className="font-bold text-[11px] text-primary-dark bg-slate-100 px-2 py-1 rounded">{pr.id}</span></div>
                                            <div className="font-bold text-xs text-primary-dark truncate uppercase mt-1">{pr.dept}</div>
                                            <div className="text-[11px] text-dusty-blue font-medium">Req: {pr.reqBy}</div>
                                            <div className="border-t border-silver pt-2 mt-1 flex justify-between items-center"><span className="bg-slate-100 text-dusty-blue text-[11px] px-2 py-1 rounded font-black uppercase">{pr.items} Items</span><span className="text-[11px] font-black font-mono text-danger">{formatCurrency(pr.total)}</span></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pending */}
                            <div className="w-[300px] flex flex-col h-[620px] bg-slate-50 rounded-2xl border border-silver shadow-sm overflow-hidden">
                                <div className="flex justify-between items-center px-4 py-3 bg-accent/20 border-b border-accent/40 shadow-sm z-10"><h4 className="font-black text-primary-dark text-[11px] tracking-widest uppercase">Pending Approval</h4><span className="bg-white text-primary-dark text-[11px] px-2 py-0.5 rounded font-black">{getBoardItems('Pending Approval').length}</span></div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                                    {getBoardItems('Pending Approval').map(pr => (
                                        <div key={pr.id} className="bg-white p-2.5 rounded-xl shadow-sm border border-silver hover:shadow-md hover:border-accent transition-all cursor-pointer flex flex-col gap-1.5 relative group" onClick={() => setShowModal(true)}>
                                            <div className="flex justify-between items-center"><span className="font-bold text-[11px] text-primary-dark bg-slate-100 px-2 py-1 rounded">{pr.id}</span></div>
                                            <div className="font-bold text-xs text-primary-dark truncate uppercase mt-1">{pr.dept}</div>
                                            <div className="text-[11px] text-dusty-blue font-medium">Req: {pr.reqBy}</div>
                                            <div className="border-t border-silver pt-2 mt-1 flex justify-between items-center"><span className="bg-accent/10 text-accent text-[11px] px-2 py-1 rounded font-black uppercase"><Clock size={10} className="inline mr-1"/> Approve</span><span className="text-[11px] font-black font-mono text-danger">{formatCurrency(pr.total)}</span></div>
                                            <button className="w-full bg-accent hover:opacity-90 transition-opacity mt-2 text-white font-black text-[11px] py-2 rounded-lg uppercase tracking-widest">Verify & Approve</button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Approved */}
                            <div className="w-[300px] flex flex-col h-[620px] bg-slate-50 rounded-2xl border border-silver shadow-sm overflow-hidden">
                                <div className="flex justify-between items-center px-4 py-3 bg-success/20 border-b border-success/40 shadow-sm z-10"><h4 className="font-black text-primary-dark text-[11px] tracking-widest uppercase">Approved</h4><span className="bg-white text-primary-dark text-[11px] px-2 py-0.5 rounded font-black">{getBoardItems('Approved').length}</span></div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                                    {getBoardItems('Approved').map(pr => (
                                        <div key={pr.id} className="bg-white p-2.5 rounded-xl shadow-sm border border-silver hover:shadow-md hover:border-success transition-all cursor-pointer flex flex-col gap-1.5 relative group" onClick={() => setShowModal(true)}>
                                            <div className="flex justify-between items-center"><span className="font-bold text-[11px] text-primary-dark bg-slate-100 px-2 py-1 rounded">{pr.id}</span></div>
                                            <div className="font-bold text-xs text-primary-dark truncate uppercase mt-1">{pr.dept}</div>
                                            <div className="text-[11px] text-dusty-blue font-medium">Req: {pr.reqBy}</div>
                                            <div className="border-t border-silver pt-2 mt-1 flex justify-between items-center"><span className="bg-success/10 text-success text-[11px] px-2 py-1 rounded font-black uppercase"><CheckCircle2 size={10} className="inline mr-1"/> Success</span><span className="text-[11px] font-black font-mono text-danger">{formatCurrency(pr.total)}</span></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Rejected */}
                            <div className="w-[300px] flex flex-col h-[620px] bg-slate-50 rounded-2xl border border-silver shadow-sm overflow-hidden">
                                <div className="flex justify-between items-center px-4 py-3 bg-danger/20 border-b border-danger/40 shadow-sm z-10"><h4 className="font-black text-primary-dark text-[11px] tracking-widest uppercase">Rejected</h4><span className="bg-white text-primary-dark text-[11px] px-2 py-0.5 rounded font-black">{getBoardItems('Rejected').length}</span></div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                                    {getBoardItems('Rejected').map(pr => (
                                        <div key={pr.id} className="bg-white p-2.5 rounded-xl shadow-sm border border-silver hover:shadow-md hover:border-danger transition-all cursor-pointer flex flex-col gap-1.5 relative group" onClick={() => setShowModal(true)}>
                                            <div className="flex justify-between items-center"><span className="font-bold text-[11px] text-primary-dark bg-slate-100 px-2 py-1 rounded">{pr.id}</span></div>
                                            <div className="font-bold text-xs text-primary-dark truncate uppercase mt-1">{pr.dept}</div>
                                            <div className="text-[11px] text-dusty-blue font-medium">Req: {pr.reqBy}</div>
                                            <div className="border-t border-silver pt-2 mt-1 flex justify-between items-center"><span className="bg-danger/10 text-danger text-[11px] px-2 py-1 rounded font-black uppercase"><AlertCircle size={10} className="inline mr-1"/> Rejected</span></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'list' && (
                    <div className="sys-card-base p-0 overflow-hidden min-h-[500px]">
                        <div className="px-6 py-4 border-b border-silver flex flex-col lg:flex-row items-center justify-between gap-4 bg-white">
                            <div className="relative w-full md:w-80">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dusty-blue" />
                                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search PR Number, Dept..." className="sys-input w-full pl-9 h-9" />
                            </div>
                            <button onClick={() => setShowModal(true)} className="sys-btn-primary h-9"><Plus size={14} className="text-gold" strokeWidth={3} /> CREATE NEW PR</button>
                        </div>
                        <div className="overflow-x-auto w-full custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="sys-table-header"><tr><th>PR Number</th><th>Date</th><th>Requested By</th><th>Department</th><th className="text-center">Items</th><th className="text-right">Est. Total</th><th className="text-center">Status</th><th className="text-center w-24">Action</th></tr></thead>
                                <tbody className="divide-y divide-silver/50">
                                    {filteredPrs.map((pr, i) => (
                                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                                            <td className="sys-table-td font-black">{pr.id}</td>
                                            <td className="sys-table-td text-dusty-blue">{pr.date}</td>
                                            <td className="sys-table-td font-bold">{pr.reqBy}</td>
                                            <td className="sys-table-td text-dusty-blue uppercase text-[11px] font-black">{pr.dept}</td>
                                            <td className="sys-table-td text-center font-bold text-dusty-blue">{pr.items}</td>
                                            <td className="sys-table-td text-right font-black font-mono text-danger">{formatCurrency(pr.total)}</td>
                                            <td className="sys-table-td text-center">
                                                <span className={`px-2 py-1 rounded-md border font-black text-[11px] uppercase tracking-widest ${
                                                    pr.status === 'Approved' ? 'bg-success/10 text-success border-success/30' :
                                                    pr.status === 'Pending Approval' ? 'bg-accent/10 text-accent border-accent/30' :
                                                    pr.status === 'Draft' ? 'bg-slate-100 text-dusty-blue border-silver' :
                                                    'bg-danger/10 text-danger border-danger/30'
                                                }`}>
                                                    {pr.status}
                                                </span>
                                            </td>
                                            <td className="sys-table-td text-center">
                                                <div className="flex justify-center items-center gap-[0.5px]">
                                                    <button onClick={() => setShowModal(true)} className="w-8 h-8 flex items-center justify-center text-primary hover:bg-primary/10 rounded transition-colors"><Eye size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="sys-pagination-container">
                            <p className="sys-pagination-text">Showing 1 to {filteredPrs.length} of {prs.length}</p>
                        </div>
                    </div>
                )}
            </main>

            {/* CREATE MODAL (Simplistic placeholder) */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary-dark/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col animate-in zoom-in duration-300 border border-silver">
                        <div className="bg-primary-dark border-b-2 border-accent px-6 py-4 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">NEW PURCHASE REQUISITION</h3>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-white/10 rounded-full transition-all text-white"><X size={20} /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-bg-main space-y-6 custom-scrollbar">
                            <div className="sys-card-base">
                                <h4 className="sys-stack-main mb-4 border-b border-silver pb-2">General Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div><label className="sys-label-tiny">Requested By</label><input type="text" className="sys-input w-full mt-1" defaultValue="Current User" disabled /></div>
                                    <div><label className="sys-label-tiny">Department</label><select className="sys-input w-full mt-1"><option>Production</option><option>IT</option><option>HR</option></select></div>
                                    <div><label className="sys-label-tiny">Expected Date</label><input type="date" className="sys-input w-full mt-1" /></div>
                                </div>
                            </div>

                            <div className="sys-card-base p-0 overflow-hidden mt-6">
                                <div className="bg-white px-4 py-4 border-b border-silver flex justify-between items-center">
                                    <h4 className="sys-stack-main">Line Items</h4>
                                    <button className="sys-btn-secondary py-1.5 px-4"><Plus size={12} /> ADD ITEM</button>
                                </div>
                                <div className="p-12 flex justify-center items-center bg-slate-50 border-1 border-dashed border-silver m-4 rounded-xl text-dusty-blue font-bold text-[11px] uppercase tracking-widest">
                                    Click "Add Item" to select from Item Master
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-white border-t border-silver flex justify-end items-center gap-3 shrink-0">
                            <button onClick={() => setShowModal(false)} className="sys-btn-secondary border-transparent">Cancel</button>
                            <button className="sys-btn-primary">SAVE DRAFT</button>
                            <button className="sys-btn-primary !bg-gradient-to-r !from-success !to-[#44522a]">SUBMIT REQUISITION</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
