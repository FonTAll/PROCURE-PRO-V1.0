import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, Search, Plus, Printer, Calendar, X, ShoppingBag,
  Kanban, List, Truck, Coins, FileClock, CheckSquare, Send,
  Building2, CreditCard, MapPin, Eye, Pencil, Save, FileSignature, HelpCircle, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Stamp, CheckCircle, Clock, User, Info, PlusCircle, Trash2, FileCheck
} from 'lucide-react';

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatCurrency = (val: number) => {
  return '฿' + (Number(val) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const getStatusBadgeClass = (status: string) => {
  switch(status) {
    case 'Pending Verify': return 'bg-amber-50 text-amber-600 border-amber-200';
    case 'Revise': return 'bg-rose-50 text-rose-600 border-rose-200';
    case 'Pending Approve': return 'bg-[#5372ba]/10 text-primary border-primary/30';
    case 'Approved': return 'bg-[#596c33]/10 text-success border-success/30';
    case 'Sent': return 'bg-[#ce870a]/10 text-accent border-accent/30';
    case 'Completed': return 'bg-[#596c33]/10 text-success border-success/30';
    case 'Rejected': return 'bg-rose-50 text-rose-600 border-rose-200';
    default: return 'bg-slate-50 text-slate-600 border-slate-200';
  }
};

export default function PurchaseOrder() {
  const [activeTab, setActiveTab] = useState('kanban'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('this_month'); 
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('2026-03'); 

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); 
  const [activeFormTab, setActiveFormTab] = useState('general'); 
  const [previewModal, setPreviewModal] = useState<string | null>(null); 
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const [kanbanLimits, setKanbanLimits] = useState<any>({
    pendingPR: 5, 'Pending Approve': 5, 'Approved': 5, 'Sent': 5
  });

  const [pendingPRs, setPendingPRs] = useState<any[]>([]);
  const [poList, setPoList] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  const [poForm, setPoForm] = useState<any>({
    id: '', poNumber: '', date: '', vendor: '', vendorAddress: '', prRef: '', 
    paymentTerm: 'Credit 30 Days', deliveryDate: '', remarks: '', status: 'Pending Approve', 
    subTotal: 0, vat: 0, grandTotal: 0, items: [], history: []
  });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockPRs = [
         { id: 'PR-2603-001', date: '2026-03-05', requester: 'สมชาย ใจดี', department: 'Production', totalAmount: 15000, items: [{code: 'RM-001', name: 'Digital Thermometer', qty: 2, price: 7500}] },
         { id: 'PR-2603-002', date: '2026-03-10', requester: 'วิภา', department: 'Warehouse', totalAmount: 9000, items: [{code: 'PT-WHL-001', name: 'ล้อเลื่อนยูรีเทน 2 นิ้ว', qty: 200, price: 45}] },
      ];

      const mockPOs = [
        { id: 1, poNumber: 'PO-2603-001', date: '2026-03-01', vendor: 'บริษัท ไทยสตีล จำกัด', vendorAddress: '123 ถนนบางนาตราด กทม.', prRef: 'PR-2602-050', grandTotal: 8025, subTotal: 7500, vat: 525, status: 'Sent', items: [{code: 'RM-MT-001', name: 'ท่อสแตนเลส 304 (1 นิ้ว)', qty: 50, price: 150}], paymentTerm: 'Credit 30 Days', deliveryDate: '2026-03-25', remarks: 'ด่วน', history: [] },
        { id: 2, poNumber: 'PO-2603-002', date: '2026-03-05', vendor: 'ร้านน็อตแอนด์โบลต์', vendorAddress: '456 พระราม 2', prRef: 'PR-2603-003', grandTotal: 535, subTotal: 500, vat: 35, status: 'Completed', items: [{code: 'PT-SCR-001', name: 'สกรูเกลียวปล่อย #8', qty: 1000, price: 0.5}], paymentTerm: 'Cash', deliveryDate: '2026-03-10', remarks: '-', history: [] },
      ];

      setPendingPRs(mockPRs);
      setPoList(mockPOs);
      setLoading(false);
    }, 500);
  }, []);

  const [pendingItemsPerPage, setPendingItemsPerPage] = useState(10);
  const [poItemsPerPage, setPoItemsPerPage] = useState(10);

  const filteredPendingPRs = useMemo(() => {
    return pendingPRs.filter(p => {
      const matchSearch = p.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.requester.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDate = dateFilter === 'all' ? true : p.date.startsWith(selectedMonth);
      return matchSearch && matchDate;
    });
  }, [pendingPRs, searchQuery, dateFilter, selectedMonth]);

  const [pendingCurrentPage, setPendingCurrentPage] = useState(1);
  const paginatedPendingPRs = useMemo(() => {
    const start = (pendingCurrentPage - 1) * pendingItemsPerPage;
    return filteredPendingPRs.slice(start, start + pendingItemsPerPage);
  }, [filteredPendingPRs, pendingCurrentPage, pendingItemsPerPage]);

  const pendingTotalPages = Math.ceil(filteredPendingPRs.length / pendingItemsPerPage) || 1;

  const filteredPOList = useMemo(() => {
    return poList.filter(p => {
      const matchSearch = p.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.prRef.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDate = dateFilter === 'all' ? true : p.date.startsWith(selectedMonth);
      return matchSearch && matchDate;
    });
  }, [poList, searchQuery, dateFilter, selectedMonth]);

  const [currentPage, setCurrentPage] = useState(1);
  const paginatedPOList = useMemo(() => {
    const start = (currentPage - 1) * poItemsPerPage;
    return filteredPOList.slice(start, start + poItemsPerPage);
  }, [filteredPOList, currentPage, poItemsPerPage]);

  const totalPages = Math.ceil(filteredPOList.length / poItemsPerPage) || 1;

  useEffect(() => { 
    setCurrentPage(1); 
    setPendingCurrentPage(1); 
  }, [dateFilter, searchQuery, selectedMonth]);

  const getNewPONumber = () => `PO-${selectedMonth.replace('-','').slice(2)}-${String(poList.length + 1).padStart(3, '0')}`;

  const openModal = (mode: string, data: any = null) => {
    setModalMode(mode);
    setActiveFormTab('general');
    
    if (mode === 'create') {
      setPoForm({
        id: Date.now(), poNumber: getNewPONumber(), date: new Date().toISOString().split('T')[0], 
        vendor: '', vendorAddress: '', prRef: 'Manual', paymentTerm: 'Credit 30 Days', 
        deliveryDate: '', remarks: '', status: 'Pending Approve', subTotal: 0, vat: 0, grandTotal: 0, 
        items: [{ code: '', name: '', qty: '', price: 0 }], history: []
      });
    } else if (mode === 'generate' && data) {
      setSelectedItem(data); 
      const sub = data.items.reduce((s: number, i: any) => s + (i.qty * i.price), 0);
      const vt = sub * 0.07;
      setPoForm({
        id: Date.now(), poNumber: getNewPONumber(), date: new Date().toISOString().split('T')[0], 
        vendor: '', vendorAddress: '', prRef: data.id, paymentTerm: 'Credit 30 Days', 
        deliveryDate: '', remarks: '', status: 'Pending Approve', subTotal: sub, vat: vt, grandTotal: sub + vt, 
        items: data.items.map((i: any) => ({ ...i })), history: []
      });
    } else {
      setSelectedItem(data); 
      setPoForm(JSON.parse(JSON.stringify(data)));
    }
    setModalOpen(true);
  };

  const handleAddItem = () => {
    setPoForm((prev: any) => ({ ...prev, items: [...prev.items, { code: '', name: '', qty: '', price: 0 }]}));
  };

  const handleRemoveItem = (index: number) => {
    setPoForm((prev: any) => {
       const newItems = [...prev.items];
       newItems.splice(index, 1);
       const sub = newItems.reduce((s, i) => s + ((Number(i.qty)||0) * (Number(i.price)||0)), 0);
       return { ...prev, items: newItems, subTotal: sub, vat: sub * 0.07, grandTotal: sub * 1.07 };
    });
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    setPoForm((prev: any) => {
       const newItems = [...prev.items];
       newItems[index][field] = value;
       const sub = newItems.reduce((s, i) => s + ((Number(i.qty)||0) * (Number(i.price)||0)), 0);
       return { ...prev, items: newItems, subTotal: sub, vat: sub * 0.07, grandTotal: sub * 1.07 };
    });
  };

  const handleSavePO = () => {
    if(!poForm.vendor) return alert('กรุณาระบุชื่อผู้ขาย (Vendor Name)');
    if(poForm.items.length === 0) return alert('ต้องมีรายการสินค้าอย่างน้อย 1 รายการ');

    const now = new Date();
    const formattedNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (modalMode === 'create' || modalMode === 'generate') {
      const newPO = { ...poForm, history: [{ date: formattedNow, user: 'Admin', action: 'Created PO', note: '' }]};
      setPoList([newPO, ...poList]);
      if (modalMode === 'generate' && selectedItem) setPendingPRs(pendingPRs.filter(p => p.id !== selectedItem.id));
    } else {
      const updatedPO = { ...poForm, history: [...(poForm.history || []), { date: formattedNow, user: 'Admin', action: `Updated PO`, note: '' }]};
      setPoList(poList.map(p => p.id === poForm.id ? updatedPO : p));
    }
    setModalOpen(false);
  };

  const updatePOStatus = (status: string, poId: any = null) => {
    const targetId = poId || poForm.id;
    if(!targetId) return;

    const formattedNow = new Date().toISOString();
    setPoList(poList.map(p => {
      if (p.id === targetId) {
        return { ...p, status, history: [...(p.history || []), { date: formattedNow, user: 'Admin', action: `Status changed to ${status}`, note: '' }] };
      }
      return p;
    }));
    setModalOpen(false);
  };

  const executePrint = () => {
    setPreviewModal(null);
    setTimeout(() => window.print(), 100);
  };

  const getBoardItems = (status: string) => poList.filter(p => dateFilter === 'all' ? p.status === status : p.status === status && p.date.startsWith(selectedMonth));

  return (
    <div className="flex flex-col h-full bg-bg-main overflow-hidden w-full relative">
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 15mm; }
          body * { visibility: hidden; }
          .print-section, .print-section * { visibility: visible; }
          .print-section { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
      <header className="flex flex-wrap items-center justify-between px-6 py-4 gap-4 shrink-0 bg-transparent no-print">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm border border-silver">
                <ShoppingBag size={24} className="text-primary-dark" strokeWidth={2.5} />
            </div>
            <div>
                <div className="flex items-center gap-2 leading-none">
                    <h2 className="text-primary-dark font-black tracking-tight text-2xl uppercase">PURCHASE</h2>
                    <h2 className="text-accent font-black tracking-tight text-2xl uppercase">ORDER</h2>
                </div>
                <p className="text-dusty-blue text-[11px] font-bold mt-1 uppercase tracking-widest leading-none">ระบบสั่งซื้อสินค้าและวัสดุ (PO)</p>
            </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center bg-white border border-silver rounded-lg overflow-hidden shadow-sm">
            <div className="px-3 py-2 bg-slate-50 border-r border-silver text-dusty-blue"><Calendar size={14} /></div>
            <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="px-3 py-1.5 text-[12px] font-bold text-primary-dark outline-none cursor-pointer" />
          </div>

          <div className="flex bg-white p-1 border border-silver shadow-sm rounded-lg">
            <button onClick={() => setActiveTab('kanban')} className="px-6 py-2 font-bold transition-all flex items-center gap-2 uppercase tracking-widest rounded-md text-[11px] " style={activeTab === 'kanban' ? { backgroundColor: '#1f2a44', color: 'white' } : { color: '#7691ad' }}><Kanban size={14} /> BOARD</button>
            <button onClick={() => setActiveTab('pending')} className="px-6 py-2 font-bold transition-all flex items-center gap-2 uppercase tracking-widest rounded-md text-[11px] " style={activeTab === 'pending' ? { backgroundColor: '#ce870a', color: 'white' } : { color: '#7691ad' }}><FileClock size={14} /> PR WAITING</button>
            <button onClick={() => setActiveTab('list')} className="px-6 py-2 font-bold transition-all flex items-center gap-2 uppercase tracking-widest rounded-md text-[11px] " style={activeTab === 'list' ? { backgroundColor: '#aa7095', color: 'white' } : { color: '#7691ad' }}><List size={14} /> PO LIST</button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6 space-y-6 w-full relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in duration-500 no-print">
            <div className="sys-glass-card flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4"><p className="sys-kpi-label">PR to Process</p></div>
              <h3 className="sys-kpi-value text-accent">{filteredPendingPRs.length}</h3>
            </div>
            <div className="sys-glass-card flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4"><p className="sys-kpi-label">Open POs</p></div>
              <h3 className="sys-kpi-value text-primary">{filteredPOList.filter(p=>p.status!=='Completed').length}</h3>
            </div>
            <div className="sys-glass-card flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4"><p className="sys-kpi-label">Completed</p></div>
              <h3 className="sys-kpi-value text-success">{filteredPOList.filter(p=>p.status==='Completed').length}</h3>
            </div>
            <div className="sys-glass-card flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4"><p className="sys-kpi-label">Total Spend (Mo)</p></div>
              <h3 className="text-3xl font-black font-mono text-pink-accent leading-none">{formatCurrency(filteredPOList.reduce((acc, p) => acc + p.grandTotal, 0))}</h3>
            </div>
          </div>

          {activeTab === 'kanban' && (
            <div className="animate-in fade-in duration-500 w-full overflow-x-auto pb-4 custom-scrollbar no-print">
              <div className="flex gap-6 min-w-max h-[620px] items-start">
                {/* Col: Pending PRs */}
                <div className="w-[300px] flex flex-col h-[620px] bg-slate-50 rounded-2xl border border-silver shadow-sm overflow-hidden">
                  <div className="flex justify-between items-center px-4 py-3 bg-accent/20 border-b border-accent/40 shadow-sm z-10"><h4 className="font-black text-primary-dark text-[11px] tracking-widest uppercase flex items-center gap-2">รอสร้าง PO</h4><span className="bg-white text-primary-dark text-[11px] px-2 py-0.5 rounded font-black">{filteredPendingPRs.length}</span></div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {filteredPendingPRs.slice(0, kanbanLimits.pendingPR).map(pr => (
                      <div key={pr.id} className="bg-white p-2.5 rounded-xl shadow-sm border border-silver hover:shadow-md hover:border-accent transition-all cursor-pointer flex flex-col gap-1.5" onClick={() => openModal('generate', pr)}>
                         <div className="flex justify-between items-center"><span className="font-bold text-[11px] text-primary-dark bg-slate-100 px-2 py-1 rounded">{pr.id}</span></div>
                         <div className="font-bold text-xs text-primary-dark leading-tight truncate">{pr.department}</div>
                         <div className="text-[11px] text-dusty-blue font-medium">Req: {pr.requester}</div>
                         <div className="border-t border-slate-100 pt-2 flex justify-between items-center mt-1">
                            <span className="bg-slate-100 text-dusty-blue text-[11px] px-2 py-1 rounded font-black uppercase">{pr.items.length} Items</span>
                            <span className="text-[11px] font-black font-mono text-danger">{formatCurrency(pr.totalAmount)}</span>
                         </div>
                      </div>
                    ))}
                    {filteredPendingPRs.length > kanbanLimits.pendingPR && (
                      <button onClick={() => setKanbanLimits({...kanbanLimits, pendingPR: kanbanLimits.pendingPR + 5})} className="w-full bg-white border border-silver text-primary-dark text-[11px] font-black py-2 rounded-xl hover:bg-slate-50 transition-colors uppercase">Load More</button>
                    )}
                  </div>
                </div>

                {/* Col: Pending Approve */}
                <div className="w-[300px] flex flex-col h-[620px] bg-slate-50 rounded-2xl border border-silver shadow-sm overflow-hidden">
                  <div className="flex justify-between items-center px-4 py-3 bg-primary/20 border-b border-primary/40 shadow-sm z-10"><h4 className="font-black text-primary-dark text-[11px] tracking-widest uppercase flex items-center gap-2">รออนุมัติ</h4><span className="bg-white text-primary-dark text-[11px] px-2 py-0.5 rounded font-black">{getBoardItems('Pending Approve').length}</span></div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {getBoardItems('Pending Approve').slice(0, kanbanLimits['Pending Approve']).map(po => (
                      <div key={po.id} className="bg-white p-2.5 rounded-xl shadow-sm border border-silver hover:shadow-md hover:border-primary transition-all cursor-pointer flex flex-col gap-1.5" onClick={() => openModal('approve', po)}>
                        <div className="flex justify-between items-center"><span className="font-bold text-[11px] text-primary-dark bg-slate-100 px-2 py-1 rounded">{po.poNumber}</span><span className="text-[11px] text-dusty-blue font-mono">{formatDate(po.date)}</span></div>
                        <div className="font-bold text-xs text-primary-dark truncate">{po.vendor}</div>
                        <div className="text-[11px] text-dusty-blue font-medium mb-1">Ref: {po.prRef}</div>
                        <div className="border-t border-slate-100 pt-2 flex justify-between items-center mt-1"><span className="bg-primary/10 text-primary text-[11px] px-2 py-1 rounded font-black uppercase">Approve</span><span className="text-[11px] font-black font-mono text-danger">{formatCurrency(po.grandTotal)}</span></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Col: Approved */}
                <div className="w-[300px] flex flex-col h-[620px] bg-slate-50 rounded-2xl border border-silver shadow-sm overflow-hidden">
                  <div className="flex justify-between items-center px-4 py-3 bg-success/20 border-b border-success/40 shadow-sm z-10"><h4 className="font-black text-primary-dark text-[11px] tracking-widest uppercase flex items-center gap-2">อนุมัติแล้ว</h4><span className="bg-white text-primary-dark text-[11px] px-2 py-0.5 rounded font-black">{getBoardItems('Approved').length}</span></div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {getBoardItems('Approved').slice(0, kanbanLimits['Approved']).map(po => (
                      <div key={po.id} className="bg-white p-2.5 rounded-xl shadow-sm border border-silver hover:shadow-md hover:border-success transition-all cursor-pointer flex flex-col gap-1.5" onClick={() => openModal('view', po)}>
                        <div className="flex justify-between items-center"><span className="font-bold text-[11px] text-primary-dark bg-slate-100 px-2 py-1 rounded">{po.poNumber}</span></div>
                        <div className="font-bold text-xs text-primary-dark truncate">{po.vendor}</div>
                        <button onClick={(e) => {e.stopPropagation(); updatePOStatus('Sent', po.id);}} className="mt-2 w-full bg-success text-white text-[11px] font-black py-2 rounded-lg uppercase tracking-widest hover:opacity-90 transition-opacity">Send to Vendor</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Col: Sent */}
                <div className="w-[300px] flex flex-col h-[620px] bg-slate-50 rounded-2xl border border-silver shadow-sm overflow-hidden">
                  <div className="flex justify-between items-center px-4 py-3 bg-pink-accent/20 border-b border-pink-accent/40 shadow-sm z-10"><h4 className="font-black text-primary-dark text-[11px] tracking-widest uppercase flex items-center gap-2">รอรับสินค้า</h4><span className="bg-white text-primary-dark text-[11px] px-2 py-0.5 rounded font-black">{getBoardItems('Sent').length}</span></div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {getBoardItems('Sent').slice(0, kanbanLimits['Sent']).map(po => (
                      <div key={po.id} className="bg-white p-2.5 rounded-xl shadow-sm border border-silver hover:shadow-md hover:border-pink-accent transition-all cursor-pointer flex flex-col gap-1.5" onClick={() => openModal('view', po)}>
                        <div className="flex justify-between items-center"><span className="font-bold text-[11px] text-primary-dark bg-slate-100 px-2 py-1 rounded">{po.poNumber}</span></div>
                        <div className="font-bold text-xs text-primary-dark truncate">{po.vendor}</div>
                        <button onClick={(e) => {e.stopPropagation(); updatePOStatus('Completed', po.id);}} className="mt-2 w-full border border-pink-accent text-pink-accent hover:bg-pink-accent hover:text-white text-[11px] font-black py-2 rounded-lg uppercase tracking-widest transition-all">Receive Goods</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pending' && (
            <div className="sys-card-base p-0 overflow-hidden no-print">
              <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-white border-b border-silver gap-4">
                 <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dusty-blue" size={14} />
                    <input type="text" placeholder="Search PR Number..." className="sys-input w-full pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                 </div>
              </div>
              <div className="overflow-x-auto w-full custom-scrollbar">
                 <table className="w-full text-left border-collapse">
                    <thead className="sys-table-header"><tr><th>PR Number</th><th>Date</th><th>Requester / Dept</th><th className="text-center">Items</th><th className="text-right">Est. Amount</th><th className="text-center">Action</th></tr></thead>
                    <tbody className="divide-y divide-silver/50">
                      {paginatedPendingPRs.map(pr => (
                        <tr key={pr.id} className="hover:bg-slate-50 transition-colors">
                          <td className="sys-table-td font-black">{pr.id}</td>
                          <td className="sys-table-td">{formatDate(pr.date)}</td>
                          <td className="sys-table-td"><div className="font-bold">{pr.requester}</div><div className="text-[11px] text-dusty-blue">{pr.department}</div></td>
                          <td className="sys-table-td text-center font-bold">{pr.items.length}</td>
                          <td className="sys-table-td text-right font-black text-danger font-mono">{formatCurrency(pr.totalAmount)}</td>
                          <td className="sys-table-td text-center"><button onClick={() => openModal('generate', pr)} className="bg-accent text-white px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-md mx-auto">Create PO</button></td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
              </div>
              {/* Pagination */}
              <div className="sys-pagination-container">
                  <p className="sys-pagination-text">Showing 1 to {paginatedPendingPRs.length} of {filteredPendingPRs.length}</p>
              </div>
            </div>
          )}

          {activeTab === 'list' && (
            <div className="sys-card-base p-0 overflow-hidden no-print">
              <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-white border-b border-silver gap-4">
                 <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dusty-blue" size={14} />
                    <input type="text" placeholder="Search PO Number, Vendor..." className="sys-input w-full pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                 </div>
                 <button onClick={() => openModal('create')} className="sys-btn-primary"><Plus size={14}/> NEW PO</button>
              </div>
              <div className="overflow-x-auto w-full custom-scrollbar">
                 <table className="w-full text-left border-collapse">
                    <thead className="sys-table-header"><tr><th>PO Number</th><th>Date</th><th>Vendor</th><th className="text-right">Total Amount</th><th className="text-center">Status</th><th className="text-center">Action</th></tr></thead>
                    <tbody className="divide-y divide-silver/50">
                      {paginatedPOList.map(po => (
                        <tr key={po.id} className="hover:bg-slate-50 transition-colors">
                          <td className="sys-table-td font-black">{po.poNumber}</td>
                          <td className="sys-table-td">{formatDate(po.date)}</td>
                          <td className="sys-table-td font-bold">{po.vendor}</td>
                          <td className="sys-table-td text-right font-black text-danger font-mono">{formatCurrency(po.grandTotal)}</td>
                          <td className="sys-table-td text-center"><span className={`px-2 py-1 rounded-md text-[11px] font-black uppercase border tracking-widest ${getStatusBadgeClass(po.status)}`}>{po.status}</span></td>
                          <td className="sys-table-td text-center border-l-0">
                             <div className="flex justify-center gap-[0.5px]">
                                <button onClick={() => openModal('view', po)} className="w-8 h-8 flex items-center justify-center text-primary hover:bg-primary/10 rounded transition-colors" title="View"><Eye size={16}/></button>
                                <button onClick={() => openModal('edit', po)} className="w-8 h-8 flex items-center justify-center text-accent hover:bg-accent/10 rounded transition-colors" title="Edit"><Pencil size={16}/></button>
                                <button onClick={() => {setSelectedItem(po); setPreviewModal('print');}} className="w-8 h-8 flex items-center justify-center text-pink-accent hover:bg-pink-accent/10 rounded transition-colors" title="Print"><Printer size={16}/></button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
              </div>
              {/* Pagination */}
              <div className="sys-pagination-container">
                  <p className="sys-pagination-text">Showing 1 to {paginatedPOList.length} of {filteredPOList.length}</p>
              </div>
            </div>
          )}
      </main>

      {/* PO Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-primary-dark/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-[24px] w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 flex justify-between items-center bg-primary-dark text-white border-b-2 border-accent shrink-0">
                <div className="flex items-center gap-3">
                   <h2 className="text-sm font-black uppercase tracking-widest">{modalMode==='create' ? 'Create Purchase Order' : `PO: ${poForm.poNumber}`}</h2>
                </div>
                <button onClick={()=>setModalOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors"><X size={20}/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-bg-main space-y-6">
                  {/* Info Cards */}
                  <div className="grid grid-cols-2 gap-4">
                     <div className="sys-card-base">
                        <h4 className="sys-stack-main mb-4 border-b border-silver pb-2">Vendor Information</h4>
                        <div className="space-y-3">
                           <div><label className="sys-label-tiny">Vendor Name</label><input disabled={modalMode==='view'} className="sys-input w-full mt-1 font-bold" value={poForm.vendor} onChange={e=>setPoForm({...poForm, vendor: e.target.value})} /></div>
                           <div><label className="sys-label-tiny">Vendor Address</label><textarea disabled={modalMode==='view'} rows={2} className="sys-input w-full mt-1" value={poForm.vendorAddress} onChange={e=>setPoForm({...poForm, vendorAddress: e.target.value})} /></div>
                        </div>
                     </div>
                     <div className="sys-card-base">
                        <h4 className="sys-stack-main mb-4 border-b border-silver pb-2">Order Details</h4>
                        <div className="grid grid-cols-2 gap-3">
                           <div><label className="sys-label-tiny">Payment Term</label><select disabled={modalMode==='view'} className="sys-input w-full mt-1" value={poForm.paymentTerm} onChange={e=>setPoForm({...poForm, paymentTerm: e.target.value})}><option>Credit 30 Days</option><option>Cash / COD</option></select></div>
                           <div><label className="sys-label-tiny">Delivery Date</label><input type="date" disabled={modalMode==='view'} className="sys-input w-full mt-1" value={poForm.deliveryDate} onChange={e=>setPoForm({...poForm, deliveryDate: e.target.value})} /></div>
                           <div><label className="sys-label-tiny">PR Reference</label><input disabled className="sys-input w-full mt-1 bg-slate-50" value={poForm.prRef} /></div>
                           <div><label className="sys-label-tiny">Remarks</label><input disabled={modalMode==='view'} className="sys-input w-full mt-1" value={poForm.remarks} onChange={e=>setPoForm({...poForm, remarks: e.target.value})} /></div>
                        </div>
                     </div>
                  </div>

                  {/* Items list */}
                  <div className="sys-card-base p-0 overflow-hidden">
                     <div className="p-4 border-b border-silver flex justify-between items-center bg-white">
                        <h4 className="sys-stack-main">Line Items</h4>
                        {(modalMode==='create' || modalMode==='edit') && <button onClick={handleAddItem} className="sys-btn-secondary py-1.5 px-4"><Plus size={14}/> ADD</button>}
                     </div>
                     <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left">
                           <thead className="sys-table-header"><tr><th>#</th><th>Code</th><th>Name</th><th>Qty</th><th>Price</th><th className="text-right">Total</th>{modalMode!=='view'&&<th>Act</th>}</tr></thead>
                           <tbody className="divide-y divide-silver/50">
                              {poForm.items.map((item: any, i: number) => (
                                <tr key={i}>
                                   <td className="sys-table-td">{i+1}</td>
                                   <td className="sys-table-td"><input disabled={modalMode==='view'} className="sys-input py-1 px-2 w-24 font-bold" value={item.code} onChange={e=>handleItemChange(i,'code',e.target.value)} /></td>
                                   <td className="sys-table-td min-w-[200px]"><input disabled={modalMode==='view'} className="sys-input w-full py-1 px-2" value={item.name} onChange={e=>handleItemChange(i,'name',e.target.value)} /></td>
                                   <td className="sys-table-td"><input disabled={modalMode==='view'} type="number" className="sys-input w-20 py-1 px-2 font-mono" value={item.qty} onChange={e=>handleItemChange(i,'qty',e.target.value)} /></td>
                                   <td className="sys-table-td"><input disabled={modalMode==='view'} type="number" className="sys-input w-24 py-1 px-2 font-mono" value={item.price} onChange={e=>handleItemChange(i,'price',e.target.value)} /></td>
                                   <td className="sys-table-td text-right font-black text-danger font-mono">{formatCurrency((item.qty*item.price)||0)}</td>
                                   {modalMode!=='view' && <td className="sys-table-td"><button onClick={()=>handleRemoveItem(i)} className="w-8 h-8 flex items-center justify-center text-danger hover:bg-danger/10 rounded transition-colors"><Trash2 size={16}/></button></td>}
                                </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                     <div className="p-4 bg-slate-50 flex flex-col items-end gap-1 border-t border-silver">
                        <div className="flex justify-between w-48 text-[11px] font-bold text-dusty-blue uppercase tracking-widest"><span>Subtotal:</span><span className="font-mono">{formatCurrency(poForm.subTotal)}</span></div>
                        <div className="flex justify-between w-48 text-[11px] font-bold text-dusty-blue uppercase tracking-widest mb-2"><span>VAT 7%:</span><span className="font-mono">{formatCurrency(poForm.vat)}</span></div>
                        <div className="flex justify-between w-64 items-center pt-2 border-t border-silver">
                           <span className="text-xs font-black text-primary-dark uppercase tracking-widest">Grand Total:</span>
                           <span className="text-xl font-black font-mono tracking-tight text-danger">{formatCurrency(poForm.grandTotal)}</span>
                        </div>
                     </div>
                  </div>
              </div>
              <div className="p-4 bg-white border-t border-silver flex justify-end gap-3 shrink-0">
                  <button onClick={()=>setModalOpen(false)} className="sys-btn-secondary border-transparent">Cancel</button>
                  {modalMode !== 'view' && <button onClick={handleSavePO} className="sys-btn-primary">SAVE DRAFT</button>}
                  {modalMode === 'approve' && <button onClick={()=>updatePOStatus('Approved')} className="sys-btn-primary !bg-gradient-to-r !from-success !to-[#44522a]">APPROVE PO</button>}
              </div>
           </div>
        </div>
      )}

      {previewModal === 'print' && selectedItem && (
        <div className="fixed inset-0 bg-white z-[200] flex justify-center overflow-auto print-section print:p-0">
            <div className="max-w-[794px] w-full p-10 bg-white min-h-screen border border-silver shadow-xl print:border-none print:shadow-none">
              <div className="flex justify-between mb-8">
                 <h1 className="text-3xl font-black text-primary-dark uppercase">PURCHASE ORDER</h1>
                 <button onClick={()=>setPreviewModal(null)} className="no-print sys-btn-secondary px-4 py-2"><X size={14}/></button>
              </div>
              <div className="grid grid-cols-2 gap-8 mb-8 text-[11px] font-medium text-dark-slate">
                 <div>
                    <p className="sys-label-tiny mb-1">Vendor</p>
                    <p className="font-black text-sm text-primary-dark uppercase mb-1">{selectedItem.vendor}</p>
                    <p>{selectedItem.vendorAddress}</p>
                 </div>
                 <div className="text-right">
                    <p className="font-black text-primary-dark text-lg">{selectedItem.poNumber}</p>
                    <p className="font-bold text-dusty-blue mt-1 uppercase tracking-widest">Date: {formatDate(selectedItem.date)}</p>
                    <p className="font-bold text-dusty-blue uppercase tracking-widest">Ref PR: {selectedItem.prRef}</p>
                 </div>
              </div>
              <table className="w-full text-left border-collapse mb-8">
                 <thead className="bg-primary-dark text-white border-b-2 border-accent">
                    <tr><th className="py-2 px-3 text-[11px] font-black uppercase tracking-widest">#</th><th className="py-2 px-3 text-[11px] font-black uppercase tracking-widest">Description</th><th className="py-2 px-3 text-[11px] font-black uppercase tracking-widest text-center">Qty</th><th className="py-2 px-3 text-[11px] font-black uppercase tracking-widest text-right">Price</th><th className="py-2 px-3 text-[11px] font-black uppercase tracking-widest text-right">Amount</th></tr>
                 </thead>
                 <tbody className="text-[11px] font-medium text-dark-slate divide-y divide-silver/50 border-b border-silver">
                    {selectedItem.items.map((item: any, i: number) => (
                       <tr key={i}>
                          <td className="py-3 px-3">{i+1}</td>
                          <td className="py-3 px-3"><span className="font-black text-primary-dark">{item.code}</span> - {item.name}</td>
                          <td className="py-3 px-3 font-mono text-center">{item.qty}</td>
                          <td className="py-3 px-3 font-mono text-right">{formatCurrency(item.price)}</td>
                          <td className="py-3 px-3 font-mono font-black text-danger text-right">{formatCurrency(item.qty * item.price)}</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
              <div className="flex justify-end mb-12">
                 <div className="w-64 text-[11px]">
                    <div className="flex justify-between py-1 border-b border-silver/50"><span className="font-bold uppercase tracking-widest text-dusty-blue">Subtotal</span><span className="font-mono font-bold text-primary-dark">{formatCurrency(selectedItem.subTotal)}</span></div>
                    <div className="flex justify-between py-1 border-b border-silver/50"><span className="font-bold uppercase tracking-widest text-dusty-blue">VAT 7%</span><span className="font-mono font-bold text-primary-dark">{formatCurrency(selectedItem.vat)}</span></div>
                    <div className="flex justify-between py-2 border-b-2 border-primary-dark"><span className="font-black uppercase tracking-widest text-primary-dark">Total</span><span className="font-mono font-black text-lg text-danger">{formatCurrency(selectedItem.grandTotal)}</span></div>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-12 text-center text-[11px] font-bold uppercase tracking-widest text-dusty-blue mt-24">
                 <div><div className="border-b border-silver border-dashed mb-2 pb-8 h-12"></div><p>Authorized Signature</p></div>
                 <div><div className="border-b border-silver border-dashed mb-2 pb-8 h-12"></div><p>Vendor Acceptance</p></div>
              </div>
            </div>
        </div>
      )}
    </div>
  );
}
