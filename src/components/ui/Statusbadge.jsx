/**
 * StatusBadge — generalized pill for non-call-status contexts (e.g. a
 * "Live" system badge, a form validation badge). The existing StatusPill.jsx
 * (call status: COMPLETED/FAILED/PENDING/CALLING) is untouched and still
 * owns that specific domain vocabulary — this component is for everything
 * else so callers aren't tempted to overload StatusPill's status enum.
 * tone: 'neutral' | 'accent' | 'success' | 'danger' | 'warning'
 */
export default function StatusBadge({ children, tone = 'neutral', dot = true, className = '' }) {
  const tones = {
    neutral: 'bg-surface-3 text-text-3 border-border',
    accent: 'bg-accent-soft text-accent border-accent/25',
    success: 'bg-success-soft text-success border-success/25',
    danger: 'bg-danger-soft text-danger border-danger/25',
    warning: 'bg-warning-soft text-warning border-warning/25',
  };
  const dotColor = {
    neutral: 'bg-text-4',
    accent: 'bg-accent',
    success: 'bg-success',
    danger: 'bg-danger',
    warning: 'bg-warning',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider border ${tones[tone]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor[tone]}`} />}
      {children}
    </span>
  );
}