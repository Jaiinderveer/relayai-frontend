/**
 * EmptyState — consistent "nothing here yet" treatment (empty chat, empty
 * queue, empty contact list) instead of ad-hoc centered divs per page.
 */
export default function EmptyState({ icon: Icon, emoji, title, description, action = null, className = '' }) {
  return (
    <div className={`text-center py-14 px-6 text-text-3 animate-ds-fade-in ${className}`}>
      <div className="w-12 h-12 mx-auto mb-4 rounded-ds-lg bg-surface-2 border border-border flex items-center justify-center">
        {Icon ? <Icon size={20} className="text-text-3" /> : <span className="text-2xl">{emoji}</span>}
      </div>
      {title && <div className="font-semibold text-text-1 mb-1 text-[14px]">{title}</div>}
      {description && <div className="text-[13px] max-w-sm mx-auto leading-relaxed">{description}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}