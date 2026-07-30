import GlassPanel from './GlassPanel';

/**
 * PageHeader — sticky glass header used at the top of every page (currently
 * hand-rolled inside TopBar.jsx). Exposed here so TopBar can compose it in
 * Phase 2, and so any page can render a secondary in-page header the same
 * way without duplicating markup.
 */
export default function PageHeader({ title, subtitle, badge = null, sticky = true, className = '' }) {
  return (
    <GlassPanel
      className={`flex justify-between items-center p-4 ${sticky ? 'sticky top-0 z-10' : ''} ${className}`}
    >
      <div>
        <h3 className="m-0 text-[17px] text-text-1 font-semibold tracking-tight">{title}</h3>
        {subtitle && <p className="m-0 mt-0.5 text-xs text-text-3">{subtitle}</p>}
      </div>
      {badge}
    </GlassPanel>
  );
}