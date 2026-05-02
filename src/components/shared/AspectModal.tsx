import React from 'react';
import { DraggableModal } from './DraggableModal';
import { Save, X } from 'lucide-react';

interface AspectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  title: string;
  children: React.ReactNode;
  footerContent?: React.ReactNode;
}

export function AspectModal({
  isOpen,
  onClose,
  onSave,
  title,
  children,
  footerContent
}: AspectModalProps) {
  return (
    <DraggableModal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col gap-6">
        <div className="flex-1">
          {children}
        </div>
        
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
          {footerContent ? (
            footerContent
          ) : (
            <>
              <button 
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-black text-slate-500 hover:text-slate-700 transition-colors uppercase tracking-widest"
              >
                Cancel
              </button>
              <button 
                onClick={onSave}
                className="px-8 py-2.5 bg-[#003049] hover:bg-[#2e395f] text-white text-sm font-black rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95 flex items-center gap-2 uppercase tracking-widest"
              >
                <Save size={16} />
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>
    </DraggableModal>
  );
}
