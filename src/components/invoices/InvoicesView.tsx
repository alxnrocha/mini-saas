import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Download,
  Check,
} from 'lucide-react';
import { InvoiceItem, InvoiceStatus } from '../../types/saas.ts';

interface InvoicesViewProps {
  invoices: InvoiceItem[];
  onOpenNewInvoiceModal: () => void;
  onMarkAsPaid: (invoiceId: string) => void;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  invoices,
  onOpenNewInvoiceModal,
  onMarkAsPaid,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all');
  const [downloadedInvoiceCode, setDownloadedInvoiceCode] = useState<string | null>(null);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'unpaid':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'overdue':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'cancelled':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const handleDownloadReceipt = (invoice: InvoiceItem) => {
    const receiptContent = `================================================
CLIENTPULSE B2B BILLING RECEIPT
================================================
Invoice Reference : ${invoice.invoiceCode}
Client Company    : ${invoice.clientName}
Total Amount      : $${invoice.amount.toLocaleString()} USD
Due Date          : ${invoice.dueDate}
Payment Status    : ${invoice.status.toUpperCase()}
Issued By         : Acme Digital Co.
Generated On      : ${new Date().toLocaleDateString()}
================================================`;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt_${invoice.invoiceCode.toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadedInvoiceCode(invoice.invoiceCode);
    setTimeout(() => setDownloadedInvoiceCode(null), 3000);
  };

  const totals = {
    billed: invoices.reduce((sum, i) => sum + i.amount, 0),
    paid: invoices.filter((i) => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0),
    unpaid: invoices.filter((i) => i.status === 'unpaid').reduce((sum, i) => sum + i.amount, 0),
    overdue: invoices.filter((i) => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0),
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Billing & Invoices
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage client payments, issue receipts, and track accounts receivable.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewInvoiceModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Invoice</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-[#101726]/80 border border-slate-800 space-y-1">
          <span className="text-slate-400 font-medium">Total Invoiced</span>
          <p className="text-xl font-bold text-white font-mono">
            ${totals.billed.toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#101726]/80 border border-emerald-500/30 space-y-1">
          <span className="text-emerald-400 font-medium">Total Paid</span>
          <p className="text-xl font-bold text-white font-mono">
            ${totals.paid.toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#101726]/80 border border-amber-500/30 space-y-1">
          <span className="text-amber-400 font-medium">Pending Unpaid</span>
          <p className="text-xl font-bold text-white font-mono">
            ${totals.unpaid.toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#101726]/80 border border-rose-500/30 space-y-1">
          <span className="text-rose-400 font-medium">Overdue Balance</span>
          <p className="text-xl font-bold text-white font-mono">
            ${totals.overdue.toLocaleString()}
          </p>
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
            placeholder="Search invoice code or client..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#090D16] border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['all', 'paid', 'unpaid', 'overdue'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="p-6 rounded-2xl bg-[#101726]/80 border border-slate-800 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800/80 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-3">Invoice</th>
              <th className="py-3 px-3">Client</th>
              <th className="py-3 px-3">Amount</th>
              <th className="py-3 px-3">Due Date</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-slate-300">
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  {/* Code */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="font-mono font-bold text-white">
                        {inv.invoiceCode}
                      </span>
                    </div>
                  </td>

                  {/* Client Name */}
                  <td className="py-3.5 px-3 font-semibold text-white">
                    {inv.clientName}
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-3 font-mono font-bold text-white text-sm">
                    ${inv.amount.toLocaleString()}
                  </td>

                  {/* Due Date */}
                  <td className="py-3.5 px-3 text-slate-400 text-[11px]">
                    {inv.dueDate}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${getStatusBadge(
                        inv.status
                      )}`}
                    >
                      {inv.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {inv.status !== 'paid' && (
                        <button
                          type="button"
                          onClick={() => onMarkAsPaid(inv.id)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
                          title="Mark invoice as paid"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark Paid</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDownloadReceipt(inv)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:text-white hover:bg-slate-700 transition-colors"
                        title="Download Receipt"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>
                          {downloadedInvoiceCode === inv.invoiceCode ? 'Saved!' : 'Receipt'}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-10 text-slate-500">
                  <div className="space-y-2">
                    <p className="font-semibold text-slate-400">No invoices found</p>
                    <p className="text-[11px] text-slate-500">
                      Try adjusting your search query or filter.
                    </p>
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
