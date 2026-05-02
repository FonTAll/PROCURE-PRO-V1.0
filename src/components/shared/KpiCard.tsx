import React from 'react';
import * as Icons from 'lucide-react';
import { clsx } from 'clsx';

interface KpiCardProps {
  label: string;
  value: string | number;
  desc?: string;
  icon?: string;
  colorValue?: string;
  colorAccent?: string;
  className?: string;
}

import { LucideIcon } from './LucideIcon';

export function KpiCard({
  label,
  value,
  desc,
  icon = 'activity',
  colorValue = '#003049',
  colorAccent = '#5686bb',
  className
}: KpiCardProps) {
  return (
    <div className={clsx(
      "bg-white px-6 py-6 rounded-[20px] border border-silver/60 shadow-[0_4px_15px_rgba(86,134,187,0.05)] flex-1 min-w-[200px] relative overflow-hidden group hover:border-[#a0b1dd] transition-all min-h-[120px] flex flex-col justify-between",
      className
    )}>
        <div className="absolute -right-4 -bottom-6 opacity-[0.05] transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <LucideIcon name={icon} size={110} color={colorAccent} />
        </div>
        
        <div className="relative z-10 flex justify-between items-start w-full">
            <p className="text-[11px] font-black text-[#7188a2] uppercase tracking-[0.1em] drop-shadow-sm">{label}</p>
            <div className="w-10 h-10 rounded-[10px] border flex items-center justify-center shrink-0 shadow-sm transition-colors" style={{backgroundColor: `${colorAccent}10`, borderColor: `${colorAccent}20`, color: colorAccent}}>
                <LucideIcon name={icon} size={20} />
            </div>
        </div>

        <div className="relative z-10 mt-2 flex items-end justify-between">
            <p className="text-[30px] font-black leading-none font-mono tracking-tighter" style={{color: colorValue}}>
                {value}
            </p>
            {desc && <span className="text-[10px] font-bold text-dusty-blue uppercase tracking-widest">{desc}</span>}
        </div>
    </div>
  );
}
