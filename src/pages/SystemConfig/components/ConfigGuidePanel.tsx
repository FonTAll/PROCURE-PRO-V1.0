import React from 'react';
import { createPortal } from 'react-dom';
import { LucideIcon } from '../../../components/shared/LucideIcon';
import * as Icons from 'lucide-react';

interface ConfigGuidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConfigGuidePanel({ isOpen, onClose }: ConfigGuidePanelProps) {
    if (typeof document === 'undefined') return null;
    return createPortal(
        <>
            <div className={`fixed inset-0 z-[190] bg-[#003049]/20 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}/>
            <div className={`fixed inset-y-0 right-0 z-[200] w-96 bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.08)] transform transition-transform duration-300 ease-out flex flex-col border-l border-white/60 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center p-6 border-b border-[#bcc4cf] bg-[#f7f3ee] text-[#003049] shrink-0">
                    <h3 className="font-extrabold flex items-center gap-2 uppercase tracking-tight font-mono text-[14px]"><LucideIcon name="settings-2" size={18} className="text-[#5686bb]"/> CONFIG GUIDE</h3>
                    <button onClick={onClose} className="p-1.5 text-[#7188a2] hover:text-[#c1121f] rounded-full transition-colors"><Icons.X size={20}/></button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6 text-[#7188a2] leading-relaxed text-[12px]">
                    <section>
                        <h4 className="text-sm font-black text-[#003049] mb-3 uppercase flex items-center gap-2 border-b border-[#bcc4cf] pb-2 font-mono">
                            <LucideIcon name="database" size={16} className="text-[#c1121f]"/> 1. Master Data
                        </h4>
                        <p className="text-[#2e2d2e]">หน้าจอนี้ใช้สำหรับตั้งค่าข้อมูลหลัก (Master Data) ที่จะถูกนำไปใช้งานเป็นตัวเลือก (Dropdown) ในหน้าต่างต่างๆ ของระบบ เช่น แผนก หมวดหมู่ แบรนด์ ลูกค้า หรือเทมเพลตสำหรับฟอร์ม PDF</p>
                    </section>
                    <section>
                        <h4 className="text-sm font-black text-[#003049] mb-3 uppercase flex items-center gap-2 border-b border-[#bcc4cf] pb-2 font-mono">
                            <LucideIcon name="barcode" size={16} className="text-[#c1121f]"/> 2. ID Formats
                        </h4>
                        <p className="text-[#2e2d2e]">ตั้งค่ารูปแบบการรันรหัสอัตโนมัติ (Auto-Generate ID) สำหรับแต่ละหน้าจอ เช่น รูปแบบของ Plan ID, SO Number, หรือ Problem ID โดยสามารถกำหนด Prefix, ตัวเลขรัน Sequence และรอบการ Reset (เช่น รีเซ็ตทุกวัน)</p>
                    </section>
                    <section>
                        <h4 className="text-sm font-black text-[#003049] mb-3 uppercase flex items-center gap-2 border-b border-[#bcc4cf] pb-2 font-mono">
                            <LucideIcon name="alert-triangle" size={16} className="text-[#c1121f]"/> 3. System Impact
                        </h4>
                        <p className="text-[#2e2d2e]">การแก้ไขหรือลบข้อมูลในส่วนนี้ อาจส่งผลกระทบต่อระบบงาน (Transactions) ที่ดึงข้อมูลเหล่านี้ไปใช้งานแล้ว ควรระมัดระวังในการลบข้อมูลหลักครับ</p>
                    </section>
                </div>
                <div className="p-6 bg-[#e9e4dc]/50 border-t border-[#bcc4cf] flex justify-end shadow-inner">
                    <button onClick={onClose} className="px-8 py-3 bg-[#5686bb] text-white font-black rounded-lg uppercase font-mono text-[11px] hover:bg-[#003049] transition-all shadow-sm">เข้าใจแล้ว (Got it)</button>
                </div>
            </div>
        </>, document.body
    );
}
