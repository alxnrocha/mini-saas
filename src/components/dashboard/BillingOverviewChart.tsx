import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Info, Download, ChevronDown } from 'lucide-react';
import { BillingTrajectoryPoint } from '../../types/saas.ts';

interface BillingOverviewChartProps {
  data: BillingTrajectoryPoint[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#121826]/95 border border-slate-700/90 rounded-xl p-3 shadow-2xl space-y-1.5 backdrop-blur-md">
        <p className="text-xs font-semibold text-white border-b border-slate-800 pb-1">
          {label} 2025
        </p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-400">{entry.name}:</span>
            </div>
            <span className="font-semibold text-white font-mono">
              ${entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const BillingOverviewChart: React.FC<BillingOverviewChartProps> = ({ data }) => {
  const [period, setPeriod] = useState<'Monthly' | 'Quarterly' | 'Yearly'>('Monthly');

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Month,MRR,One-Time,Total']
        .concat(data.map((d) => `${d.month},${d.mrr},${d.oneTime},${d.total}`))
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `billing_overview_${period.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 rounded-2xl bg-[#101726]/80 border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Billing Overview
            </h3>
            <button
              type="button"
              className="text-slate-500 hover:text-slate-300"
              title="Overview of recurring subscriptions and one-off project billings."
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
              <span className="text-slate-400">MRR (USD)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              <span className="text-slate-400">One-time (USD)</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Period Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setPeriod((prev) =>
                  prev === 'Monthly' ? 'Quarterly' : prev === 'Quarterly' ? 'Yearly' : 'Monthly'
                )
              }
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <span>{period}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Export Button */}
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Area Chart Container */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorOneTime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `$${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="mrr"
              name="MRR (USD)"
              stroke="#8B5CF6"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorMrr)"
            />
            <Area
              type="monotone"
              dataKey="oneTime"
              name="One-time (USD)"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorOneTime)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
