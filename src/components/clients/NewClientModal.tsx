import React, { useEffect, useState } from 'react';
import { X, Building2, Globe, User, Mail, Phone, DollarSign, Check } from 'lucide-react';
import { newClientSchema, NewClientFormData } from '../../schemas/clientSchema.ts';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitClient: (data: NewClientFormData) => void;
}

export const NewClientModal: React.FC<NewClientModalProps> = ({
  isOpen,
  onClose,
  onSubmitClient,
}) => {
  const [formData, setFormData] = useState<NewClientFormData>({
    companyName: '',
    domain: '',
    contactName: '',
    contactEmail: '',
    phone: '',
    status: 'active',
    mrr: 2500,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
    const result = newClientSchema.safeParse(formData);

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
    onSubmitClient(result.data);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-client-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div className="bg-[#121826] border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 id="new-client-modal-title" className="text-xl font-bold text-white tracking-tight">
                Add New Client Account
              </h3>
              <p className="text-xs text-slate-400">
                Register a new client company into your ClientPulse workspace.
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
          {/* Company Name */}
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Company Name *</span>
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              placeholder="e.g. Apex Innovations Ltd."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
            {errors.companyName && (
              <p className="text-[11px] text-rose-400 font-medium">{errors.companyName}</p>
            )}
          </div>

          {/* Domain */}
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>Website Domain *</span>
            </label>
            <input
              type="text"
              value={formData.domain}
              onChange={(e) =>
                setFormData({ ...formData, domain: e.target.value })
              }
              placeholder="e.g. apexinnovations.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
            {errors.domain && (
              <p className="text-[11px] text-rose-400 font-medium">{errors.domain}</p>
            )}
          </div>

          {/* Contact Person & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>Contact Name *</span>
              </label>
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) =>
                  setFormData({ ...formData, contactName: e.target.value })
                }
                placeholder="e.g. Jennifer Walsh"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
              {errors.contactName && (
                <p className="text-[11px] text-rose-400 font-medium">{errors.contactName}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>Contact Email *</span>
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) =>
                  setFormData({ ...formData, contactEmail: e.target.value })
                }
                placeholder="jennifer@apexinnovations.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
              {errors.contactEmail && (
                <p className="text-[11px] text-rose-400 font-medium">{errors.contactEmail}</p>
              )}
            </div>
          </div>

          {/* Phone & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                <span>Phone (Optional)</span>
              </label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+1 (555) 019-2834"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Account Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as NewClientFormData['status'],
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="active">Active</option>
                <option value="onboarding">Onboarding</option>
                <option value="paused">Paused</option>
                <option value="churned">Churned</option>
              </select>
            </div>
          </div>

          {/* Initial MRR */}
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Initial MRR (USD) *</span>
            </label>
            <input
              type="number"
              value={formData.mrr}
              onChange={(e) =>
                setFormData({ ...formData, mrr: parseFloat(e.target.value) || 0 })
              }
              placeholder="2500"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
            />
            {errors.mrr && (
              <p className="text-[11px] text-rose-400 font-medium">{errors.mrr}</p>
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
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Create Account</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
