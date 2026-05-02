import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { LucideIcon } from '../../components/shared/LucideIcon';
import { KpiCard } from '../../components/shared/KpiCard';
import { motion, AnimatePresence } from 'motion/react';
import Swal from 'sweetalert2';

import { SYSTEM_MODULES } from '../UserPermissions/constants';

interface ModuleState {
    id: string;
    label: string;
    icon: string;
    status: boolean;
    subItems?: { id: string; label: string; status: boolean }[];
}

const INITIAL_MODULES: ModuleState[] = SYSTEM_MODULES.map(mod => ({
    id: mod.id,
    label: mod.label,
    icon: mod.icon,
    status: true,
    subItems: mod.subItems?.map(sub => ({
        id: sub.id,
        label: sub.label,
        status: true
    }))
}));

export default function DevPermit() {
    const [modules, setModules] = useState<ModuleState[]>(INITIAL_MODULES);
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const toggleExpand = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

    const handleToggle = (id: string, subId?: string) => {
        setModules(prev => prev.map(mod => {
            if (mod.id === id) {
                if (subId) {
                    return {
                        ...mod,
                        subItems: mod.subItems?.map(sub => 
                            sub.id === subId ? { ...sub, status: !sub.status } : sub
                        )
                    };
                }
                return { ...mod, status: !mod.status };
            }
            return mod;
        }));
    };

    const handleSave = () => {
        Swal.fire({
            icon: 'success',
            title: 'Configuration Saved',
            text: 'System module visibility has been updated successfully.',
            timer: 2000,
            showConfirmButton: false,
            customClass: {
                popup: 'rounded-3xl border border-silver'
            }
        });
    };

    const filteredModules = modules.filter(m => 
        m.label.toLowerCase().includes(search.toLowerCase())
    );

    const activeCount = modules.filter(m => m.status).length;
    const restrictedCount = modules.filter(m => !m.status).length;

    return (
        <div className="sys-page-layout animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white flex items-center justify-center shadow-xl border border-slate-200 rounded-2xl text-slate-800">
                        <Icons.Settings size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">DEV <span className="text-[#c1121f]">PERMIT</span></h1>
                            <span className="bg-[#c1121f]/10 text-[#c1121f] text-[10px] font-black px-2 py-0.5 rounded-full tracking-widest border border-[#c1121f]/20 uppercase">BETA</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">System Module Visibility Control</p>
                    </div>
                </div>
                
                <button 
                    onClick={handleSave}
                    className="px-8 py-3 bg-[#003049] hover:bg-slate-800 text-white text-[11px] font-black rounded-2xl shadow-xl shadow-blue-900/20 transition-all active:scale-95 flex items-center gap-3 uppercase tracking-widest"
                >
                    <Icons.Save size={16} />
                    Save Configuration
                </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <KpiCard 
                    label="Active Modules" 
                    value={`${activeCount} / ${modules.length}`} 
                    icon="layout-grid" 
                    colorAccent="#5686bb"
                    desc="Currently visible components"
                />
                <KpiCard 
                    label="Restricted Visibility" 
                    value={restrictedCount} 
                    icon="lock" 
                    colorAccent="#c1121f"
                    desc="Modules hidden from sidebar"
                />
            </div>

            {/* List Container */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[#bcc4cf] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
                <div className="p-4 border-b border-[#bcc4cf] bg-[#f7f3ee] flex flex-col md:flex-row justify-between items-center gap-4">
                    <h3 className="text-[14px] font-black text-[#003049] uppercase tracking-widest flex items-center gap-2"><Icons.List size={18} className="text-[#c1121f]"/> MODULE TOGGLE LIST</h3>
                    <div className="relative w-full md:w-96">
                        <Icons.Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search modules..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-[#bcc4cf] rounded-xl text-[12px] font-bold text-[#003049] outline-none focus:border-[#5686bb] focus:ring-2 focus:ring-[#5686bb]/20 transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="p-6 space-y-2">
                    {filteredModules.map(mod => (
                        <div key={mod.id} className="group">
                            <div className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-between ${mod.status ? 'bg-white border-[#bcc4cf] shadow-sm hover:border-[#a0b1dd]' : 'bg-slate-50 border-[#e9e4dc] opacity-70'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-[1.02] ${mod.status ? 'bg-[#f7f3ee] text-[#5686bb] border border-[#e9e4dc]' : 'bg-slate-200 text-slate-400 border-transparent'}`}>
                                        <LucideIcon name={mod.icon} size={18} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-[13px] font-black text-[#003049] tracking-tight uppercase leading-none">{mod.label}</h4>
                                            {mod.subItems && (
                                                <button 
                                                    onClick={() => toggleExpand(mod.id)}
                                                    className={`p-0.5 hover:bg-slate-100 rounded-md transition-all ${expanded[mod.id] ? 'rotate-180 bg-slate-100' : ''}`}
                                                >
                                                    <Icons.ChevronDown size={14} className="text-[#7188a2]" />
                                                </button>
                                            )}
                                        </div>
                                        <div className="text-[9px] text-[#7188a2] font-bold uppercase tracking-widest mt-1">{mod.status ? 'Active' : 'Disabled'}</div>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => handleToggle(mod.id)}
                                    className={`w-10 h-5 rounded-full p-0.5 transition-all duration-300 flex items-center ${mod.status ? 'bg-[#10b981]' : 'bg-slate-300'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${mod.status ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>

                            <AnimatePresence>
                                {expanded[mod.id] && mod.subItems && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden pl-12 pr-4 pb-2 space-y-1.5 mt-1.5"
                                    >
                                        <div className="border-l-[1.5px] border-[#e9e4dc] pl-3 space-y-1.5">
                                            {mod.subItems.map(sub => (
                                                <div key={sub.id} className={`p-2.5 bg-white border ${sub.status ? 'border-[#e9e4dc]' : 'border-dashed border-[#e9e4dc] opacity-70'} rounded-xl shadow-sm hover:border-[#bcc4cf] transition-all flex items-center justify-between`}>
                                                    <div className="flex items-center gap-2.5">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${sub.status ? 'bg-[#5686bb]' : 'bg-slate-300'}`}></div>
                                                        <span className="text-[11px] font-black text-[#003049] uppercase tracking-wider">{sub.label}</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleToggle(mod.id, sub.id)}
                                                        className={`w-8 h-4 rounded-full p-0.5 transition-all duration-300 flex items-center ${sub.status ? 'bg-[#10b981]' : 'bg-slate-200'}`}
                                                    >
                                                        <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-300 ${sub.status ? 'translate-x-4' : 'translate-x-0'}`} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
