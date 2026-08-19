export type ClientStatus = 'active' | 'onboarding' | 'paused' | 'churned';
export type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'completed';
export type InvoiceStatus = 'paid' | 'unpaid' | 'overdue' | 'cancelled';
export type NavigationTab = 'dashboard' | 'clients' | 'projects' | 'invoices' | 'settings';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  companyName: string;
  initials: string;
  avatarUrl?: string;
}

export interface KpiMetricCard {
  id: string;
  title: string;
  value: string;
  rawValue: number;
  growthPercentage: number;
  isPositive: boolean;
  comparisonPeriod: string;
  sparklineData: number[];
  iconType: 'currency' | 'users' | 'projects' | 'invoices';
  accentColor: 'purple' | 'blue' | 'emerald' | 'amber';
}

export interface BillingTrajectoryPoint {
  month: string; // e.g. "Jan", "Feb", ... "Dec"
  mrr: number;
  oneTime: number;
  total: number;
}

export interface ProjectStatusDistribution {
  status: ProjectStatus;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ClientAccount {
  id: string;
  initials: string;
  companyName: string;
  domain: string;
  contactName: string;
  contactEmail: string;
  phone?: string;
  status: ClientStatus;
  projectsCount: number;
  mrr: number;
  totalBilled: number;
  unpaid: number;
  lastActivity: string;
  createdAt: string;
}

export interface ProjectItem {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  budget: number;
  status: ProjectStatus;
  progressPercentage: number;
  deadline?: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  invoiceCode: string; // e.g. "INV-2025-001"
  clientId: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
  paidAt?: string;
  createdAt: string;
}

export interface DashboardOverviewData {
  user: UserProfile;
  kpiMetrics: KpiMetricCard[];
  billingTrajectory: BillingTrajectoryPoint[];
  projectsByStatus: ProjectStatusDistribution[];
  recentClients: ClientAccount[];
}
