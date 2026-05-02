import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldAlert, Search, Plus, Printer, Calendar, X, 
  LayoutDashboard, Eye, User, History, HelpCircle,
  Kanban, List, TrendingUp, FileWarning, CheckCircle2, 
  Building2, ClipboardCheck, Trash2, Pencil, Save, 
  Clock, Briefcase, PieChart, BarChart2, Send, QrCode, 
  Info, Lock, ArrowUpRight, ChevronUp, ChevronLeft, ChevronRight, 
  Activity, MessageSquare, ArrowRight, AlertTriangle
} from 'lucide-react';

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const getSeverityClass = (severity: string) => {
  switch(severity) {
    case 'Critical': return 'bg-danger text-white border-none shadow-sm'; 
    case 'Major': return 'bg-accent text-white border-none shadow-sm'; 
    case 'Minor': return 'bg-sky-blue text-white border-none shadow-sm'; 
    default: return 'bg-slate-100 text-slate-500';
  }
};

const getStatusClass = (status: string) => {
  switch(status) {
    case 'Closed': return 'bg-success/10 text-success border-success/30';
    case 'Submitted': return 'bg-danger/10 text-danger border-danger/30';
    case 'Vendor Responded': return 'bg-accent/10 text-accent border-accent/30';
    case 'Follow up': return 'bg-sky-blue/10 text-sky-blue border-sky-blue/30';
    default: return 'bg-slate-50 text-slate-600 border-slate-200';
  }
};

