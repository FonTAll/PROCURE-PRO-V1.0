import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Lock, User as UserIcon, Loader2, ShoppingCart, ArrowRight, Phone, Mail, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const [employeeId, setEmployeeId] = useState('');
  const [idCard, setIdCard] = useState('');
  const [showIdCard, setShowIdCard] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('login', undefined, { employeeId, idCard });
      
      if (response.status === 'success' && response.data) {
        login(response.data);
        navigate(from, { replace: true });
      } else {
        setError(response.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-r from-[#0a1726] to-[#111f42] p-12 lg:flex">
        {/* Background Image (Shadow/Watermark effect) */}
        <div className="absolute inset-0 z-0 opacity-15 mix-blend-luminosity">
          <img 
            src="https://www.secureinfo.co.th/wp-content/uploads/2024/11/LINE_ALBUM_StockPhoto_123RF_%E0%B9%92%E0%B9%93%E0%B9%90%E0%B9%91%E0%B9%92%E0%B9%90_38-1024x576-1.png" 
            alt="Original Background"
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        
        {/* Abstract Background Shapes using the provided palette */}
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#952425] opacity-40 blur-[100px]"></div>
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-[#E3624A] opacity-30 blur-[100px]"></div>
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ab8a3b] opacity-20 blur-[80px]"></div>

        {/* Top Logo Area */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E3624A] shadow-lg">
              <ShoppingCart size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-wider">ENTERPRISE</span>
          </div>
        </div>

        {/* Main Branding Content */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-7xl font-black tracking-tight text-white leading-none">
              PROCURE
            </h1>
            <h2 className="mt-4 text-3xl font-semibold text-white/90 uppercase tracking-widest">
              Strategic Sourcing Hub
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
              Transform your procurement lifecycle with automated workflows, real-time supplier analytics, and strategic spend management.
            </p>
          </motion.div>

          {/* Decorative stats/features */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-12 grid grid-cols-2 gap-6 border-t border-white/10 pt-8"
          >
            <div>
              <div className="text-3xl font-bold text-[#E3624A]">15%</div>
              <div className="mt-1 text-sm text-white/60">Avg. Cost Savings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#E3624A]">4.0x</div>
              <div className="mt-1 text-sm text-white/60">ROI Generation</div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex w-full items-end justify-between">
          <div className="text-sm text-white/70">
            <div className="font-semibold text-white text-base mb-2">T All Intelligence</div>
            <div className="flex flex-wrap items-center gap-3">
              <span>Smart Solutions</span>
              <span className="text-white/30">|</span>
              <span className="flex items-center gap-1.5"><Phone size={14} /> 082-5695654</span>
              <span className="text-white/30">|</span>
              <span className="flex items-center gap-1.5"><Mail size={14} /> tallintelligence.ho@gmail.com</span>
            </div>
            <div className="mt-4 text-xs text-white/40 tracking-wider">
              &copy; 2026 ALL RIGHTS RESERVED
            </div>
          </div>

          {/* DEV Profile Badge */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-3 shadow-lg transition-all hover:bg-white/10"
          >
            <img 
              src="https://drive.google.com/thumbnail?id=1Z_fRbN9S4aA7OkHb3mlim_t60wIT4huY&sz=w400" 
              alt="T-DCC Developer" 
              className="h-11 w-11 shrink-0 rounded-full object-cover border-2 border-white/20 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col pr-2">
              <span className="text-sm font-bold text-white leading-tight">T-DCC Developer</span>
              <span className="text-xs font-semibold text-[#E3624A] leading-tight mt-0.5">Lead Developer</span>
              <span className="text-[10px] text-white/50 mt-1">tallintelligence.dcc@gmail.com</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="relative flex w-full items-center justify-center p-8 sm:p-12 lg:w-1/2">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center lg:text-left">
            {/* Mobile Logo (Visible only on small screens) */}
            <div className="mx-auto mb-8 flex h-12 w-12 items-center justify-center rounded-lg bg-[#111f42] lg:hidden">
              <ShoppingCart size={28} className="text-[#E3624A]" />
            </div>
            
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Procurement Center
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Strategic Sourcing & Enterprise purchasing.
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="employeeId" className="block text-sm font-medium leading-6 text-gray-900">
                  Staff Code
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="employeeId"
                    name="employeeId"
                    type="text"
                    required
                    className="block w-full rounded-lg border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#111f42] sm:text-sm sm:leading-6 transition-all"
                    placeholder="e.g., U001 or demo"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="idCard" className="block text-sm font-medium leading-6 text-gray-900">
                  ID Card Number
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="idCard"
                    name="idCard"
                    type={showIdCard ? "text" : "password"}
                    required
                    className="block w-full rounded-lg border-0 py-3 pl-10 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#111f42] sm:text-sm sm:leading-6 transition-all"
                    placeholder="13 digits or demo"
                    value={idCard}
                    onChange={(e) => setIdCard(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                    onClick={() => setShowIdCard(!showIdCard)}
                  >
                    {showIdCard ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-[#ef4444]/10 p-4 border border-[#ef4444]/20"
              >
                <p className="text-sm font-medium text-[#ef4444]">{error}</p>
              </motion.div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center gap-2 rounded-lg bg-[#111f42] px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#111f42]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111f42] disabled:opacity-70 transition-all"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Sign in to account
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-8 rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-600 border border-gray-100">
              <p className="font-medium text-gray-900 mb-1">Demo Credentials</p>
              <p>User: <span className="font-mono font-medium text-[#111f42]">demo</span> / Pass: <span className="font-mono font-medium text-[#111f42]">demo</span></p>
            </div>
          </form>
        </motion.div>

      </div>
    </div>
  );
}

