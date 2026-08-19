import React from 'react';
import {
  DollarSign,
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  TrendingDown,
  MoreVertical,
} from 'lucide-react';
import { KpiMetricCard as KpiMetricCardType } from '../../types/saas.ts';

interface KpiMetricCardProps {
  card: KpiMetricCardType;
}

export const KpiMetricCard: React.FC<KpiMetricCardProps> = ({ card }) => {
  const getIcon = () => {
    switch (card.iconType) {
      case 'currency':
        return <DollarSign className="w-5 h-5" />;
      case 'users':
        return <Users className="w-5 h-5" />;
      case 'projects':
        return <Briefcase className="w-5 h-5" />;
      case 'invoices':
        return <FileText className="w-5 h-5" />;
    }
  };

  const getIconStyle = () => {
    switch (card.accentColor) {
      case 'purple':
        return 'bg-purple-600/15 text-purple-400 border-purple-500/30';
      case 'blue':
        return 'bg-blue-600/15 text-blue-400 border-blue-500/30';
      case 'emerald':
        return 'bg-emerald-600/15 text-emerald-400 border-emerald-500/30';
      case 'amber':
        return 'bg-amber-600/15 text-amber-400 border-amber-500/30';
    }
  };

  const getStrokeColor = () => {
    switch (card.accentColor) {
      case 'purple':
        return '#8B5CF6';
      case 'blue':
        return '#3B82F6';
      case 'emerald':
        return '#10B981';
      case 'amber':
        return '#F59E0B';
    }
  };

  // Generate SVG sparkline path
  const minVal = Math.min(...card.sparklineData);
  const maxVal = Math.max(...card.sparklineData);
  const range = maxVal - minVal || 1;
  const width = 100;
  const height = 28;

  const points = card.sparklineData
    .map((val, idx) => {
      const x = (idx / (card.sparklineData.length - 1)) * width;
      const y = height - ((val - minVal) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div className="p-5 rounded-2xl bg-[#101726]/80 border border-slate-800 hover:border-slate-700 transition-all duration-200 shadow-xl flex flex-col justify-between space-y-4">
      {/* Top row: Icon + Title + More Button */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-inner ${getIconStyle()}`}
          >
            {getIcon()}
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">{card.title}</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {card.value}
              </h3>
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  card.isPositive
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-amber-400 bg-amber-500/10'
                }`}
              >
                {card.isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{card.growthPercentage}%</span>
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="text-slate-500 hover:text-slate-300 p-1 rounded-lg hover:bg-slate-800/60"
          aria-label="More options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom row: Comparison period & Sparkline */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
        <span className="text-[11px] text-slate-500 font-medium">
          {card.comparisonPeriod}
        </span>

        {/* Sparkline curve */}
        <div className="w-24 h-7">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible"
          >
            <polyline
              fill="none"
              stroke={getStrokeColor()}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
