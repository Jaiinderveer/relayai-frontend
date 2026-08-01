import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * MetricCard — KPI card used on Analytics / Live Monitor stat strips.
 * `trend` is optional and purely presentational (a number of % or null) —
 * callers pass whatever the existing metrics payload already contains,
 * nothing new is computed or fetched here.
 */
export default function MetricCard({ icon: Icon, label, value, trend, accent = 'accent' }) {
  const accentSoftVar = `var(--color-${accent}-soft)`;
  const accentVar = `var(--color-${accent})`;

  const TrendIcon = trend == null ? null : trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend == null ? 'text-text-4' : trend > 0 ? 'text-success' : trend < 0 ? 'text-danger' : 'text-text-4';

  return (
    <div className="group bg-gradient-to-b from-surface-2 to-surface border border-border p-5 mt-1 rounded-ds-lg shadow-ds-sm transition-all duration-200 hover:border-accent hover:-translate-y-0.5 hover:shadow-glow">
      <div className="flex items-start justify-between mb-3">
        <div className="text-[11px] text-text-3 font-bold uppercase tracking-wider">{label}</div>
        {Icon && (
          <div
            className="w-8 h-8 rounded-ds-sm flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
            style={{ background: accentSoftVar, color: accentVar }}
          >
            <Icon size={16} strokeWidth={2.25} />
          </div>
        )}
      </div>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold text-text-1 tracking-tight">{value}</div>
        {TrendIcon && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon size={13} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
}