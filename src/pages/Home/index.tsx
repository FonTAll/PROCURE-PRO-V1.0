import React from 'react';
import { 
  Zap,
  ClipboardList,
  DollarSign,
  TrendingDown,
  ShieldCheck,
  Container,
  BarChart2,
  AlertCircle,
  PackageCheck,
  Calendar,
  Award,
  PhoneCall,
  Mail,
  ShoppingCart,
  Truck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';

// --- Shared Components ---
const GlassCard = ({ children, className = '', hoverEffect = true }: { children: React.ReactNode, className?: string, hoverEffect?: boolean }) => (
    <div className={clxs(`sys-glass-card ${className}`, !hoverEffect && "hover:none")}>
        {children}
    </div>
);

const HeroBanner = () => {
    const bgImage = "https://framerusercontent.com/images/pbAYj2wTOCEJ7wzRlBffReemh0.jpeg";
    return (
      <div className="relative w-full h-[180px] md:h-[220px] rounded-3xl overflow-hidden shadow-xl mb-4 group bg-primary-dark">
        <div className="absolute inset-0 transform transition-transform duration-[2000ms] group-hover:scale-105">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{ backgroundImage: `url(${bgImage})`, backgroundPosition: 'center 35%' }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary-dark/30 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-center p-6 md:px-10 w-full md:w-3/4 lg:w-2/3">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={12} className="text-gold animate-pulse" />
            <span className="text-[9px] text-gold font-bold uppercase tracking-widest">Enterprise Strategic Sourcing</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight mb-2 drop-shadow-md">
            Procurement Intelligence
          </h2>
          <div className="pl-3 border-l-4 border-gold mb-4">
            <p className="text-white/90 text-[11px] md:text-xs font-semibold italic tracking-wide max-w-lg">
              "Building resilient supply chains with data-driven evaluation and cost-efficient procurement workflows."
            </p>
          </div>
          <div className="flex gap-2 text-white">
            <button className="sys-btn-accent">
              <ClipboardList size={12} /> Urgent Approvals
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-5 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all">
              Risk Overview
            </button>
          </div>
        </div>
      </div>
    );
};

interface MetricCardProps {
  key?: string | number;
  label: string;
  val: string;
  icon: any;
  color: string;
  desc: string;
}

const MetricCard = ({ label, val, icon: Icon, color, desc }: MetricCardProps) => (
  <div className="bg-white/90 rounded-2xl p-4 shadow-sm border border-silver/50 relative overflow-hidden group h-full transition-all hover:shadow-md">
    <div className="absolute -right-6 -bottom-6 opacity-[0.1] transform rotate-12 group-hover:scale-110 transition-all duration-700 pointer-events-none z-0">
        <Icon size={100} style={{color: color}} />
    </div>
    <div className="relative z-10 flex justify-between items-start">
        <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-dusty-blue uppercase tracking-wider opacity-90 truncate">{label}</p>
            <h4 className="text-2xl font-black tracking-tight mt-0.5 text-primary-dark">{val}</h4>
            {desc && (
                <p className="text-[9px] text-deep-purple font-bold mt-2 flex items-center gap-1.5 bg-white/40 w-fit px-2 py-0.5 rounded-full border border-black/5">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{backgroundColor: color}}></span>
                    {desc}
                </p>
            )}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white backdrop-blur-md shadow-sm" 
            style={{backgroundColor: color + '15'}}>
            <Icon size={18} style={{color: color}} />
        </div>
    </div>
  </div>
);

