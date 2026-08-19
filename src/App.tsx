import React, { useState } from 'react';
import { AppShell } from './components/layout/AppShell.tsx';
import { CURRENT_USER } from './data/mockSaaSData.ts';
import { NavigationTab } from './types/saas.ts';

export default function App(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <AppShell
      user={CURRENT_USER}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onOpenNewClientModal={() => console.log('Open new client modal')}
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white capitalize">{activeTab} View</h2>
        <p className="text-slate-400 text-sm">
          ClientPulse SaaS layout shell active.
        </p>
      </div>
    </AppShell>
  );
}
