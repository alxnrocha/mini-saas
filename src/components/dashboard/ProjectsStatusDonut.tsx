import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Info } from 'lucide-react';
import { ProjectStatusDistribution } from '../../types/saas.ts';

interface ProjectsStatusDonutProps {
  data: ProjectStatusDistribution[];
  onViewAllProjects?: () => void;
}

export const ProjectsStatusDonut: React.FC<ProjectsStatusDonutProps> = ({
  data,
  onViewAllProjects,
}) => {
  const totalProjects = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="p-6 rounded-2xl bg-[#101726]/80 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-white tracking-tight">
            Projects by Status
          </h3>
          <button
            type="button"
            className="text-slate-500 hover:text-slate-300"
            title="Distribution of active and completed client deliverables."
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {onViewAllProjects && (
          <button
            type="button"
            onClick={onViewAllProjects}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            View All
          </button>
        )}
      </div>

      {/* Donut Chart with center count */}
      <div className="relative h-48 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const entry = payload[0].payload as ProjectStatusDistribution;
                  return (
                    <div className="bg-[#121826]/95 border border-slate-700 p-2.5 rounded-xl text-xs shadow-xl space-y-0.5">
                      <p className="font-semibold text-white">{entry.label}</p>
                      <p className="text-slate-400">
                        {entry.count} projects ({entry.percentage}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={data}
              dataKey="count"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold text-white tracking-tight">
            {totalProjects}
          </span>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Total
          </span>
        </div>
      </div>

      {/* Legend List */}
      <div className="space-y-2 pt-2 border-t border-slate-800/60">
        {data.map((item) => (
          <div
            key={item.status}
            className="flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-300 font-medium">{item.count} {item.label}</span>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">
              ({item.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
