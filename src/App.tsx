import React from 'react';
import { AppShell } from './components/layout/AppShell.tsx';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard.tsx';
import { ProjectsView } from './components/projects/ProjectsView.tsx';
import { NewClientModal } from './components/clients/NewClientModal.tsx';
import { ClientDetailModal } from './components/clients/ClientDetailModal.tsx';
import { NewProjectModal } from './components/projects/NewProjectModal.tsx';
import { useSaaSStore } from './stores/useSaaSStore.ts';
import {
  CURRENT_USER,
  MOCK_KPI_METRICS,
  MOCK_BILLING_TRAJECTORY,
  MOCK_PROJECTS_BY_STATUS,
} from './data/mockSaaSData.ts';

export default function App(): React.JSX.Element {
  const {
    clients,
    projects,
    invoices,
    activeTab,
    searchQuery,
    isNewClientModalOpen,
    isNewProjectModalOpen,
    selectedClientDetail,
    setActiveTab,
    setSearchQuery,
    setNewClientModalOpen,
    setNewProjectModalOpen,
    setSelectedClientDetail,
    addClient,
    updateClientStatus,
    deleteClient,
    addProject,
    updateProjectStatus,
  } = useSaaSStore();

  return (
    <AppShell
      user={CURRENT_USER}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onOpenNewClientModal={() => setNewClientModalOpen(true)}
    >
      {activeTab === 'dashboard' && (
        <ExecutiveDashboard
          user={CURRENT_USER}
          kpis={MOCK_KPI_METRICS}
          billingData={MOCK_BILLING_TRAJECTORY}
          projectsDistribution={MOCK_PROJECTS_BY_STATUS}
          clients={clients}
          onSelectClient={setSelectedClientDetail}
          onUpdateClientStatus={updateClientStatus}
          onDeleteClient={deleteClient}
          onOpenNewClientModal={() => setNewClientModalOpen(true)}
          onNavigateToProjects={() => setActiveTab('projects')}
        />
      )}

      {activeTab === 'clients' && (
        <div className="space-y-6">
          <ExecutiveDashboard
            user={CURRENT_USER}
            kpis={MOCK_KPI_METRICS}
            billingData={MOCK_BILLING_TRAJECTORY}
            projectsDistribution={MOCK_PROJECTS_BY_STATUS}
            clients={clients}
            onSelectClient={setSelectedClientDetail}
            onUpdateClientStatus={updateClientStatus}
            onDeleteClient={deleteClient}
            onOpenNewClientModal={() => setNewClientModalOpen(true)}
            onNavigateToProjects={() => setActiveTab('projects')}
          />
        </div>
      )}

      {activeTab === 'projects' && (
        <ProjectsView
          projects={projects}
          onOpenNewProjectModal={() => setNewProjectModalOpen(true)}
          onUpdateProjectStatus={updateProjectStatus}
        />
      )}

      {activeTab !== 'dashboard' &&
        activeTab !== 'clients' &&
        activeTab !== 'projects' && (
          <div className="p-8 rounded-2xl bg-[#101726]/80 border border-slate-800 space-y-4">
            <h3 className="text-2xl font-bold text-white capitalize">
              {activeTab} Management
            </h3>
            <p className="text-slate-400 text-sm">
              This module will be rendered with full functionality.
            </p>
          </div>
        )}

      {/* Modals */}
      <NewClientModal
        isOpen={isNewClientModalOpen}
        onClose={() => setNewClientModalOpen(false)}
        onSubmitClient={addClient}
      />

      <ClientDetailModal
        client={selectedClientDetail}
        projects={projects}
        invoices={invoices}
        onClose={() => setSelectedClientDetail(null)}
      />

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        clients={clients}
        onClose={() => setNewProjectModalOpen(false)}
        onSubmitProject={addProject}
      />
    </AppShell>
  );
}
