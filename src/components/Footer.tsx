import React from 'react';
import { Award, PhoneCall, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="pt-4 pb-1 border-t border-silver/50 flex flex-col items-center gap-1 text-center">
      <div className="flex items-center gap-2">
        <Award size={14} className="text-primary font-black" />
        <span className="text-[10px] font-black text-primary-dark uppercase tracking-[0.3em] font-mono">
            PROCURE PRO • STRATEGIC SOURCING & ENTERPRISE PROCUREMENT SYSTEM
        </span>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-1 text-[10px] text-dusty-blue font-bold tracking-wide">
        <p>System powered by <span className="font-black text-primary-dark">T All Intelligence</span></p>
        <span className="hidden md:inline text-silver opacity-30">|</span>
        <p className="flex items-center gap-1.5"><PhoneCall size={12} className="text-pink-accent" /> 082-5695654, 091-5165999</p>
        <span className="hidden md:inline text-silver opacity-30">|</span>
        <p className="flex items-center gap-1.5"><Mail size={12} className="text-primary" /> tallintelligence.ho@gmail.com</p>
      </div>
    </footer>
  );
}
