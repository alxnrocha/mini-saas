import React, { useState } from 'react';
import { AppShell } from './components/layout/AppShell.tsx';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard.tsx';
import {
  CURRENT_USER,
  MOCK_KPI_METRICS,
  MOCK_BILLING_TRAJECTORY,
  MOCK_PROJECTS_BY_STATUS,
} from './data/mockSaaSData.ts';
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
      {activeTab === 'dashboard' && (
        <ExecutiveDashboard
          user={CURRENT_USER}
          kpis={MOCK_KPI_METRICS}
          billingData={MOCK_BILLING_TRAJECTORY}
          projectsDistribution={MOCK_PROJECTS_BY_STATUS}
          onNavigateToProjects={() => setActiveTab('projects')}
        />
      )}

      {activeTab !== 'dashboard' && (
        <div className="p-8 rounded-2xl bg-[#101726]/80 border border-slate-800 space-y-4">
          <h3 className="text-2xl font-bold text-white capitalize">
            {activeTab} Management
          </h3>
          <p className="text-slate-400 text-sm">
            This module will be fully populated in Milestone 3.
          </p>
        </div>
      )}
    </AppShell>
  );
}
