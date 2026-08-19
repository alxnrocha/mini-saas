import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { KpiMetricCard } from './KpiMetricCard.tsx';
import { BillingOverviewChart } from './BillingOverviewChart.tsx';
import { ProjectsStatusDonut } from './ProjectsStatusDonut.tsx';
import {
  UserProfile,
  KpiMetricCard as KpiMetricCardType,
  BillingTrajectoryPoint,
  ProjectStatusDistribution,
} from '../../types/saas.ts';

interface ExecutiveDashboardProps {
  user: UserProfile;
  kpis: KpiMetricCardType[];
  billingData: BillingTrajectoryPoint[];
  projectsDistribution: ProjectStatusDistribution[];
  onNavigateToProjects?: () => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  user,
  kpis,
  billingData,
  projectsDistribution,
  onNavigateToProjects,
}) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Welcome Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user.name.split(' ')[0]} 👋
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Here's what's happening with your business today.
          </p>
        </div>

        {/* Date Filter Selector */}
        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#101726]/90 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-all shadow-md cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span>May 1 – May 31, 2025</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* 4 Upper KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi) => (
          <KpiMetricCard key={kpi.id} card={kpi} />
        ))}
      </div>

      {/* Middle Row: Billing Overview (8 cols) & Projects Status (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <BillingOverviewChart data={billingData} />
        </div>
        <div className="lg:col-span-4">
          <ProjectsStatusDonut
            data={projectsDistribution}
            onViewAllProjects={onNavigateToProjects}
          />
        </div>
      </div>
    </div>
  );
};
