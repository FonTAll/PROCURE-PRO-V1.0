import React, { useState, useEffect, useMemo } from 'react';
import * as Icons from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LucideIcon } from '../../components/shared/LucideIcon';
import { UserGuidePanel } from './components/UserGuidePanel';
import { EditUserModal } from './components/EditUserModal';
import { User, UserPermissionsData } from './types';
import { SYSTEM_MODULES, PERMISSION_LEVELS } from './constants';

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

export default function UserPermission() {
  const [activeTab, setActiveTab] = useState('registry'); 
  const [viewMode, setViewMode] = useState<'list' | 'matrix'>('list'); 
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [editModal, setEditModal] = useState<{isOpen: boolean, user: User | null}>({ isOpen: false, user: null });
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [confidentialityMap, setConfidentialityMap] = useState<Record<string, boolean>>({'settings': true, 'analytics': true});

  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'SOMCHAI JAIDEE', position: 'SALES DIRECTOR', email: 'somchai@salepro.com', avatar: 'https://i.pravatar.cc/150?img=11', isDev: false, permissions: { dashboard: [1, 2, 3, 4], pipeline: [1, 2, 4], analytics: [1, 2] } },
    { id: 2, name: 'SUDA RAKDEE', position: 'MARKETING MANAGER', email: 'suda@salepro.com', avatar: 'https://i.pravatar.cc/150?img=5', isDev: false, permissions: { dashboard: [1], marketing: [1, 2, 3, 4], crm: [1, 2] } },
    { id: 3, name: 'PHICHAMON DCC', position: 'SYSTEM ADMIN', email: 'fon2.phichamon@gmail.com', avatar: 'https://i.pravatar.cc/150?img=12', isDev: true, permissions: { '*': [1, 2, 3, 4] } },
    { id: 4, name: 'SARAH JENKINS', position: 'VP OF SALES', email: 'sarah.j@salepro.com', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200', isDev: false, permissions: { dashboard: [1], crm: [1, 2, 3, 4], pipeline: [1, 2, 3, 4] } }
  ]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.position.toLowerCase().includes(search.toLowerCase()));
  }, [users, search]);

  const currentData = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const toggleConfidentiality = (id: string) => setConfidentialityMap(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleExpand = (id: string) => setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));

  useEffect(() => { setCurrentPage(1); setSearch(''); }, [activeTab]);

  const saveUserPermissions = (userId: number, newPermissions: UserPermissionsData) => {
      setUsers(users.map(u => u.id === userId ? { ...u, permissions: newPermissions } : u));
  };

  return (
    <div className="sys-page-layout animate-fadeIn relative">
        <GuideTrigger onClick={() => setIsGuideOpen(true)} />
        <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
        <EditUserModal isOpen={editModal.isOpen} onClose={() => setEditModal({isOpen: false, user: null})} user={editModal.user} onSave={saveUserPermissions} />

        {/* Toolbar Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white flex items-center justify-center shadow-lg border border-[#a0b1dd] rounded-xl text-[#5686bb]">
              <Icons.Shield size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col justify-center leading-none">
              <h1 className="text-2xl font-black tracking-tight uppercase flex gap-2">
                <span className="text-[#003049]">USER</span>
                <span className="text-[#669bbc]">PERMISSIONS</span>
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-1.5 text-[#7188a2]">Security Control & Access Authorization</p>
            </div>
          </div>
          
          <div className="bg-white/60 p-1.5 rounded-[24px] inline-flex items-center shadow-sm border border-[#bcc4cf] backdrop-blur-md h-[46px]">
            <button onClick={() => setActiveTab('registry')} className={`px-5 h-full rounded-[16px] text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'registry' ? 'bg-[#003049] text-white shadow-[0_4px_10px_rgba(0,48,73,0.3)]' : 'text-[#7188a2] hover:text-[#003049] hover:bg-white/80'}`}>
              <Icons.Database size={14} className={activeTab === 'registry' ? 'text-[#f2b33d]' : ''} /> MODULE REGISTRY
            </button>
            <button onClick={() => setActiveTab('staff')} className={`px-5 h-full rounded-[16px] text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'staff' ? 'bg-[#003049] text-white shadow-[0_4px_10px_rgba(0,48,73,0.3)]' : 'text-[#7188a2] hover:text-[#003049] hover:bg-white/80'}`}>
              <Icons.Users size={14} className={activeTab === 'staff' ? 'text-[#669bbc]' : ''} /> STAFF ACCESS
            </button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
          <KpiCard label="Active Users" value={users.length} icon="users" colorAccent="#5686bb" colorValue="#003049" desc="Total Staffs" />
          <KpiCard label="System Modules" value={SYSTEM_MODULES.length} icon="layout-grid" colorAccent="#c1121f" colorValue="#003049" desc="Tracked Nodes" />
          <KpiCard label="Restricted Zones" value={Object.values(confidentialityMap).filter(v=>v).length} icon="lock" colorAccent="#f2b33d" colorValue="#ae1f23" desc="Locked Config" />
          <KpiCard label="Security Status" value="VERIFIED" icon="shield-check" colorAccent="#849e51" colorValue="#849e51" desc="System Audited" />
        </div>

        {activeTab === 'registry' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
            <div className="lg:col-span-4 space-y-6">
               <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#bcc4cf] flex flex-col gap-6 h-full">
                  <h3 className="text-[14px] font-black text-[#003049] uppercase tracking-widest flex items-center gap-2 border-b-2 border-[#e9e4dc] pb-3"><Icons.Lock size={18} className="text-[#c1121f]" /> CONFIDENTIALITY REGISTRY</h3>
                  <div className="p-5 bg-[#5686bb]/10 border border-[#5686bb]/20 rounded-xl">
                     <div className="flex items-center gap-2 text-[#5686bb] font-black text-[11px] uppercase tracking-widest mb-2"><Icons.Eye size={16}/> Public Access</div>
                     <p className="text-[12px] text-[#003049] font-bold leading-relaxed">เมนูทั่วไป: พนักงานทุกคนจะได้รับสิทธิ์ "Viewer" ทันทีที่เข้าสู่ระบบ</p>
                  </div>
                  <div className="p-5 bg-[#c1121f]/10 border border-[#c1121f]/20 rounded-xl">
                     <div className="flex items-center gap-2 text-[#c1121f] font-black text-[11px] uppercase tracking-widest mb-2"><Icons.Lock size={16}/> Confidential Area</div>
                     <p className="text-[12px] text-[#003049] font-bold leading-relaxed">พื้นที่จำกัด: จะถูกปิดกั้นสิทธิ์ "Viewer" พื้นฐาน ต้องระบุสิทธิ์เป็นรายบุคคลเท่านั้นจึงจะใช้งานได้</p>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#bcc4cf] flex flex-col h-full overflow-hidden">
              <div className="p-4 border-b border-[#bcc4cf] bg-[#f7f3ee]">
                  <h4 className="text-[14px] font-black uppercase text-[#003049] tracking-widest flex items-center gap-2"><Icons.List size={18} className="text-[#c1121f]"/> MASTER MODULE REGISTRY</h4>
              </div>
              <div className="p-6 space-y-2">
                 {SYSTEM_MODULES.map(mod => (
                   <div key={mod.id} className="space-y-1">
                      <div className={`flex items-center justify-between p-3 rounded-xl border transition-all ${confidentialityMap[mod.id] ? 'bg-[#c1121f]/5 border-[#c1121f]/30 shadow-sm' : 'bg-white border-[#bcc4cf] hover:border-[#a0b1dd] shadow-sm'}`}>
                         <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${confidentialityMap[mod.id] ? 'bg-[#c1121f] text-white' : 'bg-[#f7f3ee] text-[#5686bb] border border-[#e9e4dc]'}`}><LucideIcon name={mod.icon} size={18}/></div>
                            <div>
                               <div className="font-black text-[#003049] text-[13px] uppercase tracking-tight flex items-center gap-2 leading-none">
                                  {mod.label} 
                                  {confidentialityMap[mod.id] && <Icons.Lock size={14} className="text-[#c1121f]"/>}
                                  {mod.subItems && (
                                     <button onClick={() => toggleExpand(mod.id)} className="p-1 hover:bg-[#e9e4dc] rounded-md transition-transform text-[#5686bb]">
                                        <Icons.ChevronDown size={14} className={expandedModules[mod.id] ? 'rotate-180' : ''} />
                                     </button>
                                  )}
                               </div>
                               <div className="text-[10px] text-[#7188a2] font-bold uppercase tracking-widest mt-1 text-[9px]">{confidentialityMap[mod.id] ? 'Restricted Access' : 'Public Access'}</div>
                            </div>
                         </div>
                         <button onClick={()=>toggleConfidentiality(mod.id)} className={`p-2.5 rounded-xl transition-all shadow-sm ${confidentialityMap[mod.id] ? 'bg-[#c1121f] text-white' : 'bg-white text-[#7188a2] border border-[#bcc4cf] hover:text-[#003049] hover:bg-[#f7f3ee]'}`}>
                            {confidentialityMap[mod.id] ? <Icons.Lock size={16}/> : <Icons.Eye size={16}/>}
                         </button>
                      </div>

                      {expandedModules[mod.id] && mod.subItems && (
                         <div className="pl-12 pr-4 pb-2 space-y-1.5 mt-1.5 animate-fadeIn">
                            {mod.subItems.map(sub => (
                               <div key={sub.id} className="flex items-center justify-between p-2.5 rounded-xl border bg-white border-[#e9e4dc] shadow-sm hover:border-[#bcc4cf] transition-colors">
                                   <div className="flex items-center gap-2.5">
                                       <div className="w-1.5 h-1.5 rounded-full bg-[#5686bb]"></div>
                                       <span className="text-[11px] font-black text-[#003049] uppercase tracking-wider">{sub.label}</span>
                                   </div>
                               </div>
                            ))}
                         </div>
                      )}
                   </div>
                 ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[#bcc4cf] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col w-full animate-fadeIn">
            <div className="px-6 py-5 border-b border-[#bcc4cf] flex flex-col xl:flex-row justify-between items-center bg-[#f7f3ee] shrink-0 gap-4">
              <div className="flex items-center gap-3 w-full xl:w-auto">
                  <div className="flex bg-white border border-[#bcc4cf] p-1.5 rounded-xl shadow-sm h-11 shrink-0">
                    <button onClick={()=>setViewMode('list')} className={`px-6 h-full text-[11px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-2 ${viewMode==='list'?'bg-[#003049] text-white shadow-[0_2px_8px_rgba(0,48,73,0.3)]':'text-[#7188a2] hover:bg-[#f7f3ee]'}`}>
                        <Icons.List size={14}/> List View
                    </button>
                    <button onClick={()=>setViewMode('matrix')} className={`px-6 h-full text-[11px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-2 ${viewMode==='matrix'?'bg-[#003049] text-white shadow-[0_2px_8px_rgba(0,48,73,0.3)]':'text-[#7188a2] hover:bg-[#f7f3ee]'}`}>
                        <Icons.Grid size={14}/> Summary Matrix
                    </button>
                  </div>
              </div>
              <div className="relative w-full xl:w-[320px]">
                 <Icons.Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5686bb]" />
                 <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search personnel..." className="w-full pl-11 pr-4 py-2 text-[12px] border border-[#a0b1dd] rounded-full font-bold outline-none focus:border-[#003049] bg-white shadow-sm text-[#003049] h-11" />
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
               {viewMode === 'list' ? (
                 <table className="w-full text-left font-sans min-w-[1000px] border-collapse">
                    <thead className="bg-[#003049] border-b-[3px] border-[#c6a75e] text-white font-mono uppercase tracking-wider text-[11px] font-black">
                      <tr>
                        <th className="py-4 px-6 pl-8">Personnel Identity</th>
                        <th className="py-4 px-6">Position / Dept</th>
                        <th className="py-4 px-6">Email ID</th>
                        <th className="py-4 px-6 text-center">Type</th>
                        <th className="py-4 px-6 text-center pr-8">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {currentData.map(user => (
                        <tr key={user.id} className="hover:bg-[#f7f3ee]/80 transition-colors border-b border-[#e9e4dc] group">
                          <td className="py-3 px-6 pl-8">
                             <div className="flex items-center gap-4">
                               <img src={user.avatar} className="w-10 h-10 rounded-xl border border-[#bcc4cf] object-cover shadow-sm" />
                               <span className="font-black text-[#003049] text-[13px] uppercase">{user.name}</span>
                             </div>
                          </td>
                          <td className="py-3 px-6 font-bold text-[#5686bb] text-[12px] uppercase">{user.position}</td>
                          <td className="py-3 px-6 font-mono font-bold text-[#7188a2] text-[12px]">{user.email}</td>
                          <td className="py-3 px-6 text-center">
                             <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm inline-block ${user.isDev ? 'bg-[#f2b33d]/10 text-[#ae1f23] border-[#f2b33d]/50' : 'bg-[#f7f3ee] text-[#7188a2] border-[#bcc4cf]'}`}>
                               {user.isDev ? 'DEVELOPER' : 'GENERAL STAFF'}
                             </span>
                          </td>
                          <td className="py-3 px-6 pr-8">
                             <div className="flex justify-center">
                                 <button onClick={()=>{setEditModal({isOpen: true, user: user});}} className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#bcc4cf] text-[#5686bb] hover:border-[#a0b1dd] hover:text-[#003049] hover:bg-white transition-colors shadow-sm bg-[#f7f3ee]">
                                     <Icons.UserCog size={16}/>
                                 </button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               ) : (
                 <table className="w-full text-left font-sans min-w-[1200px] border-collapse">
                    <thead className="bg-[#003049] border-b-[3px] border-[#c6a75e] text-white font-mono uppercase tracking-wider text-[11px] font-black">
                       <tr className="sticky top-0 z-40">
                          <th className="py-4 px-6 border-r border-white/20 min-w-[280px] bg-[#003049]">Module / Sub-Module</th>
                          {users.map(u => (
                             <th key={u.id} className="py-3 px-4 text-center border-l border-white/20">
                                <div className="flex flex-col items-center gap-2">
                                   <img src={u.avatar} className="w-8 h-8 rounded-lg border border-[#5686bb] object-cover" />
                                   <span className="font-black text-[9px] text-[#e9e4dc] truncate w-20 tracking-wider">{u.name.split(' ')[0]}</span>
                                </div>
                             </th>
                          ))}
                       </tr>
                    </thead>
                    <tbody className="bg-white">
                       {SYSTEM_MODULES.map(mod => {
                          const isExpanded = expandedModules[`matrix_${mod.id}`];
                          return (
                             <React.Fragment key={mod.id}>
                                <tr className="hover:bg-[#f7f3ee] transition-colors border-b border-[#bcc4cf]">
                                   <td className="py-3 px-6 font-black text-[#003049] uppercase tracking-tight flex items-center gap-3 bg-[#f7f3ee]">
                                      {mod.subItems && (
                                         <button onClick={() => toggleExpand(`matrix_${mod.id}`)} className="p-1 hover:bg-[#e9e4dc] rounded-md transition-all text-[#5686bb]">
                                            <Icons.ChevronDown size={14} className={isExpanded ? 'rotate-180' : ''} />
                                         </button>
                                      )}
                                      <div className="flex items-center gap-2">
                                          <LucideIcon name={mod.icon} size={18} className="text-[#c1121f]"/> 
                                          {mod.label}
                                      </div>
                                   </td>
                                   {users.map(u => {
                                      const uPerms = u.permissions?.[mod.id] || [];
                                      const hasAccess = u.isDev || uPerms.length > 0 || u.permissions?.['*'];
                                      return (
                                         <td key={u.id} className="py-3 px-4 text-center border-l border-[#e9e4dc] shrink-0">
                                            <div className="flex justify-center gap-1">
                                               {u.isDev || u.permissions?.['*'] ? (
                                                  [1,2,3,4].map(lvl => <div key={lvl} className="w-5 h-5 rounded-md flex items-center justify-center border shadow-inner" style={{backgroundColor: PERMISSION_LEVELS[lvl].bg, borderColor: `${PERMISSION_LEVELS[lvl].color}30`}}><Icons.Check size={10} style={{color: PERMISSION_LEVELS[lvl].color}}/></div>)
                                               ) : hasAccess ? (
                                                  uPerms.map(lvl => {
                                                     const p = PERMISSION_LEVELS.find(pl => pl.level === lvl);
                                                     if (!p) return null;
                                                     return <div key={lvl} className="w-5 h-5 rounded-md flex items-center justify-center border shadow-inner" style={{backgroundColor: p.bg, borderColor: `${p.color}30`}}><LucideIcon name={p.icon} size={10} style={{color: p.color}}/></div>;
                                                  })
                                               ) : <span className="text-[#bcc4cf] font-mono text-[11px]">-</span>}
                                            </div>
                                         </td>
                                      )
                                   })}
                                </tr>
                                {mod.subItems && isExpanded && (
                                   mod.subItems.map(sub => (
                                      <tr key={sub.id} className="hover:bg-[#f7f3ee]/50 transition-all border-b border-[#e9e4dc]">
                                         <td className="py-2.5 px-6 pl-16 font-bold text-[#5686bb] uppercase text-[11px] border-r border-[#bcc4cf] bg-white">
                                            <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#a0b1dd]"></div> {sub.label}</div>
                                         </td>
                                         {users.map(u => {
                                            const subPerms = u.permissions?.[sub.id] || u.permissions?.[mod.id] || [];
                                            const hasAccess = u.isDev || subPerms.length > 0 || u.permissions?.['*'];
                                            return (
                                               <td key={u.id} className="py-2.5 px-4 text-center border-l border-[#e9e4dc]">
                                                  {hasAccess ? <div className="w-4 h-4 rounded bg-[#849e51]/10 flex items-center justify-center mx-auto border border-[#849e51]/30"><Icons.Check size={10} className="text-[#849e51]"/></div> : <span className="text-[#e9e4dc] font-mono">-</span>}
                                               </td>
                                            )
                                         })}
                                      </tr>
                                   ))
                                )}
                             </React.Fragment>
                          );
                       })}
                    </tbody>
                 </table>
               )}
            </div>
            
            {viewMode === 'list' && (
              <div className="p-4 bg-[#f7f3ee] border-t border-[#bcc4cf] flex justify-between items-center font-bold text-[#7188a2] uppercase tracking-widest shrink-0 font-mono text-[10px]">
                  <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                          <span>SHOW:</span>
                          <select 
                              value={itemsPerPage} 
                              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} 
                              className="bg-white border border-[#bcc4cf] rounded-md px-2 py-0.5"
                          >
                              {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                      </div>
                      <div>TOTAL {filteredUsers.length}</div>
                  </div>
                  <div className="flex items-center gap-4">
                      <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-1 border border-[#bcc4cf] bg-white rounded hover:bg-[#e9e4dc] disabled:opacity-30"><Icons.ChevronLeft size={16}/></button>
                      <span>PAGE {currentPage} OF {totalPages || 1}</span>
                      <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="p-1 border border-[#bcc4cf] bg-white rounded hover:bg-[#e9e4dc] disabled:opacity-30"><Icons.ChevronRight size={16}/></button>
                  </div>
              </div>
            )}
          </div>
        )}
    </div>
  );
}
