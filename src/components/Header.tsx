import React, { useState, useEffect } from 'react';
import { Bell, Globe } from 'lucide-react';

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 px-4 md:px-8 flex items-center justify-between z-10 shrink-0 transition-all duration-500 bg-transparent border-none">
      <div className="flex items-center gap-4">
        <div className="relative flex items-center justify-center group cursor-default">
          <div className="absolute inset-0 bg-primary blur-[18px] opacity-40 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
          <Globe size={26} strokeWidth={2} className="text-primary relative z-10 drop-shadow-[0_0_8px_rgba(83,114,186,0.6)] filter transition-transform duration-500 group-hover:rotate-[15deg]" />
        </div>
        <div>
          <h3 className="text-[15px] md:text-[20px] font-black text-primary-dark tracking-tight uppercase leading-[0.9]">
            GLOBAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-blue drop-shadow-sm">PROCUREMENT</span> HUB
          </h3>
          <p className="text-[9px] md:text-[10px] font-bold text-dusty-blue uppercase tracking-[0.25em] mt-1">
            END-TO-END STRATEGIC SOURCING & SUSTAINABLE QUALITY EXCELLENCE
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        {/* Time and Date Display */}
        <div className="hidden lg:flex items-center gap-3 bg-primary-dark text-white px-5 py-2 rounded-xl shadow-lg">
          <div className="text-right leading-none">
            <p className="text-[9px] font-black text-dusty-blue uppercase mb-1">
              {currentTime.toLocaleDateString('en-US', { weekday: 'short' })}
            </p>
            <p className="text-[12px] font-black tracking-wider">
              {currentTime.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
            </p>
          </div>
          <div className="w-[1.5px] h-8 bg-white/10 rounded-full"></div>
          <div className="text-[15px] font-black font-mono text-gold tracking-widest pl-1">
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
          </div>
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl bg-white border border-silver shadow-md hover:bg-bg-main transition-all group">
          <Bell size={18} className="text-primary-dark group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white shadow-sm animate-bounce"></span>
        </button>
      </div>
    </header>
  );
}