export default function PurchaseNC() {
  const [activeTab, setActiveTab] = useState('kanban'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('2026-03'); 
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); 
  const [modalTab, setModalTab] = useState('general');
  const [previewModal, setPreviewModal] = useState<string|null>(null);

  const [scarData, setScarData] = useState<any[]>([
    { id: 'SCAR-2603-001', date: '2026-03-01', vendor: 'Thai Steel Co., Ltd.', email: 'contact@thaisteel.example.com', item: 'เหล็กกล่อง 1x1', problem: 'เหล็กเป็นสนิมเกินเกณฑ์มาตรฐาน', severity: 'Major', status: 'Submitted', requester: 'สมชาย', vendorResponse: { rootCause: '', corrective: '', preventive: '', responder: '', date: '' }, followUp: { status: 'Waiting', results: '', checker: '', date: '' } },
    { id: 'SCAR-2603-002', date: '2026-03-02', vendor: 'Wood Intertrade', email: 'sales@woodinter.example.com', item: 'ไม้อัด 15mm', problem: 'ความหนาไม่ได้มาตรฐาน', severity: 'Critical', status: 'Vendor Responded', requester: 'วิภา', vendorResponse: { rootCause: 'เครื่องจักรคลาดเคลื่อน', corrective: 'ส่งของใหม่แทน', preventive: 'Calibrate เครื่องจักร', responder: 'คุณมานพ', date: '2026-03-03' }, followUp: { status: 'In Progress', results: 'รอตรวจสอบล็อตใหม่', checker: 'พีระ (PC)', date: '' } },
    { id: 'SCAR-2603-003', date: '2026-03-05', vendor: 'Pack & Go Supply', email: 'support@packandgo.com', item: 'กล่องกระดาษ', problem: 'ส่งของไม่ครบ', severity: 'Minor', status: 'Closed', requester: 'นพดล', vendorResponse: { rootCause: 'นับจำนวนผิด', corrective: 'ส่งเพิ่มทันที', preventive: 'Double Check', responder: 'คุณอารีย์', date: '2026-03-06' }, followUp: { status: 'Success', results: 'ได้รับของครบแล้ว', checker: 'PC Team', date: '2026-03-08' } },
  ]);

  const [formData, setFormData] = useState<any>({ 
    id: '', date: '', vendor: '', email: '', item: '', problem: '', severity: 'Minor', status: 'Submitted',
    vendorResponse: { rootCause: '', corrective: '', preventive: '', responder: '', date: '' },
    followUp: { status: 'Waiting', results: '', checker: '', date: '' }
  });

  const monthFilteredData = useMemo(() => scarData.filter(item => item.date.startsWith(selectedMonth)), [scarData, selectedMonth]);
  const logTableData = useMemo(() => monthFilteredData.filter(item => (item.id.toLowerCase().includes(searchQuery.toLowerCase()) || item.vendor.toLowerCase().includes(searchQuery.toLowerCase())) && (filterStatus === 'all' ? true : item.status === filterStatus)), [monthFilteredData, searchQuery, filterStatus]);

  const stats = useMemo(() => ({
    total: monthFilteredData.length,
    pending: monthFilteredData.filter(p => p.status === 'Submitted').length,
    followup: monthFilteredData.filter(p => ['Vendor Responded', 'Follow up'].includes(p.status)).length,
    closed: monthFilteredData.filter(p => p.status === 'Closed').length,
    critical: monthFilteredData.filter(d=>d.severity==='Critical').length,
    major: monthFilteredData.filter(d=>d.severity==='Major').length,
    minor: monthFilteredData.filter(d=>d.severity==='Minor').length,
  }), [monthFilteredData]);

  const openModal = (mode: string, data: any = null) => {
    setModalMode(mode);
    setModalTab(mode === 'vendor' ? 'response' : 'general');
    if (mode === 'create') {
      const newCount = scarData.filter(d => d.date.startsWith(selectedMonth)).length + 1;
      setFormData({ 
        id: `SCAR-${selectedMonth.slice(-2)}${selectedMonth.split('-')[1]}-${String(newCount).padStart(3, '0')}`, 
        date: new Date().toISOString().split('T')[0], vendor: '', email: '', item: '', problem: '', severity: 'Minor', status: 'Submitted',
        vendorResponse: { rootCause: '', corrective: '', preventive: '', responder: '', date: '' },
        followUp: { status: 'Waiting', results: '', checker: '', date: '' }
      });
    } else {
      setFormData({ ...data, email: data.email || '' });
    }
    setModalOpen(true);
  };

  const handleSaveSCAR = () => {
    if(modalMode !== 'vendor' && (!formData.vendor || !formData.problem)) return alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    let finalData = { ...formData };
    if (modalMode === 'vendor') {
      finalData.status = 'Vendor Responded';
      finalData.vendorResponse.date = new Date().toISOString().split('T')[0];
    }
    if(modalMode === 'create') setScarData([finalData, ...scarData]);
    else setScarData(scarData.map(d => d.id === finalData.id ? finalData : d));
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-bg-main overflow-hidden w-full relative">
      <header className="flex flex-wrap items-center justify-between px-6 py-4 gap-4 shrink-0 bg-transparent no-print">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm border border-silver">
                <ShieldAlert size={24} className="text-danger" strokeWidth={2.5} />
            </div>
            <div>
                <div className="flex items-center gap-2 leading-none">
                    <h2 className="text-primary-dark font-black tracking-tight text-2xl uppercase">PURCHASE</h2>
                    <h2 className="text-danger font-black tracking-tight text-2xl uppercase">NC (SCAR)</h2>
                </div>
                <p className="text-dusty-blue text-[11px] font-bold mt-1 uppercase tracking-widest leading-none">Supplier Corrective Action Request</p>
            </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center bg-white border border-silver rounded-lg overflow-hidden shadow-sm">
            <div className="px-3 py-2 bg-slate-50 border-r border-silver text-dusty-blue"><Calendar size={14} /></div>
            <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="px-3 py-1.5 text-[12px] font-bold text-primary-dark outline-none cursor-pointer" />
          </div>

          <div className="flex bg-white p-1 border border-silver shadow-sm rounded-lg">
            <button onClick={() => setActiveTab('kanban')} className="px-6 py-2 font-bold transition-all flex items-center gap-2 uppercase tracking-widest rounded-md text-[11px] " style={activeTab === 'kanban' ? { backgroundColor: '#1f2a44', color: 'white' } : { color: '#7691ad' }}><Kanban size={14} /> BOARD</button>
            <button onClick={() => setActiveTab('log')} className="px-6 py-2 font-bold transition-all flex items-center gap-2 uppercase tracking-widest rounded-md text-[11px] " style={activeTab === 'log' ? { backgroundColor: '#ce870a', color: 'white' } : { color: '#7691ad' }}><List size={14} /> LOG SHEET</button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6 space-y-6 w-full relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in duration-500 no-print">
            <div className="sys-glass-card flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4"><p className="sys-kpi-label">Total SCARs</p><Activity size={16} className="text-primary-dark"/></div>
              <h3 className="sys-kpi-value text-primary-dark">{stats.total}</h3>
            </div>
            <div className="sys-glass-card flex flex-col justify-between border-l-4 border-l-danger">
              <div className="flex justify-between items-start mb-4"><p className="sys-kpi-label">Submitted</p><FileWarning size={16} className="text-danger"/></div>
              <h3 className="sys-kpi-value text-danger">{stats.pending}</h3>
            </div>
            <div className="sys-glass-card flex flex-col justify-between border-l-4 border-l-sky-blue">
              <div className="flex justify-between items-start mb-4"><p className="sys-kpi-label">Follow Up</p><MessageSquare size={16} className="text-sky-blue"/></div>
              <h3 className="sys-kpi-value text-sky-blue">{stats.followup}</h3>
            </div>
            <div className="sys-glass-card flex flex-col justify-between border-l-4 border-l-success">
              <div className="flex justify-between items-start mb-4"><p className="sys-kpi-label">Closed</p><CheckCircle2 size={16} className="text-success"/></div>
              <h3 className="sys-kpi-value text-success">{stats.closed}</h3>
            </div>
          </div>

          {activeTab === 'kanban' && (
            <div className="animate-in fade-in duration-500 w-full overflow-x-auto pb-4 custom-scrollbar no-print">
               <div className="flex gap-6 min-w-max h-[620px] items-start">
                 {['Submitted', 'Vendor Responded', 'Follow up', 'Closed'].map(status => {
                   const allColItems = monthFilteredData.filter(d=>d.status===status);
                   return (
                   <div key={status} className="w-[300px] flex flex-col h-[620px] bg-slate-50 rounded-2xl border border-silver shadow-sm overflow-hidden">
                      <div className={`flex justify-between items-center px-4 py-3 border-b border-silver/50 ${status==='Submitted'?'bg-danger/10':status==='Closed'?'bg-success/10':'bg-accent/10'}`}><h4 className="font-black text-primary-dark text-[11px] tracking-widest uppercase">{status}</h4><span className="bg-white text-primary-dark text-[11px] px-2 py-0.5 rounded font-black shadow-sm">{allColItems.length}</span></div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                         {allColItems.map((item, index) => (
                           <div key={item.id} className="bg-white p-2.5 rounded-xl shadow-sm border border-silver hover:shadow-md hover:border-primary transition-all cursor-pointer group flex flex-col gap-1.5" onClick={() => openModal('view', item)}>
                              <div className="flex justify-between items-start mb-1"><span className="font-black text-[11px] text-danger bg-danger/10 px-2 py-1 rounded">{item.id}</span></div>
                              <div className="text-xs font-bold text-primary-dark mb-0.5 uppercase truncate">{item.vendor}</div>
                              <div className="text-[11px] text-dusty-blue line-clamp-2 italic font-medium">"{item.problem}"</div>
                              <div className="border-t border-silver pt-2 mt-1 flex justify-between items-center"><span className={`text-[11px] font-black uppercase px-2 py-1 rounded ${getSeverityClass(item.severity)}`}>{item.severity}</span><ArrowRight size={12} className="text-silver group-hover:text-primary-dark" /></div>
                              {status === 'Submitted' && (
                                <div className="flex gap-1 mt-2 pt-2 border-t border-silver">
                                   <button onClick={(e) => { e.stopPropagation(); openModal('vendor', item); }} className="flex-1 bg-accent/10 text-accent text-[11px] font-black py-2 rounded-lg uppercase tracking-widest flex items-center justify-center gap-1 transition-colors"><QrCode size={12}/> Vendor Fill</button>
                                </div>
                              )}
                           </div>
                         ))}
                      </div>
                   </div>
                 )})}
               </div>
            </div>
          )}

          {activeTab === 'log' && (
            <div className="sys-card-base p-0 overflow-hidden no-print flex flex-col h-full min-h-[500px]">
              <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-white border-b border-silver gap-4">
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  {['all', 'Submitted', 'Vendor Responded', 'Follow up', 'Closed'].map(f => (
                    <button key={f} onClick={() => setFilterStatus(f)} className={`px-4 py-2 whitespace-nowrap text-[11px] font-black uppercase rounded-md transition-all ${filterStatus === f ? 'bg-primary-dark text-white shadow-sm' : 'text-dusty-blue hover:text-primary-dark'}`}>{f}</button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                   <div className="relative w-full md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dusty-blue" size={14} />
                      <input type="text" placeholder="Search SCAR NO..." className="sys-input w-full pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                   </div>
                   <button onClick={() => openModal('create')} className="sys-btn-primary"><Plus size={14} className="text-gold" /> ISSUE SCAR</button>
                </div>
              </div>

              <div className="overflow-x-auto w-full custom-scrollbar">
                 <table className="w-full text-left border-collapse">
                    <thead className="sys-table-header">
                      <tr><th>SCAR NO.</th><th>Date</th><th>Vendor</th><th className="text-center">Severity</th><th className="text-center">Status</th><th className="text-center">Action</th></tr>
                    </thead>
                    <tbody className="divide-y divide-silver/50">
                      {logTableData.map(scar => (
                        <tr key={scar.id} className="hover:bg-slate-50 transition-colors">
                          <td className="sys-table-td font-black text-danger">{scar.id}</td>
                          <td className="sys-table-td text-dusty-blue font-mono">{formatDate(scar.date)}</td>
                          <td className="sys-table-td font-bold text-primary-dark uppercase">{scar.vendor}</td>
                          <td className="sys-table-td text-center"><span className={`px-2 py-1 rounded text-[11px] font-black uppercase ${getSeverityClass(scar.severity)}`}>{scar.severity}</span></td>
                          <td className="sys-table-td text-center"><span className={`px-2 py-1 rounded-md border font-black text-[11px] uppercase tracking-widest ${getStatusClass(scar.status)}`}>{scar.status}</span></td>
                          <td className="sys-table-td text-center border-l-0">
                              <div className="flex justify-center gap-[0.5px]">
                                <button onClick={()=>openModal('view', scar)} className="w-8 h-8 flex items-center justify-center text-primary hover:bg-primary/10 rounded transition-colors" title="View"><Eye size={16}/></button>
                                <button onClick={()=>openModal('edit', scar)} className="w-8 h-8 flex items-center justify-center text-accent hover:bg-accent/10 rounded transition-colors" title="Edit"><Pencil size={16}/></button>
                              </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
              </div>
            </div>
          )}
      </main>

      {/* ACTION MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-primary-dark/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-[24px] w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 flex justify-between items-center bg-primary-dark text-white border-b-2 border-danger shrink-0">
                <div className="flex items-center gap-3">
                   <h2 className="text-sm font-black uppercase tracking-widest">{modalMode === 'vendor' ? 'Vendor Response Form' : 'SCAR Analysis & Management'}</h2>
                </div>
                <button onClick={()=>setModalOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors"><X size={20}/></button>
              </div>
              <div className="flex bg-slate-50 border-b border-silver overflow-x-auto no-scrollbar shrink-0 custom-scrollbar">
                 {[ { id: 'general', label: '1. Problem Details', icon: AlertTriangle }, { id: 'response', label: '2. Vendor Response', icon: MessageSquare }, { id: 'followup', label: '3. Follow Up (PC/QA)', icon: ClipboardCheck } ].map(tab => {
                   const isActive = modalTab === tab.id;
                   const tabStyle = isActive ? 'bg-white text-primary-dark border-b-2 border-b-accent' : 'text-dusty-blue hover:bg-slate-100 border-b-2 border-b-transparent';
                   return <button key={tab.id} onClick={() => setModalTab(tab.id)} className={`px-8 py-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all ${tabStyle}`}><tab.icon size={16} /> {tab.label}</button>;
                 })}
              </div>
              <div className="flex-1 overflow-y-auto p-6 bg-bg-main custom-scrollbar">
                <div className="sys-card-base">
                  {modalTab === 'general' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div><label className="sys-label-tiny">Vendor</label><input disabled={modalMode==='view'||modalMode==='vendor'} value={formData.vendor} onChange={e=>setFormData({...formData, vendor: e.target.value})} className="sys-input w-full mt-1 font-bold" /></div>
                       <div><label className="sys-label-tiny">Email</label><input disabled={modalMode==='view'||modalMode==='vendor'} type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="sys-input w-full mt-1 font-mono" /></div>
                       <div><label className="sys-label-tiny">Item</label><input disabled={modalMode==='view'||modalMode==='vendor'} value={formData.item} onChange={e=>setFormData({...formData, item: e.target.value})} className="sys-input w-full mt-1" /></div>
                       <div><label className="sys-label-tiny">Severity</label><select disabled={modalMode==='view'||modalMode==='vendor'} value={formData.severity} onChange={e=>setFormData({...formData, severity: e.target.value})} className="sys-input w-full mt-1 font-bold"><option>Minor</option><option>Major</option><option>Critical</option></select></div>
                       <div className="col-span-2"><label className="sys-label-tiny">Problem Description</label><textarea disabled={modalMode==='view'||modalMode==='vendor'} rows={4} value={formData.problem} onChange={e=>setFormData({...formData, problem: e.target.value})} className="sys-input w-full mt-1 resize-none" /></div>
                     </div>
                  )}
                  {modalTab === 'response' && (
                     <div className="space-y-4">
                        <div className="bg-accent/10 p-4 rounded-xl border border-accent/20 text-accent flex items-center gap-3"><MessageSquare size={16}/><p className="text-[11px] font-black uppercase tracking-widest">Supplier Corrective Actions</p></div>
                        <div><label className="sys-label-tiny">Root Cause</label><textarea disabled={modalMode==='view'} value={formData.vendorResponse?.rootCause} onChange={e=>setFormData({...formData, vendorResponse: {...formData.vendorResponse, rootCause: e.target.value}})} rows={3} className="sys-input w-full mt-1" /></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div><label className="sys-label-tiny">Corrective Action</label><textarea disabled={modalMode==='view'} value={formData.vendorResponse?.corrective} onChange={e=>setFormData({...formData, vendorResponse: {...formData.vendorResponse, corrective: e.target.value}})} rows={3} className="sys-input w-full mt-1" /></div>
                           <div><label className="sys-label-tiny">Preventive Action</label><textarea disabled={modalMode==='view'} value={formData.vendorResponse?.preventive} onChange={e=>setFormData({...formData, vendorResponse: {...formData.vendorResponse, preventive: e.target.value}})} rows={3} className="sys-input w-full mt-1" /></div>
                        </div>
                     </div>
                  )}
                  {modalTab === 'followup' && (
                     <div className="space-y-4">
                        <div className="bg-sky-blue/10 p-4 rounded-xl border border-sky-blue/20 text-sky-blue flex items-center gap-3"><ClipboardCheck size={16}/><p className="text-[11px] font-black uppercase tracking-widest">Internal Follow Up (PC/QA)</p></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div><label className="sys-label-tiny">Follow Up Status</label><select disabled={modalMode==='view'||modalMode==='vendor'} value={formData.followUp?.status} onChange={e=>setFormData({...formData, followUp: {...formData.followUp, status: e.target.value}})} className="sys-input w-full mt-1 font-bold"><option>Waiting</option><option>In Progress</option><option>Success</option><option>Failed</option></select></div>
                           <div><label className="sys-label-tiny">Checked By</label><input disabled={modalMode==='view'||modalMode==='vendor'} value={formData.followUp?.checker} onChange={e=>setFormData({...formData, followUp: {...formData.followUp, checker: e.target.value}})} className="sys-input w-full mt-1" /></div>
                        </div>
                        <div><label className="sys-label-tiny">Monitoring Results</label><textarea disabled={modalMode==='view'||modalMode==='vendor'} value={formData.followUp?.results} onChange={e=>setFormData({...formData, followUp: {...formData.followUp, results: e.target.value}})} rows={4} className="sys-input w-full mt-1" /></div>
                     </div>
                  )}
                </div>
              </div>
              <div className="p-4 bg-white border-t border-silver flex justify-end gap-3 shrink-0">
                  <button onClick={()=>setModalOpen(false)} className="sys-btn-secondary border-transparent">Close</button>
                  {modalMode === 'vendor' ? (
                     <button onClick={handleSaveSCAR} className="sys-btn-primary !bg-gradient-to-r !from-accent !to-[#8e5c06]">Submit Form</button>
                  ) : (
                    modalMode !== 'view' && <button onClick={handleSaveSCAR} className="sys-btn-primary">Save SCAR</button>
                  )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
