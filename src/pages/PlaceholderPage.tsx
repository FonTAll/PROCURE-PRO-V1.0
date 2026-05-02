import React from 'react';
import { Database } from 'lucide-react';
import { motion } from 'motion/react';

interface PlaceholderPageProps {
  title: string;
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="sys-page-layout">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex min-h-[60vh] flex-col items-center justify-center sys-glass-card text-center"
      >
        <div className="w-16 h-16 rounded-full bg-primary-dark flex items-center justify-center mx-auto mb-6 shadow-xl border-2 border-primary">
          <Database size={28} className="text-sky-blue" />
        </div>
        <h2 className="sys-title-main mb-3">{title} Module</h2>
        <div className="max-w-md mx-auto">
          <p className="text-[11px] text-deep-purple font-bold leading-relaxed mb-8 uppercase tracking-widest opacity-80 px-8">
            Workspace "{title}" is loading real-time procurement data.
            Functionality will be available in the next system update.
          </p>
          <button 
            onClick={() => window.location.href = '/'} 
            className="sys-btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
