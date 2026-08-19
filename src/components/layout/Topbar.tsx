import React, { useState } from 'react';
import {
  Search,
  Plus,
  Bell,
  Menu,
  CheckCircle,
  Clock,
  X,
} from 'lucide-react';

interface TopbarProps {
  onOpenMobileMenu: () => void;
  onOpenNewClientModal: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenMobileMenu,
  onOpenNewClientModal,
  searchQuery,
  onSearchChange,
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <header className="h-20 border-b border-slate-800/80 bg-[#090D16]/90 backdrop-blur-md px-6 flex items-center justify-between gap-4 sticky top-0 z-40">
      {/* Left: Mobile hamburger & Search bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search clients, projects, invoices..."
            className="w-full pl-10 pr-16 py-2.5 rounded-xl bg-[#101726]/80 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[11px] font-mono text-slate-400 bg-slate-800/60 px-1.5 py-0.5 rounded border border-slate-700/50 pointer-events-none">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* + New Client CTA Button */}
        <button
          type="button"
          onClick={onOpenNewClientModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Client</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2.5 rounded-xl bg-[#101726]/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
            aria-label="Notifications (3 unread)"
            aria-expanded={isNotificationsOpen}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-[10px] font-bold text-white flex items-center justify-center shadow-sm">
              3
            </span>
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 p-3 bg-[#121826] border border-slate-700/90 rounded-2xl shadow-2xl space-y-2 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Notifications
                </span>
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-slate-400 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Invoice #INV-050 Paid</p>
                    <p className="text-[11px] text-slate-400">
                      Global Ventures paid $7,750 via wire transfer.
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Invoice #INV-052 Overdue</p>
                    <p className="text-[11px] text-slate-400">
                      Apex Digital invoice for $2,000 is 3 days past due.
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start gap-2.5">
                  <Plus className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">New Project Onboarding</p>
                    <p className="text-[11px] text-slate-400">
                      Innovate Labs project pipeline initialized.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
