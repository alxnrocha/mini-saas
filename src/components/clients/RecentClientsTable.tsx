import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  MoreHorizontal,
  ExternalLink,
  ChevronDown,
  Trash2,
  CheckCircle,
  PauseCircle,
  UserPlus,
} from 'lucide-react';
import { ClientAccount, ClientStatus } from '../../types/saas.ts';

interface RecentClientsTableProps {
  clients: ClientAccount[];
  onSelectClient: (client: ClientAccount) => void;
  onUpdateStatus: (clientId: string, status: ClientStatus) => void;
  onDeleteClient: (clientId: string) => void;
  onOpenNewClientModal?: () => void;
}

export const RecentClientsTable: React.FC<RecentClientsTableProps> = ({
  clients,
  onSelectClient,
  onUpdateStatus,
  onDeleteClient,
  onOpenNewClientModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ClientStatus>('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);

  const getAvatarGradient = (initials: string) => {
    switch (initials) {
      case 'AC':
        return 'from-purple-600 to-indigo-600';
      case 'IN':
        return 'from-blue-600 to-cyan-600';
      case 'GV':
        return 'from-emerald-600 to-teal-600';
      case 'SP':
        return 'from-amber-600 to-orange-600';
      case 'NS':
        return 'from-indigo-600 to-purple-600';
      case 'AD':
        return 'from-rose-600 to-pink-600';
      default:
        return 'from-indigo-600 to-blue-600';
    }
  };

  const getStatusBadge = (status: ClientStatus) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'onboarding':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'paused':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'churned':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    }
  };

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 rounded-2xl bg-[#101726]/80 border border-slate-800 shadow-xl space-y-6">
      {/* Table Header & Search Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Recent Clients
          </h3>
          <p className="text-xs text-slate-400">
            Overview of client contracts, monthly billing, and open projects.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Table Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients..."
              className="pl-9 pr-4 py-1.5 rounded-xl bg-[#090D16] border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-all w-48 sm:w-60"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="capitalize">{statusFilter === 'all' ? 'Filter' : statusFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isFilterDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-[#121826] border border-slate-700 rounded-xl p-1.5 shadow-2xl z-20 text-xs space-y-0.5 animate-fade-in">
                {(['all', 'active', 'onboarding', 'paused', 'churned'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      setStatusFilter(st);
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg capitalize transition-colors ${
                      statusFilter === st
                        ? 'bg-indigo-600/20 text-indigo-300 font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800/80 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-3">Client</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-center">Projects</th>
              <th className="py-3 px-3">MRR</th>
              <th className="py-3 px-3">Total Billed</th>
              <th className="py-3 px-3">Unpaid</th>
              <th className="py-3 px-3">Last Activity</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-slate-300">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-slate-800/30 transition-colors group"
                >
                  {/* Client name & Avatar */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarGradient(
                          client.initials
                        )} flex items-center justify-center text-white font-bold text-[11px] shadow-sm shrink-0`}
                      >
                        {client.initials}
                      </div>
                      <div className="truncate">
                        <span className="font-semibold text-white block truncate">
                          {client.companyName}
                        </span>
                        <a
                          href={`https://${client.domain}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-slate-500 hover:text-indigo-400 transition-colors flex items-center gap-1"
                        >
                          <span>{client.domain}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${getStatusBadge(
                        client.status
                      )}`}
                    >
                      {client.status}
                    </span>
                  </td>

                  {/* Projects Count */}
                  <td className="py-3.5 px-3 text-center font-medium text-white">
                    {client.projectsCount}
                  </td>

                  {/* MRR */}
                  <td className="py-3.5 px-3 font-semibold text-white font-mono">
                    ${client.mrr.toLocaleString()}
                  </td>

                  {/* Total Billed */}
                  <td className="py-3.5 px-3 font-mono text-slate-300">
                    ${client.totalBilled.toLocaleString()}
                  </td>

                  {/* Unpaid */}
                  <td className="py-3.5 px-3 font-mono font-medium">
                    <span
                      className={
                        client.unpaid === 0 ? 'text-emerald-400' : 'text-rose-400 font-semibold'
                      }
                    >
                      ${client.unpaid.toLocaleString()}
                    </span>
                  </td>

                  {/* Last Activity */}
                  <td className="py-3.5 px-3 text-slate-400 text-[11px]">
                    {client.lastActivity}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-3 text-right relative">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectClient(client)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="View Client Details"
                        aria-label={`View details for ${client.companyName}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveActionMenuId(
                              activeActionMenuId === client.id ? null : client.id
                            )
                          }
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          aria-label={`More actions for ${client.companyName}`}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {/* Action menu dropdown */}
                        {activeActionMenuId === client.id && (
                          <div className="absolute right-0 mt-1 w-44 bg-[#121826] border border-slate-700 rounded-xl p-1.5 shadow-2xl z-30 space-y-1 text-xs text-left animate-fade-in">
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateStatus(client.id, 'active');
                                setActiveActionMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-emerald-400 hover:bg-slate-800"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Set Active</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateStatus(client.id, 'paused');
                                setActiveActionMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-amber-400 hover:bg-slate-800"
                            >
                              <PauseCircle className="w-3.5 h-3.5" />
                              <span>Set Paused</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteClient(client.id);
                                setActiveActionMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Account</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-10 text-slate-500">
                  <div className="space-y-2">
                    <p className="font-semibold text-slate-400">No clients found</p>
                    <p className="text-[11px] text-slate-500">
                      Try adjusting your search query or status filter.
                    </p>
                    {onOpenNewClientModal && (
                      <button
                        type="button"
                        onClick={onOpenNewClientModal}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors mt-2"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Add New Client</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
