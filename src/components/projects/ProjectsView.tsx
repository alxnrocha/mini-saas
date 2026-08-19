import React, { useState } from 'react';
import {
  FolderKanban,
  Search,
  Plus,
  Calendar,
  DollarSign,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { ProjectItem, ProjectStatus } from '../../types/saas.ts';

interface ProjectsViewProps {
  projects: ProjectItem[];
  onOpenNewProjectModal: () => void;
  onUpdateProjectStatus: (projectId: string, status: ProjectStatus) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onOpenNewProjectModal,
  onUpdateProjectStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ProjectStatus>('all');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'in_progress':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'on_hold':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'planning':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'completed':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
  };

  const getNextStatus = (current: ProjectStatus): ProjectStatus => {
    if (current === 'planning') return 'in_progress';
    if (current === 'in_progress') return 'completed';
    return 'in_progress';
  };

  const counts = {
    total: projects.length,
    in_progress: projects.filter((p) => p.status === 'in_progress').length,
    on_hold: projects.filter((p) => p.status === 'on_hold').length,
    planning: projects.filter((p) => p.status === 'planning').length,
    completed: projects.filter((p) => p.status === 'completed').length,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Client Deliverables & Projects
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Track milestones, budgets, and delivery velocity across all accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewProjectModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow-lg shadow-purple-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-[#101726]/80 border border-slate-800 space-y-1">
          <span className="text-slate-400 font-medium">All Projects</span>
          <p className="text-xl font-bold text-white">{counts.total}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#101726]/80 border border-purple-500/30 space-y-1">
          <span className="text-purple-400 font-medium">In Progress</span>
          <p className="text-xl font-bold text-white">{counts.in_progress}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#101726]/80 border border-blue-500/30 space-y-1">
          <span className="text-blue-400 font-medium">On Hold</span>
          <p className="text-xl font-bold text-white">{counts.on_hold}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#101726]/80 border border-emerald-500/30 space-y-1">
          <span className="text-emerald-400 font-medium">Planning</span>
          <p className="text-xl font-bold text-white">{counts.planning}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#101726]/80 border border-amber-500/30 space-y-1">
          <span className="text-amber-400 font-medium">Completed</span>
          <p className="text-xl font-bold text-white">{counts.completed}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#101726]/80 border border-slate-800">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects or clients..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#090D16] border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['all', 'in_progress', 'on_hold', 'planning', 'completed'] as const).map(
            (status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            )
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="p-5 rounded-2xl bg-[#101726]/80 border border-slate-800 hover:border-purple-500/40 transition-all shadow-xl flex flex-col justify-between space-y-4 group"
            >
              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 truncate max-w-[180px]">
                    {project.clientName}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getStatusBadge(
                      project.status
                    )}`}
                  >
                    {project.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  {project.name}
                </h3>
              </div>

              {/* Budget & Progress */}
              <div className="space-y-3 pt-3 border-t border-slate-800/60 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-slate-400">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Budget:</span>
                  </div>
                  <span className="font-bold text-white font-mono">
                    ${project.budget.toLocaleString()}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Milestone Progress</span>
                    <span className="font-semibold text-purple-400 font-mono">
                      {project.progressPercentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${project.progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  <span>{project.deadline || 'No deadline'}</span>
                </div>

                {project.status !== 'completed' ? (
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateProjectStatus(project.id, getNextStatus(project.status))
                    }
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 transition-colors"
                  >
                    <span>Advance</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Done</span>
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center rounded-2xl bg-[#101726]/60 border border-slate-800 space-y-3">
            <FolderKanban className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="font-semibold text-slate-300">No projects found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No active deliverables match your filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
