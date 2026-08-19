import { create } from 'zustand';
import {
  ClientAccount,
  ProjectItem,
  InvoiceItem,
  ClientStatus,
  ProjectStatus,
  NavigationTab,
} from '../types/saas.ts';
import {
  MOCK_CLIENTS,
  MOCK_PROJECTS,
  MOCK_INVOICES,
} from '../data/mockSaaSData.ts';
import { NewClientFormData } from '../schemas/clientSchema.ts';

interface SaaSState {
  clients: ClientAccount[];
  projects: ProjectItem[];
  invoices: InvoiceItem[];
  activeTab: NavigationTab;
  searchQuery: string;
  isNewClientModalOpen: boolean;
  isNewProjectModalOpen: boolean;
  isNewInvoiceModalOpen: boolean;
  selectedClientDetail: ClientAccount | null;

  // Actions
  setActiveTab: (tab: NavigationTab) => void;
  setSearchQuery: (query: string) => void;
  setNewClientModalOpen: (open: boolean) => void;
  setNewProjectModalOpen: (open: boolean) => void;
  setNewInvoiceModalOpen: (open: boolean) => void;
  setSelectedClientDetail: (client: ClientAccount | null) => void;

  addClient: (formData: NewClientFormData) => ClientAccount;
  updateClientStatus: (clientId: string, status: ClientStatus) => void;
  deleteClient: (clientId: string) => void;

  addProject: (project: Omit<ProjectItem, 'id' | 'createdAt'>) => ProjectItem;
  updateProjectStatus: (projectId: string, status: ProjectStatus) => void;

  addInvoice: (invoice: Omit<InvoiceItem, 'id' | 'createdAt'>) => InvoiceItem;
  markInvoiceAsPaid: (invoiceId: string) => void;
}

export const useSaaSStore = create<SaaSState>((set) => ({
  clients: MOCK_CLIENTS,
  projects: MOCK_PROJECTS,
  invoices: MOCK_INVOICES,
  activeTab: 'dashboard',
  searchQuery: '',
  isNewClientModalOpen: false,
  isNewProjectModalOpen: false,
  isNewInvoiceModalOpen: false,
  selectedClientDetail: null,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setNewClientModalOpen: (open) => set({ isNewClientModalOpen: open }),
  setNewProjectModalOpen: (open) => set({ isNewProjectModalOpen: open }),
  setNewInvoiceModalOpen: (open) => set({ isNewInvoiceModalOpen: open }),
  setSelectedClientDetail: (client) => set({ selectedClientDetail: client }),

  addClient: (formData) => {
    const initials = formData.companyName
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join('') || 'CL';

    const newClient: ClientAccount = {
      id: `cli-${Date.now()}`,
      initials,
      companyName: formData.companyName,
      domain: formData.domain,
      contactName: formData.contactName,
      contactEmail: formData.contactEmail,
      phone: formData.phone || undefined,
      status: formData.status,
      projectsCount: 0,
      mrr: formData.mrr,
      totalBilled: formData.mrr,
      unpaid: 0,
      lastActivity: 'Just now',
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      clients: [newClient, ...state.clients],
    }));

    return newClient;
  },

  updateClientStatus: (clientId, status) => {
    set((state) => ({
      clients: state.clients.map((c) =>
        c.id === clientId ? { ...c, status } : c
      ),
    }));
  },

  deleteClient: (clientId) => {
    set((state) => ({
      clients: state.clients.filter((c) => c.id !== clientId),
      projects: state.projects.filter((p) => p.clientId !== clientId),
      invoices: state.invoices.filter((i) => i.clientId !== clientId),
    }));
  },

  addProject: (projectData) => {
    const newProject: ProjectItem = {
      ...projectData,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      projects: [newProject, ...state.projects],
      clients: state.clients.map((c) =>
        c.id === projectData.clientId
          ? { ...c, projectsCount: c.projectsCount + 1 }
          : c
      ),
    }));

    return newProject;
  },

  updateProjectStatus: (projectId, status) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              status,
              progressPercentage:
                status === 'completed'
                  ? 100
                  : status === 'in_progress'
                  ? 50
                  : status === 'planning'
                  ? 10
                  : p.progressPercentage,
            }
          : p
      ),
    }));
  },

  addInvoice: (invoiceData) => {
    const newInvoice: InvoiceItem = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      invoices: [newInvoice, ...state.invoices],
      clients: state.clients.map((c) =>
        c.id === invoiceData.clientId
          ? {
              ...c,
              totalBilled: c.totalBilled + invoiceData.amount,
              unpaid:
                invoiceData.status !== 'paid'
                  ? c.unpaid + invoiceData.amount
                  : c.unpaid,
            }
          : c
      ),
    }));

    return newInvoice;
  },

  markInvoiceAsPaid: (invoiceId) => {
    set((state) => {
      const target = state.invoices.find((i) => i.id === invoiceId);
      if (!target || target.status === 'paid') return state;

      return {
        invoices: state.invoices.map((i) =>
          i.id === invoiceId
            ? { ...i, status: 'paid', paidAt: new Date().toISOString() }
            : i
        ),
        clients: state.clients.map((c) =>
          c.id === target.clientId
            ? { ...c, unpaid: Math.max(0, c.unpaid - target.amount) }
            : c
        ),
      };
    });
  },
}));
