export default function StatusPill({ status }) {
  const s = (status || 'UNKNOWN').toUpperCase();
  
  let colorClass = 'bg-surface-3 text-text-3 border-border'; // Neutral
  if (s === 'COMPLETED') colorClass = 'bg-success-soft text-success border-success/25';
  else if (s === 'FAILED') colorClass = 'bg-danger-soft text-danger border-danger/25';
  else if (s === 'PENDING' || s === 'CALLING') colorClass = 'bg-warning-soft text-warning border-warning/25';

  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${colorClass}`}>
      <span className="text-[8px]">●</span> {s}
    </span>
  );
}