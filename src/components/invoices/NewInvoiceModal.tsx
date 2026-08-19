import React, { useEffect, useState } from 'react';
import { X, FileText, DollarSign, Calendar, Check } from 'lucide-react';
import { ClientAccount, InvoiceStatus } from '../../types/saas.ts';
import { newInvoiceSchema, NewInvoiceFormData } from '../../schemas/invoiceSchema.ts';

interface NewInvoiceModalProps {
  isOpen: boolean;
  clients: ClientAccount[];
  onClose: () => void;
  onSubmitInvoice: (data: NewInvoiceFormData) => void;
}

export const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({
  isOpen,
  clients,
  onClose,
  onSubmitInvoice,
}) => {
  const [formData, setFormData] = useState<Partial<NewInvoiceFormData>>({
    clientId: clients[0]?.id || '',
    clientName: clients[0]?.companyName || '',
    invoiceCode: `INV-2025-${Math.floor(100 + Math.random() * 900)}`,
    amount: 3500,
    dueDate: '2025-06-30',
    status: 'unpaid',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (clients.length > 0 && !formData.clientId) {
      setFormData((prev) => ({
        ...prev,
        clientId: clients[0].id,
        clientName: clients[0].companyName,
      }));
    }
  }, [clients, formData.clientId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = newInvoiceSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmitInvoice(result.data);
    onClose();
  };

  const handleClientChange = (clientId: string) => {
    const selected = clients.find((c) => c.id === clientId);
    setFormData({
      ...formData,
      clientId,
      clientName: selected?.companyName || '',
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-invoice-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div className="bg-[#121826] border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 id="new-invoice-modal-title" className="text-xl font-bold text-white tracking-tight">
                Issue New Invoice
              </h3>
              <p className="text-xs text-slate-400">
                Generate and send a billing receipt to a client account.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Client Selection */}
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Billable Client *</label>
            <select
              value={formData.clientId}
              onChange={(e) => handleClientChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName} ({c.domain})
                </option>
              ))}
            </select>
            {errors.clientId && (
              <p className="text-[11px] text-rose-400 font-medium">{errors.clientId}</p>
            )}
          </div>

          {/* Invoice Code */}
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Invoice Code *</label>
            <input
              type="text"
              value={formData.invoiceCode || ''}
              onChange={(e) =>
                setFormData({ ...formData, invoiceCode: e.target.value })
              }
              placeholder="e.g. INV-2025-055"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
            />
            {errors.invoiceCode && (
              <p className="text-[11px] text-rose-400 font-medium">{errors.invoiceCode}</p>
            )}
          </div>

          {/* Amount & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Invoice Total (USD) *</span>
              </label>
              <input
                type="number"
                value={formData.amount || 0}
                onChange={(e) =>
                  setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
              {errors.amount && (
                <p className="text-[11px] text-rose-400 font-medium">{errors.amount}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Initial Payment Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as InvoiceStatus,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="unpaid">Unpaid / Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Payment Due Date *</span>
            </label>
            <input
              type="date"
              value={formData.dueDate || ''}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
            {errors.dueDate && (
              <p className="text-[11px] text-rose-400 font-medium">{errors.dueDate}</p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Issue Invoice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
