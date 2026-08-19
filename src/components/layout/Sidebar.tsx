import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  Settings,
  ChevronDown,
  LogOut,
  User,
  Activity,
  X,
} from 'lucide-react';
import { NavigationTab, UserProfile } from '../../types/saas.ts';

interface SidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  user: UserProfile;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'invoices', label: 'Invoices', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  user,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const sidebarContent = (
    <aside className="w-64 h-full bg-[#0A0E1A] border-r border-slate-800/80 flex flex-col justify-between p-5 select-none">
      {/* Brand Header */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full rounded-full bg-[#090D16] flex items-center justify-center">
                <Activity className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-sans">
              ClientPulse
            </span>
          </div>

          {/* Close button for mobile drawer */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onTabChange(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#181D36] text-indigo-300 font-semibold border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-indigo-400' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile Card */}
      <div className="relative pt-4 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer text-left"
          aria-expanded={isUserMenuOpen}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
              {user.initials}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">
                {user.name}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {user.companyName}
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isUserMenuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* User Context Dropdown */}
        {isUserMenuOpen && (
          <div className="absolute bottom-16 left-2 right-2 p-1.5 bg-[#121826] border border-slate-700/80 rounded-xl shadow-2xl space-y-1 z-30 animate-fade-in text-xs">
            <button
              type="button"
              onClick={() => {
                onTabChange('settings');
                setIsUserMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Account Profile</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsUserMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <div className="hidden md:block shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </div>

      {/* Mobile drawer backdrop */}
      {isOpenMobile && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex animate-fade-in"
          onClick={onCloseMobile}
        >
          <div
            className="w-64 h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
