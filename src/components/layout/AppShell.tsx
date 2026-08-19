import React, { useState } from 'react';
import { Sidebar } from './Sidebar.tsx';
import { Topbar } from './Topbar.tsx';
import { NavigationTab, UserProfile } from '../../types/saas.ts';

interface AppShellProps {
  user: UserProfile;
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenNewClientModal: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  user,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  onOpenNewClientModal,
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        user={user}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Topbar
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenNewClientModal={onOpenNewClientModal}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
};
