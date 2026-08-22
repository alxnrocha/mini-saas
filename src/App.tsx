import { ProjectBadge } from './components/ProjectBadge';
import React from 'react';
import { AppShell } from './components/layout/AppShell.tsx';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard.tsx';
import { ProjectsView } from './components/projects/ProjectsView.tsx';
import { InvoicesView } from './components/invoices/InvoicesView.tsx';
import { NewClientModal } from './components/clients/NewClientModal.tsx';
import { ClientDetailModal } from './components/clients/ClientDetailModal.tsx';
import { NewProjectModal } from './components/projects/NewProjectModal.tsx';
import { NewInvoiceModal } from './components/invoices/NewInvoiceModal.tsx';
import { useSaaSStore } from './stores/useSaaSStore.ts';
import {
  CURRENT_USER,
  MOCK_KPI_METRICS,
  MOCK_BILLING_TRAJECTORY,
  MOCK_PROJECTS_BY_STATUS,
} from './data/mockSaaSData.ts';
import { ShieldCheck, Database, Key } from 'lucide-react';

export default function App(): React.JSX.Element {
  const {
    clients,
    projects,
    invoices,
    activeTab,
    searchQuery,
    isNewClientModalOpen,
    isNewProjectModalOpen,
    isNewInvoiceModalOpen,
    selectedClientDetail,
    setActiveTab,
    setSearchQuery,
    setNewClientModalOpen,
    setNewProjectModalOpen,
    setNewInvoiceModalOpen,
    setSelectedClientDetail,
    addClient,
    updateClientStatus,
    deleteClient,
    addProject,
    updateProjectStatus,
    addInvoice,
    markInvoiceAsPaid,
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
      {/* 1. Dashboard View */}
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

      {/* 2. Clients View */}
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

      {/* 3. Projects View */}
      {activeTab === 'projects' && (
        <ProjectsView
          projects={projects}
          onOpenNewProjectModal={() => setNewProjectModalOpen(true)}
          onUpdateProjectStatus={updateProjectStatus}
        />
      )}

      {/* 4. Invoices View */}
      {activeTab === 'invoices' && (
        <InvoicesView
          invoices={invoices}
          onOpenNewInvoiceModal={() => setNewInvoiceModalOpen(true)}
          onMarkAsPaid={markInvoiceAsPaid}
        />
      )}

      {/* 5. Settings View */}
      {activeTab === 'settings' && (
        <div className="space-y-8 animate-fade-in">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Workspace & Security Settings
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Manage your single-tenant SaaS instance, database synchronization, and credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#101726]/80 border border-slate-800 space-y-4">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 w-fit">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Single-Tenant Instance</h3>
              <p className="text-xs text-slate-400">
                Isolated PostgreSQL 17 database cluster running on Docker Compose container.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Cluster Healthy
                </span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#101726]/80 border border-slate-800 space-y-4">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 w-fit">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Prisma 6 ORM Sync</h3>
              <p className="text-xs text-slate-400">
                Schema migrations and database indexes synchronized across all 4 tables.
              </p>
              <div className="pt-2">
                <span className="text-xs font-mono text-slate-300">
                  Schema: <code className="text-purple-400">prisma/schema.prisma</code>
                </span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#101726]/80 border border-slate-800 space-y-4">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Admin Credentials</h3>
              <p className="text-xs text-slate-400">
                Current admin session: <strong>{CURRENT_USER.name}</strong> ({CURRENT_USER.email}).
              </p>
              <div className="pt-2">
                <span className="text-xs text-slate-500">
                  Company: {CURRENT_USER.companyName}
                </span>
              </div>
            </div>
          </div>
              <ProjectBadge />
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

      <NewInvoiceModal
        isOpen={isNewInvoiceModalOpen}
        clients={clients}
        onClose={() => setNewInvoiceModalOpen(false)}
        onSubmitInvoice={addInvoice}
      />
    </AppShell>
  );
}
