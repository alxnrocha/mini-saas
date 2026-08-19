import React, { useEffect } from 'react';
import {
  X,
  Building2,
  Mail,
  Phone,
  Calendar,
  Layers,
  FileCheck2,
  ExternalLink,
} from 'lucide-react';
import { ClientAccount, ProjectItem, InvoiceItem } from '../../types/saas.ts';

interface ClientDetailModalProps {
  client: ClientAccount | null;
  projects: ProjectItem[];
  invoices: InvoiceItem[];
  onClose: () => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  client,
  projects,
  invoices,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && client) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [client, onClose]);

  if (!client) return null;

  const clientProjects = projects.filter((p) => p.clientId === client.id);
  const clientInvoices = invoices.filter((i) => i.clientId === client.id);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="client-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div className="bg-[#121826] border border-slate-700/80 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white font-bold text-base shadow-lg">
              {client.initials}
            </div>
            <div>
              <h3 id="client-detail-title" className="text-xl font-bold text-white">
                {client.companyName}
              </h3>
              <a
                href={`https://${client.domain}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-400 hover:underline flex items-center gap-1 mt-0.5"
              >
                <span>{client.domain}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close client details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metrics Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-[#090D16] border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Monthly Revenue</span>
            <p className="text-lg font-bold text-white font-mono">
              ${client.mrr.toLocaleString()}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#090D16] border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Total Billed</span>
            <p className="text-lg font-bold text-white font-mono">
              ${client.totalBilled.toLocaleString()}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#090D16] border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Unpaid Balance</span>
            <p
              className={`text-lg font-bold font-mono ${
                client.unpaid === 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              ${client.unpaid.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800 space-y-2 text-xs">
          <h4 className="font-semibold text-white">Primary Account Contact</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>{client.contactName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>{client.contactEmail}</span>
            </div>
            {client.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                <span>{client.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Last active: {client.lastActivity}</span>
            </div>
          </div>
        </div>

        {/* Associated Projects & Invoices */}
        <div className="space-y-4 text-xs">
          {/* Projects */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Client Projects ({clientProjects.length})</span>
              </h4>
            </div>

            {clientProjects.length > 0 ? (
              <div className="space-y-2">
                {clientProjects.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl bg-[#090D16] border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-medium text-white block">{p.name}</span>
                      <span className="text-[11px] text-slate-500">
                        Budget: ${p.budget.toLocaleString()} • Status: {p.status}
                      </span>
                    </div>
                    <span className="font-bold text-indigo-400 font-mono">
                      {p.progressPercentage}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">No projects registered yet.</p>
            )}
          </div>

          {/* Invoices */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Recent Invoices ({clientInvoices.length})</span>
            </h4>

            {clientInvoices.length > 0 ? (
              <div className="space-y-2">
                {clientInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-3 rounded-xl bg-[#090D16] border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono font-semibold text-white block">
                        {inv.invoiceCode}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Due: {inv.dueDate} • Status: {inv.status}
                      </span>
                    </div>
                    <span className="font-bold text-white font-mono">
                      ${inv.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">No invoices issued yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
