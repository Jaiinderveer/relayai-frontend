/**
 * SectionHeader — the small uppercase eyebrow label used above every panel
 * ("Directory", "Insights", "Recent Delegations", etc). Replaces the
 * repeated `text-[11.5px] text-text-3 uppercase font-bold tracking-wider`
 * className that was copy-pasted across every page.
 */
export default function SectionHeader({ children, action = null, className = '' }) {
  return (
    <div className={`flex items-center justify-between mb-3 ${className}`}>
      <p className="text-[11.5px] text-text-3 uppercase font-bold tracking-wider">
        {children}
      </p>
      {action}
    </div>
  );
}