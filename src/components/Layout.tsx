import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import SecurityGuard from './SecurityGuard';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <SecurityGuard>
      <div className="flex h-screen w-full bg-vibrant-gradient overflow-hidden">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
            <div className="flex-1">
              <Outlet />
            </div>
            <div className="w-full max-w-[1500px] mx-auto px-4 md:px-8 py-4 shrink-0">
               <Footer />
            </div>
          </main>
        </div>
      </div>
    </SecurityGuard>
  );
}
