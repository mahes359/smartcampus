import React from 'react';
import { Outlet } from 'react-router-dom';
import { GraduationCap, ShieldCheck } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950">
      {/* Brand Hero Panel */}
      <div className="w-full md:w-5/12 lg:w-4/12 bg-linear-to-br from-blue-700 via-indigo-800 to-slate-950 p-8 md:p-12 flex flex-col justify-between text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <GraduationCap className="w-7 h-7 text-blue-300" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight">SmartCampus</span>
              <span className="block text-[11px] text-blue-200 uppercase tracking-widest font-semibold">Multi-Tenant ERP</span>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Enterprise Campus Management
            </h2>
            <p className="mt-4 text-sm text-blue-100/80 leading-relaxed">
              Unified multi-tenant cloud platform connecting students, faculty, administrators, and campus facilities seamlessly across colleges.
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-12 pt-8 border-t border-white/10 flex items-center gap-2 text-xs text-blue-200">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Role-Based Access Control • 22 Integrated Microservices</span>
        </div>

        {/* Decorative background glows */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Auth Content Area */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
