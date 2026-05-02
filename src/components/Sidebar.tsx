import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight,
  Lock,
  LogOut,
  ChevronDown,
  PackageCheck
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../context/AuthContext';
import { MENU_ITEMS, MenuItem } from '../config/menu';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

interface NavItemProps {
  key?: string | number;
  item: MenuItem; 
  depth?: number; 
  isCollapsed: boolean;
  expandedMenus: Record<string, boolean>;
  toggleMenu: (id: string) => void;
}

const NavItem = ({ item, depth = 0, isCollapsed, expandedMenus, toggleMenu }: NavItemProps) => {
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isExpanded = expandedMenus[item.id];
  const location = useLocation();
  
  const isChildActive = (items: any[]): boolean => {
    if (!items) return false;
    return items.some(child => 
      location.pathname === child.path || (child.subItems && isChildActive(child.subItems))
    );
  };
  
  const childActive = !!(hasSubItems && isChildActive(item.subItems!));
  const isActive = location.pathname === item.path;

  // Use the linkActive from NavLink for broader matching if needed, 
  // but strictly only if not a parent with sub-items
  const activeStyle = (isActive || childActive);

  if (depth === 0) {
    return (
      <div className="mb-1.5">
        <button 
          onClick={() => hasSubItems ? toggleMenu(item.id) : undefined}
          className="w-full"
        >
          <NavLink
            to={hasSubItems ? '#' : item.path}
            end={item.path === '/'}
            onClick={(e) => { if(hasSubItems) e.preventDefault(); }}
            className={({ isActive: linkActive }) => {
              const reallyActive = hasSubItems ? childActive : (isActive || linkActive);
              return twMerge(clsx(
                "group flex items-center transition-all duration-300 relative rounded-xl mx-auto py-3",
                reallyActive 
                  ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg" 
                  : childActive 
                    ? "text-sky-blue bg-primary/10 border border-primary/20" 
                    : "text-muted-slate hover:text-white hover:bg-white/5",
                isCollapsed ? "justify-center w-12 px-0" : "w-full px-3 justify-start"
              ));
            }}
          >
            <item.icon size={18} className={clsx("relative z-10 shrink-0", (activeStyle) && "scale-105")} />
            {!isCollapsed && (
              <div className="relative z-10 flex items-center justify-between flex-1 ml-3 overflow-hidden">
                <span className={clsx(
                  "text-[11.5px] tracking-wider uppercase text-left truncate",
                  activeStyle ? "font-black" : "font-bold opacity-85"
                )}>
                  {item.name}
                </span>
                {hasSubItems && (
                  <ChevronDown 
                    size={14} 
                    className={clsx("transition-transform duration-300", isExpanded ? "rotate-180" : "")} 
                  />
                )}
              </div>
            )}
            
            {item.isConfidential && (
              <Lock 
                size={10} 
                className={clsx("text-danger", isCollapsed ? "absolute top-1 right-1" : "ml-2")} 
              />
            )}
          </NavLink>
        </button>
        
        <AnimatePresence>
          {!isCollapsed && hasSubItems && isExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-black/5 rounded-xl mt-1"
            >
              {item.subItems!.map(sub => (
                <NavLink
                  key={sub.id}
                  to={sub.path || '#'}
                  className={({ isActive: subActive }) => twMerge(clsx(
                    "w-full flex items-center py-2.5 pr-3 pl-10 rounded-lg transition-all relative group mb-0.5",
                    subActive ? "text-white font-black bg-primary/40" : "text-muted-slate hover:text-sky-blue hover:bg-white/5 font-bold"
                  ))}
                >
                  <div className={clsx(
                    "w-1.5 h-1.5 rounded-full mr-2.5 transition-all",
                    location.pathname === sub.path ? "bg-accent scale-125" : "bg-muted-slate opacity-30"
                  )} />
                  <span className="flex-1 text-left text-[10.5px] uppercase tracking-wider truncate">{sub.name}</span>
                </NavLink>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
  return null;
};

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const { user, logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => ({ ...prev, [id]: !prev[id] }));
    if(isCollapsed) setIsCollapsed(false);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 96 : 300 }}
      className="relative flex h-screen flex-col bg-sidebar-gradient shadow-2xl z-20"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-primary-dark bg-primary text-white shadow-xl hover:scale-110 transition-transform focus:outline-none z-50"
      >
        <ChevronRight size={12} className={clsx("transition-transform duration-300", !isCollapsed && "rotate-180")} />
      </button>

      {/* Logo Area */}
      <div className="flex h-24 items-center justify-center border-b border-white/5 px-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg relative shrink-0 transform rotate-2">
            <PackageCheck size={28} className="text-white" strokeWidth={2.5} />
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-danger rounded-full border-2 border-primary-dark animate-pulse"></div>
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-white text-[26px] font-black tracking-tighter leading-none uppercase">
                PROCURE <span className="text-sky-blue">PRO</span>
              </h1>
              <p className="text-dusty-blue text-[8px] font-black uppercase tracking-[0.3em] mt-2 opacity-70">
                Strategic Sourcing
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
        {MENU_ITEMS.map((item) => {
          if (item.type === 'header') {
            return (
              <div key={item.id} className={clsx("pt-6 pb-2 px-3", isCollapsed ? "flex justify-center" : "")}>
                {isCollapsed ? (
                   <div className="w-6 h-px bg-primary/20" />
                ) : (
                  <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] opacity-80 pl-1">
                    {item.name}
                  </span>
                )}
              </div>
            );
          }
          return (
            <NavItem 
              key={item.id} 
              item={item} 
              isCollapsed={isCollapsed} 
              expandedMenus={expandedMenus} 
              toggleMenu={toggleMenu} 
            />
          );
        })}
      </nav>

      {/* User Profile Area */}
      {user && (
        <div className="p-4 border-t border-white/5 bg-black/10 shrink-0">
          <div className={clsx("flex items-center gap-3", isCollapsed && "justify-center")}>
            <div className="w-10 h-10 rounded-xl border border-primary/40 overflow-hidden shadow-md bg-white/5 shrink-0">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-white text-[11px] font-black tracking-tight leading-none truncate">{user.name}</p>
                <p className="text-sky-blue text-[9px] font-black uppercase tracking-widest mt-1.5">{user.role || 'LEAD DEVELOPER'}</p>
              </div>
            )}
            {!isCollapsed && (
              <button 
                onClick={logout} 
                className="text-danger opacity-70 hover:opacity-100 cursor-pointer transition-all ml-auto" 
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
          {isCollapsed && (
            <button 
              onClick={logout} 
              className="mt-4 w-full flex justify-center p-2 text-danger opacity-70 hover:opacity-100 transition-colors" 
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      )}
    </motion.aside>
  );
}
