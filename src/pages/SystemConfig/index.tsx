import React, { useState, useEffect, useMemo } from 'react';
import * as Icons from 'lucide-react';
import { LucideIcon } from '../../components/shared/LucideIcon';
import { ConfigGuidePanel } from './components/ConfigGuidePanel';
import { ConfigModal } from './components/ConfigModal';
import { ConfigTabId, SystemConfigData } from './types';
import { INITIAL_DATA, TABS } from './constants';
import Swal from 'sweetalert2';

import { KpiCard } from '../../components/shared/KpiCard';

const GuideTrigger = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={onClick} 
    className="fixed right-0 top-32 bg-[#5686bb] text-white py-4 px-2 rounded-l-xl shadow-[-4px_0_15px_rgba(86,134,187,0.15)] hover:bg-[#c1121f] transition-colors duration-300 z-[100] flex flex-col items-center gap-3 group border border-r-0 border-white/20"
  >
    <LucideIcon name="help-circle" size={18} className="shrink-0 group-hover:scale-110 transition-transform" />
    <span className="font-extrabold tracking-[0.2em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase font-mono text-xs">
      USER GUIDE
    </span>
  </button>
);

export default function SystemConfig() {
  const [activeTab, setActiveTab] = useState<ConfigTabId>('departments'); 
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [data, setData] = useState<SystemConfigData>(INITIAL_DATA);
  const [search, setSearch] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null); 
  const [formData, setFormData] = useState<any>({ 
      name: '', code: '', dept: '', revision: '', 
      pages: [], prefix: '', format: 'YYMMDD', sequenceDigit: 3, reset: 'Daily', note: '' 
  });

  const activeTabData = TABS.find(t => t.id === activeTab)!;
  const currentList = data[activeTab] || [];

  const filteredList = useMemo(() => {
      return currentList.filter((item: any) => {
          const s = search.toLowerCase();
          if (activeTab === 'idFormats') {
              return (item.prefix?.toLowerCase().includes(s) || 
                      item.pages?.join(',').toLowerCase().includes(s));
          }
          return (item.name?.toLowerCase().includes(s) || 
                  item.code?.toLowerCase().includes(s) || 
                  item.dept?.toLowerCase().includes(s));
      });
  }, [currentList, search, activeTab]);

  const paginatedData = filteredList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  useEffect(() => { setCurrentPage(1); setSearch(''); }, [activeTab]);

  const handleOpenModal = (item: any = null) => {
    setEditingItem(item);
    setFormData(item ? { ...item } : { 
      name: '', code: '', dept: '', revision: '',
      pages: [], prefix: '', format: 'YYMMDD', sequenceDigit: 3, reset: 'Daily', note: ''
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setData(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].map((item: any) => 
          item.id === editingItem.id ? { ...item, ...formData } : item
        )
      }));
      Swal.fire({icon: 'success', title: 'Updated Successfully', toast: true, position: 'top-end', showConfirmButton: false, timer: 1500});
    } else {
      const newId = currentList.length > 0 ? Math.max(...currentList.map((i: any) => i.id)) + 1 : 1;
      setData(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], { id: newId, ...formData }]
      }));
      Swal.fire({icon: 'success', title: 'Added Successfully', toast: true, position: 'top-end', showConfirmButton: false, timer: 1500});
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    Swal.fire({
        title: 'Are you sure?', 
        text: "You won't be able to revert this!", 
        icon: 'warning',
        showCancelButton: true, 
        confirmButtonColor: '#c1121f', 
        confirmButtonText: 'Yes, delete it!',
        customClass: {
          popup: 'rounded-2xl shadow-xl border border-silver'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            setData(prev => ({
                ...prev,
                [activeTab]: prev[activeTab].filter((item: any) => item.id !== id)
            }));
            Swal.fire({icon: 'success', title: 'Deleted!', text: 'Record has been deleted.', timer: 1500, showConfirmButton: false});
        }
    });
  };

  const togglePageSelection = (page: string) => {
      setFormData((prev: any) => {
          const pages = prev.pages || [];
          if (pages.includes(page)) return { ...prev, pages: pages.filter((p: string) => p !== page) };
          return { ...prev, pages: [...pages, page] };
      });
  };

  return (
    <div className="sys-page-layout animate-fadeIn relative">
        <GuideTrigger onClick={() => setIsGuideOpen(true)} />
        <ConfigGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
        
        <ConfigModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          activeTab={activeTab} 
          editingItem={editingItem} 
          formData={formData} 
          setFormData={setFormData}
          onSave={handleSave} 
          togglePageSelection={togglePageSelection}
        />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 bg-white flex items-center justify-center shadow-[0_4px_15px_rgba(86,134,187,0.3)] border border-[#a0b1dd] rounded-xl text-[#5686bb]">
              <Icons.Settings2 size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col justify-center leading-none">
              <h1 className="text-2xl font-black tracking-tight uppercase flex gap-2">
                <span className="text-[#003049]">SYSTEM</span>
                <span className="text-[#669bbc]">CONFIG</span>
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-1.5 text-[#7188a2]">System Master Data Configuration</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
          <KpiCard label="Total Records" value={filteredList.length} icon="list" colorAccent="#5686bb" colorValue="#003049" desc={`In ${activeTabData.label}`} />
          <KpiCard label="System Categories" value={TABS.length} icon="layout-grid" colorAccent="#c1121f" colorValue="#003049" desc="Configuration Areas" />
          <KpiCard label="Recently Updated" value={new Date().toLocaleDateString('en-GB')} icon="clock" colorAccent="#f2b33d" colorValue="#ae1f23" desc="Latest Action" />
          <KpiCard label="Database Status" value="SYNCED" icon="check-circle" colorAccent="#849e51" colorValue="#849e51" desc="Real-time Active" />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
            <div className="w-full lg:w-72 shrink-0 h-fit">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#bcc4cf] p-5">
                    <h3 className="text-[12px] font-black text-[#003049] uppercase tracking-widest mb-5 px-2 border-b border-[#e9e4dc] pb-3">Registry Categories</h3>
                    <div className="flex flex-col gap-2">
                        {TABS.map(tab => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button 
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left ${
                                        isActive 
                                        ? 'bg-[#003049] text-white shadow-[0_4px_10px_rgba(0,48,73,0.3)]' 
                                        : 'text-[#7188a2] hover:text-[#003049] hover:bg-[#f7f3ee] border border-transparent hover:border-[#bcc4cf]'
                                    }`}
                                >
                                    <div className={`p-2 rounded-lg ${isActive ? 'bg-white/10 text-[#f2b33d]' : 'bg-[#f7f3ee] border border-[#e9e4dc] text-[#5686bb]'}`}>
                                        <LucideIcon name={tab.icon} size={16} />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="font-bold text-[12px] uppercase tracking-widest leading-none mb-1.5 truncate">{tab.label}</div>
                                        <div className={`text-[9px] font-mono truncate ${isActive ? 'text-[#a0b1dd]' : 'text-[#7188a2]'}`}>
                                            {data[tab.id]?.length || 0} Records
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#bcc4cf] flex flex-col flex-1 min-w-0 animate-fadeIn overflow-hidden">
                <div className="px-6 py-5 border-b border-[#bcc4cf] flex flex-col md:flex-row justify-between items-center bg-[#f7f3ee] shrink-0 gap-4">
                  <div className="flex items-center gap-2 text-[14px] font-black text-[#003049] uppercase tracking-widest">
                      <LucideIcon name={activeTabData.icon} size={18} className="text-[#c1121f]"/>
                      <span>{activeTabData.title} LIST</span>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                     <div className="relative w-full md:w-64">
                        <Icons.Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5686bb]" />
                        <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder={`Search ${activeTabData.label}...`} className="w-full pl-11 pr-4 py-2 text-[12px] border border-[#a0b1dd] rounded-full font-bold outline-none focus:border-[#003049] bg-white shadow-sm text-[#003049] h-11" />
                     </div>
                     <button onClick={() => handleOpenModal()} className="bg-[#003049] hover:bg-[#5686bb] text-white px-6 py-2.5 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0 h-11">
                        <Icons.Plus size={16}/> ADD NEW
                     </button>
                  </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    {activeTab === 'idFormats' ? (
                      <table className="w-full text-left font-sans min-w-[900px] border-collapse">
                        <thead className="bg-[#003049] border-b-[3px] border-[#c6a75e] text-white font-mono uppercase tracking-wider text-[11px] font-black">
                          <tr>
                            <th className="py-4 px-6 pl-8">Pages</th>
                            <th className="py-4 px-6 text-center">Prefix</th>
                            <th className="py-4 px-6 text-center">Format</th>
                            <th className="py-4 px-6 text-center">Digit & Reset</th>
                            <th className="py-4 px-6">Note</th>
                            <th className="py-4 px-6 pr-8 text-center whitespace-nowrap">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {paginatedData.map((item: any) => (
                            <tr key={item.id} className="hover:bg-[#f7f3ee]/80 transition-colors border-b border-[#e9e4dc]">
                              <td className="py-3 px-6 pl-8">
                                <div className="flex flex-wrap gap-2">
                                    {item.pages?.map((p: string, i: number) => (
                                        <span key={i} className="bg-[#f7f3ee] text-[#003049] border border-[#bcc4cf] px-2.5 py-1 rounded-[6px] text-[10px] font-bold uppercase tracking-widest">
                                            {p}
                                        </span>
                                    ))}
                                </div>
                              </td>
                              <td className="py-3 px-6 text-center">
                                <span className="font-mono font-black text-[#c1121f] text-[13px]">{item.prefix}</span>
                              </td>
                              <td className="py-3 px-6 text-center">
                                <span className="bg-[#f7f3ee] text-[#5686bb] px-3 py-1 rounded-md font-mono font-black text-[12px] border border-[#bcc4cf]">{item.format}</span>
                              </td>
                              <td className="py-3 px-6 text-center">
                                <div className="flex flex-col items-center">
                                    <span className="font-black text-[#003049] text-[12px]">{item.sequenceDigit} Digits</span>
                                    <span className="text-[10px] text-[#7188a2] font-bold uppercase tracking-widest">Reset: {item.reset}</span>
                                </div>
                              </td>
                              <td className="py-3 px-6">
                                <span className="text-[#7188a2] text-[12px] font-medium truncate max-w-[200px] inline-block">{item.note || '-'}</span>
                              </td>
                              <td className="py-2.5 px-6 pr-8 text-center whitespace-nowrap">
                                <div className="flex justify-center items-center gap-1">
                                  <button onClick={() => handleOpenModal(item)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#bcc4cf] text-[#5686bb] hover:bg-white shadow-sm transition-colors">
                                    <Icons.Pencil size={14} />
                                  </button>
                                  <button onClick={() => handleDelete(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#bcc4cf] text-[#c1121f] hover:bg-white shadow-sm transition-colors">
                                    <Icons.Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : activeTab === 'pdfTemplates' ? (
                      <table className="w-full text-left font-sans min-w-[800px] border-collapse">
                        <thead className="bg-[#003049] border-b-[3px] border-[#c6a75e] text-white font-mono uppercase tracking-wider text-[11px] font-black">
                          <tr>
                            <th className="py-4 px-6 pl-8">Form Name</th>
                            <th className="py-4 px-6 text-center">Department</th>
                            <th className="py-4 px-6 text-center">Form Code</th>
                            <th className="py-4 px-6 text-center">Revision</th>
                            <th className="py-4 px-6 pr-8 text-center whitespace-nowrap">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {paginatedData.map((item: any) => (
                            <tr key={item.id} className="hover:bg-[#f7f3ee]/80 transition-colors border-b border-[#e9e4dc]">
                              <td className="py-3 px-6 pl-8">
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-[#5686bb]"></div>
                                  <span className="font-bold text-[#003049] text-[13px] uppercase">{item.name}</span>
                                </div>
                              </td>
                              <td className="py-3 px-6 text-center font-bold text-[#5686bb] text-[12px] uppercase">{item.dept}</td>
                              <td className="py-3 px-6 text-center">
                                <span className="bg-[#f7f3ee] text-[#003049] px-3 py-1 rounded-md font-mono font-black text-[12px] border border-[#bcc4cf]">{item.code}</span>
                              </td>
                              <td className="py-3 px-6 text-center font-black text-[#c1121f] text-[12px] font-mono">{item.revision}</td>
                              <td className="py-2.5 px-6 pr-8 text-center whitespace-nowrap">
                                <div className="flex justify-center items-center gap-1">
                                  <button onClick={() => handleOpenModal(item)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#bcc4cf] text-[#5686bb] hover:bg-white shadow-sm transition-colors">
                                    <Icons.Pencil size={14} />
                                  </button>
                                  <button onClick={() => handleDelete(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#bcc4cf] text-[#c1121f] hover:bg-white shadow-sm transition-colors">
                                    <Icons.Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <table className="w-full text-left font-sans min-w-[600px] border-collapse">
                        <thead className="bg-[#003049] border-b-[3px] border-[#c6a75e] text-white font-mono uppercase tracking-wider text-[11px] font-black">
                          <tr>
                            <th className="py-4 px-6 pl-8">Name</th>
                            {activeTab === 'departments' && <th className="py-4 px-6 text-center">Code</th>}
                            <th className="py-4 px-6 pr-8 text-center whitespace-nowrap">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {paginatedData.map((item: any) => (
                            <tr key={item.id} className="hover:bg-[#f7f3ee]/80 transition-colors border-b border-[#e9e4dc]">
                              <td className="py-3 px-6 pl-8">
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-[#5686bb]"></div>
                                  <span className="font-bold text-[#003049] text-[13px] uppercase">{item.name}</span>
                                </div>
                              </td>
                              {activeTab === 'departments' && (
                                <td className="py-3 px-6 text-center">
                                  <span className="bg-[#f7f3ee] text-[#003049] px-3 py-1 rounded-md font-mono font-black text-[12px] border border-[#bcc4cf]">{item.code}</span>
                                </td>
                              )}
                              <td className="py-2.5 px-6 pr-8 text-center whitespace-nowrap">
                                <div className="flex justify-center items-center gap-1">
                                  <button onClick={() => handleOpenModal(item)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#bcc4cf] text-[#5686bb] hover:bg-white shadow-sm transition-colors">
                                    <Icons.Pencil size={14} />
                                  </button>
                                  <button onClick={() => handleDelete(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#bcc4cf] text-[#c1121f] hover:bg-white shadow-sm transition-colors">
                                    <Icons.Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                </div>
                
                <div className="p-4 bg-[#f7f3ee] border-t border-[#bcc4cf] flex justify-between items-center font-bold text-[#7188a2] uppercase tracking-widest shrink-0 font-mono text-[10px]">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span>SHOW:</span>
                            <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="bg-white border border-[#bcc4cf] rounded px-2 py-0.5" >
                                {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                        <div>TOTAL {filteredList.length}</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-1 border border-[#bcc4cf] bg-white rounded hover:bg-[#e9e4dc] disabled:opacity-30"><Icons.ChevronLeft size={16}/></button>
                        <span>PAGE {currentPage} OF {totalPages || 1}</span>
                        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="p-1 border border-[#bcc4cf] bg-white rounded hover:bg-[#e9e4dc] disabled:opacity-30"><Icons.ChevronRight size={16}/></button>
                    </div>
                </div>
            </div>
          </div>
    </div>
  );
}
