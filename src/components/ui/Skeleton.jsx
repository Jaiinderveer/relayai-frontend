/**
 * Skeleton primitives — shimmer placeholders for cards/rows/lines while
 * data is in flight. Composable: SkeletonLine for text, SkeletonBlock for
 * cards/avatars, SkeletonCard as a ready-made KPI-card-shaped placeholder.
 */
export function SkeletonLine({ width = 'w-full', height = 'h-3', className = '' }) {
  return <div className={`ds-skeleton rounded-ds-sm ${width} ${height} ${className}`} />;
}

export function SkeletonBlock({ className = '' }) {
  return <div className={`ds-skeleton rounded-ds-lg ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-surface-2 border border-border p-5 rounded-ds-lg space-y-3">
      <SkeletonLine width="w-20" height="h-2.5" />
      <SkeletonLine width="w-16" height="h-7" />
    </div>
  );
}