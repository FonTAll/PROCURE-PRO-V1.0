import React from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';
import { ConfigTabId, Department, Category, Brand, Customer, PdfTemplate, IdFormat } from '../types';
import { AVAILABLE_PAGES } from '../constants';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ConfigTabId;
  editingItem: any;
  formData: any;
  setFormData: (data: any) => void;
  onSave: (e: React.FormEvent) => void;
  togglePageSelection: (page: string) => void;
}

import { DraggableModal } from '../../../components/shared/DraggableModal';

export function ConfigModal({
  isOpen,
  onClose,
  activeTab,
  editingItem,
  formData,
  setFormData,
  onSave,
  togglePageSelection
}: ConfigModalProps) {
  if (!isOpen) return null;

  return (
    <DraggableModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editingItem ? `EDIT ITEM` : `NEW ITEM`}
      width="max-w-[800px]"
      className="max-h-[90vh]"
    >
      <div className="flex flex-col h-full overflow-hidden bg-[#f7f3ee] -m-6 rounded-[24px]">
         <div className="px-8 py-5 flex justify-between items-center shrink-0 border-b border-[#bcc4cf] bg-white">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#a0b1dd] text-[#c1121f] flex items-center justify-center shadow-sm">
                    <Icons.Settings2 size={24} />
                </div>
                <div>
                    <h3 className="text-[18px] font-black text-[#003049] uppercase tracking-widest">{editingItem ? `EDIT ITEM` : `NEW ITEM`}</h3>
                    <p className="text-[11px] font-bold text-[#f2b33d] uppercase tracking-widest mt-0.5">{activeTab.toUpperCase()}</p>
                </div>
            </div>
         </div>
         
         <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
            <form id="configForm" onSubmit={onSave} className="bg-white p-8 rounded-[20px] border border-[#bcc4cf] shadow-sm grid grid-cols-2 gap-x-8 gap-y-6">
              <div className="col-span-2 border-b-2 border-[#e9e4dc] pb-3 mb-2">
                  <h4 className="text-[14px] font-black text-[#003049] uppercase tracking-widest">General Information</h4>
              </div>

              {activeTab === 'idFormats' ? (
                <>
                  <div className="col-span-2">
                    <label className="text-[10px] font-black text-[#7188a2] uppercase tracking-widest block mb-2">APPLICABLE PAGES <span className="text-[#c1121f]">*</span></label>
                    <div className="grid grid-cols-2 gap-3 bg-[#f7f3ee] p-5 rounded-xl border border-[#bcc4cf]">
                        {AVAILABLE_PAGES.map(page => (
                            <label key={page} className="flex items-center gap-3 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={formData.pages?.includes(page)} 
                                  onChange={() => togglePageSelection(page)}
                                  className="w-5 h-5 rounded border-[#a0b1dd] text-[#c1121f] focus:ring-[#c1121f]"
                                />
                                <span className="text-[12px] font-bold text-[#003049]">{page}</span>
                            </label>
                        ))}
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-[10px] font-black text-[#7188a2] uppercase tracking-widest block mb-2">PREFIX <span className="text-[#c1121f]">*</span></label>
                    <input 
                      type="text" required value={formData.prefix} onChange={(e) => setFormData({...formData, prefix: e.target.value.toUpperCase()})} 
                      className="w-full h-[46px] border border-[#bcc4cf] bg-[#f7f3ee] rounded-xl px-4 text-[13px] font-bold text-[#003049] font-mono outline-none focus:border-[#5686bb] focus:bg-white transition-all hover:border-[#a0b1dd] uppercase"
                      placeholder="e.g. PL, DF"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-[10px] font-black text-[#7188a2] uppercase tracking-widest block mb-2">FORMAT <span className="text-[#c1121f]">*</span></label>
                    <select 
                      required value={formData.format} onChange={(e) => setFormData({...formData, format: e.target.value})} 
                      className="w-full h-[46px] border border-[#bcc4cf] bg-[#f7f3ee] rounded-xl px-4 text-[13px] font-bold text-[#003049] font-mono outline-none focus:border-[#5686bb] focus:bg-white transition-all hover:border-[#a0b1dd] uppercase cursor-pointer"
                    >
                        <option value="YYMMDD">YYMMDD</option>
                        <option value="YYYYMMDD">YYYYMMDD</option>
                        <option value="YYMM">YYMM</option>
                        <option value="YYYYMM">YYYYMM</option>
                    </select>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-[10px] font-black text-[#7188a2] uppercase tracking-widest block mb-2">SEQUENCE DIGITS <span className="text-[#c1121f]">*</span></label>
                    <select 
                      required value={formData.sequenceDigit} onChange={(e) => setFormData({...formData, sequenceDigit: Number(e.target.value)})} 
                      className="w-full h-[46px] border border-[#bcc4cf] bg-[#f7f3ee] rounded-xl px-4 text-[13px] font-bold text-[#003049] outline-none focus:border-[#5686bb] focus:bg-white transition-all hover:border-[#a0b1dd] cursor-pointer"
                    >
                        <option value={2}>2 Digits (01, 02...)</option>
                        <option value={3}>3 Digits (001, 002...)</option>
                        <option value={4}>4 Digits (0001, 0002...)</option>
                        <option value={5}>5 Digits (00001...)</option>
                    </select>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-[10px] font-black text-[#7188a2] uppercase tracking-widest block mb-2">RESET FREQUENCY <span className="text-[#c1121f]">*</span></label>
                    <select 
                      required value={formData.reset} onChange={(e) => setFormData({...formData, reset: e.target.value})} 
                      className="w-full h-[46px] border border-[#bcc4cf] bg-[#f7f3ee] rounded-xl px-4 text-[13px] font-bold text-[#003049] outline-none focus:border-[#5686bb] focus:bg-white transition-all hover:border-[#a0b1dd] cursor-pointer"
                    >
                        <option value="Daily">Daily</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Yearly">Yearly</option>
                        <option value="Never">Never</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-black text-[#7188a2] uppercase tracking-widest block mb-2">NOTE / SPECIAL RULES</label>
                    <input 
                      type="text" value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})} 
                      className="w-full h-[46px] border border-[#bcc4cf] bg-[#f7f3ee] rounded-xl px-4 text-[13px] font-bold text-[#003049] outline-none focus:border-[#5686bb] focus:bg-white transition-all hover:border-[#a0b1dd]"
                      placeholder="e.g. Replacement format: PLYYMMDD/R.1"
                    />
                  </div>
                </>
              ) : activeTab === 'pdfTemplates' ? (
                <>
                  <div className="col-span-2">
                    <label className="text-[10px] font-black text-[#7188a2] uppercase tracking-widest block mb-2">FORM NAME <span className="text-[#c1121f]">*</span></label>
                    <input 
                      type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      className="w-full h-[46px] border border-[#bcc4cf] bg-[#f7f3ee] rounded-xl px-4 text-[13px] font-bold text-[#003049] outline-none focus:border-[#5686bb] focus:bg-white transition-all hover:border-[#a0b1dd]"
                      placeholder="e.g. DAR FORM..."
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-black text-[#7188a2] uppercase tracking-widest block mb-2">DEPARTMENT NAME <span className="text-[#c1121f]">*</span></label>
                    <input 
                      type="text" required value={formData.dept} onChange={(e) => setFormData({...formData, dept: e.target.value})} 
                      className="w-full h-[46px] border border-[#bcc4cf] bg-[#f7f3ee] rounded-xl px-4 text-[13px] font-bold text-[#003049] outline-none focus:border-[#5686bb] focus:bg-white transition-all hover:border-[#a0b1dd] uppercase"
                      placeholder="e.g. DC CENTER..."
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-[10px] font-black text-[#7188a2] uppercase tracking-widest block mb-2">FORM CODE <span className="text-[#c1121f]">*</span></label>
                    <input 
                      type="text" required value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} 
                      className="w-full h-[46px] border border-[#bcc4cf] bg-[#f7f3ee] rounded-xl px-4 text-[13px] font-bold text-[#003049] font-mono outline-none focus:border-[#5686bb] focus:bg-white transition-all hover:border-[#a0b1dd] uppercase"
                      placeholder="e.g. FM-DC01-01"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-[10px] font-black text-[#7188a2] uppercase tracking-widest block mb-2">REVISION <span className="text-[#c1121f]">*</span></label>
                    <input 
                      type="text" required value={formData.revision} onChange={(e) => setFormData({...formData, revision: e.target.value})} 
                      className="w-full h-[46px] border border-[#bcc4cf] bg-[#f7f3ee] rounded-xl px-4 text-[13px] font-bold text-[#003049] font-mono outline-none focus:border-[#5686bb] focus:bg-white transition-all hover:border-[#a0b1dd] uppercase"
                      placeholder="e.g. REV. 02"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="col-span-2">
                    <label className="text-[10px] font-black text-[#7188a2] uppercase tracking-widest block mb-2">NAME <span className="text-[#c1121f]">*</span></label>
                    <input 
                      type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      className="w-full h-[46px] border border-[#bcc4cf] bg-[#f7f3ee] rounded-xl px-4 text-[13px] font-bold text-[#003049] outline-none focus:border-[#5686bb] focus:bg-white transition-all hover:border-[#a0b1dd]"
                      placeholder="Enter name..."
                    />
                  </div>
                  {activeTab === 'departments' && (
                    <div className="col-span-2">
                      <label className="text-[10px] font-black text-[#7188a2] uppercase tracking-widest block mb-2">CODE <span className="text-[#c1121f]">*</span></label>
                      <input 
                        type="text" required value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} 
                        className="w-full h-[46px] border border-[#bcc4cf] bg-[#f7f3ee] rounded-xl px-4 text-[13px] font-bold text-[#003049] font-mono outline-none focus:border-[#5686bb] focus:bg-white transition-all hover:border-[#a0b1dd] uppercase"
                        placeholder="e.g. MGT, HR, IT..."
                      />
                    </div>
                  )}
                </>
              )}
            </form>
         </div>

         <div className="p-6 bg-white border-t border-[#bcc4cf] flex justify-end gap-4 shrink-0 shadow-[0_-4px_15px_rgba(0,0,0,0.02)] z-20">
            <button type="button" onClick={onClose} className="px-8 py-3 text-[#7188a2] hover:text-[#003049] font-black text-[11px] uppercase tracking-widest transition-colors border border-transparent rounded-xl bg-white hover:bg-[#f7f3ee]">CANCEL</button>
            <button type="submit" form="configForm" className="px-10 py-3 bg-[#003049] hover:bg-[#2e395f] text-white font-black text-[11px] uppercase tracking-widest rounded-xl shadow-[0_4px_12px_rgba(0,48,73,0.3)] transition-all active:scale-95 flex items-center gap-2"><Icons.Save size={14}/> SAVE RECORD</button>
         </div>
      </div>
    </DraggableModal>
  );
}
