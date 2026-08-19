import React from 'react';
import { Activity } from 'lucide-react';

export default function App(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="saas-card p-8 rounded-2xl max-w-md w-full text-center space-y-4 shadow-2xl">
        <div className="inline-flex p-3 rounded-full bg-indigo-500/10 text-indigo-400">
          <Activity className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-wide">
          ClientPulse SaaS
        </h1>
        <p className="text-slate-400 text-sm">
          Single-Tenant B2B Client, Project & Invoicing SaaS Platform.
        </p>
      </div>
    </div>
  );
}