const StrategicSpendAnalysis = () => {
  const data = [
    { name: "Direct Materials", actual: 64, color: '#5372ba' },
    { name: "Indirect Spend", actual: 20, color: '#aa7095' },
    { name: "Capex Projects", actual: 16, color: '#d1b028' },
  ];
  return (
    <div className="lg:col-span-2 bg-gradient-to-br from-white to-silver/20 sys-card-base border-silver/30">
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h2 className="text-base font-black text-primary-dark flex items-center gap-2 uppercase tracking-tight">
            <BarChart2 size={16} className="text-primary" /> Strategic Spend Analysis
        </h2>
        <span className="text-[8px] text-white font-black bg-primary-dark px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Real-time</span>
      </div>
      <div className="space-y-5 relative z-10">
        {data.map((item, i) => (
            <div key={i} className="flex items-center gap-4 group/bar">
              <div className="w-32 text-[10px] font-black text-dark-slate uppercase truncate tracking-tight">{item.name}</div>
              <div className="flex-1 h-3 rounded-full relative flex items-center bg-silver/30 shadow-inner overflow-hidden">
                <div className="h-full transition-all duration-1000 relative z-10 rounded-full"
                  style={{ width: `${item.actual}%`, background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)` }} />
              </div>
              <div className="w-10 text-right">
                <span className="text-[11px] font-black text-primary-dark font-mono">{item.actual}%</span>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
};

const CriticalActions = () => (
  <div className="bg-gradient-to-b from-white to-silver/20 sys-card-base border-silver/30">
    <h2 className="text-base font-black text-primary-dark mb-4 flex items-center gap-2 uppercase tracking-tight">
        <AlertCircle size={16} className="text-danger" /> Critical Action
    </h2>
    <div className="space-y-3 relative z-10">
        {[
          { title: "Review Supplier SCAR #22", type: "Quality Alert", icon: ShieldCheck, urgent: true, color: 'text-danger', bg: 'bg-danger/10' },
          { title: "VAT Filing - March 2024", type: "Compliance", icon: DollarSign, urgent: true, color: 'text-warning', bg: 'bg-warning/10' },
          { title: "Stock Warning: Item A-102", type: "Inventory", icon: PackageCheck, urgent: false, color: 'text-sky-blue', bg: 'bg-sky-blue/10' },
        ].map((task, i) => (
          <div key={i} className="p-3 bg-white/70 rounded-xl border border-silver/20 flex gap-3 items-start hover:bg-white transition-all shadow-sm">
            <div className={clxs(`p-2 rounded-lg shrink-0 ${task.bg} ${task.color}`)}>
                <task.icon size={12}/>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black text-primary-dark tracking-tight truncate uppercase">{task.title}</p>
                <div className="flex justify-between items-center mt-1">
                    <p className="text-[9px] text-dusty-blue font-bold uppercase tracking-tight">{task.type}</p>
                    {task.urgent && <span className="text-[8px] font-black text-danger uppercase animate-pulse">Critical</span>}
                </div>
            </div>
          </div>
        ))}
    </div>
    <button className="w-full mt-6 py-3.5 bg-primary-dark text-white text-[10px] font-bold uppercase rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 tracking-widest hover:bg-deep-navy">
        <Calendar size={14} /> Schedule Meeting
    </button>
  </div>
);

import { KpiCard } from '../../components/shared/KpiCard';

const MOCK_STATS = [
    { label: 'Total Spend (YTD)', value: '$4.82M', sub: '-4.2% vs Budget', icon: 'dollar-sign', color: '#5686bb' },
    { label: 'Active POs', value: '142', sub: '24 Pending Delivery', icon: 'container', color: '#5a4e70' },
    { label: 'Cost Savings', value: '$315K', sub: 'Negotiated Discounts', icon: 'trending-down', color: '#596c33' },
    { label: 'Vendor SLA', value: '98.2%', sub: 'On-time Performance', icon: 'shield-check', color: '#ce870a' },
];

import { clsx as clxs } from 'clsx';

export default function Home() {
  const { user } = useAuth();
  
  return (
    <div className="sys-page-layout animate-fadeIn">
        {/* Top Color Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary-dark to-accent rounded-full mb-8 shadow-lg shadow-primary/10 opacity-90" />

        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
            <div>
                <h1 className="text-2xl md:text-4xl font-black text-primary-dark tracking-tighter uppercase leading-none">
                    Morning, <span className="text-primary">{user?.name || 'T-DCC Developer'}!</span>
                </h1>
                <p className="text-dusty-blue text-[10px] font-black uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                    <Zap size={14} className="text-accent" /> Compliance Rating: <span className="text-success">Verified (98.5%)</span>
                </p>
            </div>
            <div className="flex gap-4">
                <button className="sys-btn-secondary">
                    <Truck size={16} className="text-primary" /> Tracking
                </button>
                <button className="sys-btn-primary">
                    <ShoppingCart size={16} /> New PR
                </button>
            </div>
        </div>

        <HeroBanner />

        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_STATS.map((stat, idx) => (
                <div key={idx}>
                  <KpiCard 
                    label={stat.label} 
                    value={stat.value} 
                    desc={stat.sub} 
                    icon={stat.icon} 
                    colorAccent={stat.color} 
                  />
                </div>
            ))}
        </div>

        {/* Analysis and Action Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StrategicSpendAnalysis />
            <CriticalActions />
        </div>
    </div>
  );
}
