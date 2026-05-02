import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';
import { LucideIcon } from '../../../components/shared/LucideIcon';
import { User, UserPermissionsData } from '../types';
import { SYSTEM_MODULES, PERMISSION_LEVELS } from '../constants';
import Swal from 'sweetalert2';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (userId: number, newPermissions: UserPermissionsData) => void;
}

import { DraggableModal } from '../../../components/shared/DraggableModal';

export function EditUserModal({ isOpen, onClose, user, onSave }: EditUserModalProps) {
    const [modalStep, setModalStep] = useState(1);
    const [tempPerms, setTempPerms] = useState<UserPermissionsData>({});

    useEffect(() => {
        if (isOpen && user) {
            setModalStep(1);
            setTempPerms(JSON.parse(JSON.stringify(user.permissions || {})));
        }
    }, [isOpen, user]);

    if (!isOpen || !user) return null;

    const handleTogglePerm = (moduleId: string, level: number) => {
        if (user.isDev) return; 
        
        setTempPerms(prev => {
            const newPerms = { ...prev };
            if (!newPerms[moduleId]) newPerms[moduleId] = [];
            
            if (level === 0) {
                newPerms[moduleId] = [];
                return newPerms;
            }

            if (newPerms[moduleId].includes(level)) {
                newPerms[moduleId] = newPerms[moduleId].filter(l => l !== level);
            } else {
                newPerms[moduleId] = [...newPerms[moduleId], level].sort();
            }
            return newPerms;
        });
    };

    const handleSave = () => {
        onSave(user.id, tempPerms);
        Swal.fire({ 
            icon: 'success', 
            title: 'Permissions Updated', 
            text: `Rights for ${user.name} have been saved.`, 
            timer: 1500, 
            showConfirmButton: false,
            customClass: {
              popup: 'rounded-2xl border border-silver shadow-xl'
            }
        });
        onClose();
    };

    return (
        <DraggableModal 
          isOpen={isOpen} 
          onClose={onClose} 
          title="Personnel Access Configuration"
          width="max-w-[900px]"
          className="h-[85vh]"
        >
            <div className="flex flex-col h-full overflow-hidden bg-[#f7f3ee] -m-6 rounded-[24px]">
                <div className="px-8 py-5 flex justify-between items-center shrink-0 border-b border-[#bcc4cf] bg-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white border border-[#a0b1dd] flex items-center justify-center shadow-sm overflow-hidden p-0.5">
                            <img src={user.avatar} className="w-full h-full object-cover rounded-lg" alt={user.name} />
                        </div>
                        <div>
                            <h3 className="text-[18px] font-black text-[#003049] uppercase tracking-widest">{user.name}</h3>
                            <p className="text-[11px] font-bold text-[#5686bb] uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                                {user.isDev && <span className="bg-[#f2b33d] text-[#003049] px-1.5 py-0.5 rounded-[4px] text-[9px]">DEV</span>}
                                {user.position}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 flex overflow-hidden">
                    <div className="w-64 bg-white border-r border-[#bcc4cf] flex flex-col shrink-0 overflow-y-auto shadow-[2px_0_10px_rgba(0,0,0,0.02)] z-10">
                        <div className="px-6 py-5 text-[10px] font-black text-[#7188a2] uppercase tracking-widest border-b border-[#bcc4cf] bg-[#f7f3ee]">Configuration Steps</div>
                        <button onClick={()=>setModalStep(1)} className={`flex items-center gap-3 px-6 py-5 text-left transition-all border-l-[4px] w-full group ${modalStep===1?'border-[#c1121f] bg-[#f7f3ee] text-[#003049] shadow-[inset_0_-1px_0_#bcc4cf]':'border-transparent text-[#7188a2] hover:bg-[#f7f3ee]/50 hover:text-[#003049]'}`}>
                            <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${modalStep===1?'bg-[#003049] text-white shadow-md':'bg-white border border-[#bcc4cf] group-hover:border-[#a0b1dd]'}`}><Icons.ShieldCheck size={16} /></div>
                            <span className={`text-[11px] uppercase tracking-widest ${modalStep===1?'font-black':'font-bold'}`}>1. Area Visibility</span>
                        </button>
                        <button onClick={()=>setModalStep(2)} className={`flex items-center gap-3 px-6 py-5 text-left transition-all border-l-[4px] w-full group ${modalStep===2?'border-[#c1121f] bg-[#f7f3ee] text-[#003049] shadow-[inset_0_-1px_0_#bcc4cf]':'border-transparent text-[#7188a2] hover:bg-[#f7f3ee]/50 hover:text-[#003049]'}`}>
                            <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${modalStep===2?'bg-[#003049] text-white shadow-md':'bg-white border border-[#bcc4cf] group-hover:border-[#a0b1dd]'}`}><Icons.Settings2 size={16} /></div>
                            <span className={`text-[11px] uppercase tracking-widest ${modalStep===2?'font-black':'font-bold'}`}>2. Functional Rights</span>
                        </button>
                    </div>
                  
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
                        <div className="bg-white p-8 rounded-[20px] border border-[#bcc4cf] shadow-sm flex flex-col h-full animate-fadeIn">
                            <h4 className="text-[14px] font-black text-[#003049] uppercase tracking-widest mb-6 border-b-2 border-[#e9e4dc] pb-3">
                                {modalStep===1 ? 'Step 1: Module Access Rules' : 'Step 2: Specific Permissions'}
                            </h4>

                            {user.isDev && (
                                <div className="mb-6 p-4 bg-[#f2b33d]/10 border border-[#f2b33d]/30 rounded-xl flex items-center gap-3">
                                    <LucideIcon name="alert-triangle" className="text-[#db9e32]"/>
                                    <p className="text-[11px] font-bold text-[#003049]">This user is a Developer (Super Admin). They inherently have full access to all modules and functions.</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-4">
                                {SYSTEM_MODULES.map(mod => {
                                    const userHasMod = tempPerms[mod.id] && tempPerms[mod.id].length > 0;
                                    const isDev = user.isDev || tempPerms['*'];
                                    
                                    return (
                                        <div key={mod.id} className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${userHasMod || isDev ? 'bg-[#f7f3ee] border-[#bcc4cf] shadow-sm' : 'bg-white border-[#e9e4dc] hover:border-[#a0b1dd]'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm ${userHasMod || isDev ? 'bg-[#003049] text-white border-[#003049]' : 'bg-white text-[#7188a2] border-[#bcc4cf]'}`}><LucideIcon name={mod.icon} size={20}/></div>
                                                <span className="font-black text-[#003049] uppercase text-[12px] tracking-widest">{mod.label}</span>
                                            </div>
                                            <div className="flex gap-2 bg-white p-1.5 rounded-xl shadow-sm border border-[#bcc4cf]">
                                                {PERMISSION_LEVELS.filter(p => modalStep === 1 ? p.level <= 1 : p.level === 0 || p.level >= 2).map(p => {
                                                    const isSelected = isDev || (p.level === 0 && !userHasMod) || (tempPerms[mod.id] && tempPerms[mod.id].includes(p.level));
                                                    return (
                                                        <button 
                                                            key={p.level} 
                                                            onClick={() => handleTogglePerm(mod.id, p.level)}
                                                            disabled={user.isDev}
                                                            className={`h-10 px-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${isSelected ? 'bg-[#003049] border-[#003049] text-white shadow-md' : 'bg-white border-transparent text-[#7188a2] hover:bg-[#e9e4dc]'}`} 
                                                            title={p.label}
                                                        >
                                                            <LucideIcon name={p.icon} size={14} style={{color: isSelected ? p.bg : p.color}}/>
                                                            {isSelected && <span className="text-[10px] font-bold tracking-widest uppercase hidden sm:block">{p.label}</span>}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white border-t border-[#bcc4cf] flex justify-end gap-4 shrink-0 shadow-[0_-4px_15px_rgba(0,0,0,0.02)] z-20">
                    <button onClick={onClose} className="px-8 py-3 text-[#7188a2] hover:text-[#003049] font-black text-[11px] uppercase tracking-widest transition-colors border border-transparent rounded-xl bg-white hover:bg-[#f7f3ee]">CANCEL</button>
                    <button onClick={handleSave} className="px-10 py-3 bg-[#003049] hover:bg-[#2e395f] text-white font-black text-[11px] uppercase tracking-widest rounded-xl shadow-[0_4px_12px_rgba(0,48,73,0.3)] transition-all active:scale-95 flex items-center gap-2"><Icons.Save size={14}/> SAVE CHANGES</button>
                </div>
            </div>
        </DraggableModal>
    );
}
