import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Zap, Radio, BarChart3, Users, ChevronLeft, ChevronRight, X } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';

const navItems = [
  { name: 'Agentic Chat', path: '/chat', icon: Zap },
  { name: 'Live Monitor', path: '/monitor', icon: Radio },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Contacts', path: '/contacts', icon: Users },
];

/**
 * Sidebar — same four routes/paths as before (App.jsx untouched). Two new,
 * purely-visual states, both local to this component:
 *   - `collapsed`: desktop icon-rail toggle
 *   - `isOpen`/`onClose` (props from AppLayout): mobile overlay drawer
 */
export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile backdrop — only rendered when the drawer is open on small screens */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden animate-ds-fade-in"
          onClick={onClose}
        />
      )}

      <aside
        className={`bg-surface border-r border-border flex flex-col h-full shrink-0 z-30
          fixed inset-y-0 left-0 lg:static
          transition-all duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          ${collapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Branding */}
        <div className="p-5 border-b border-border mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-linear-to-br from-accent to-blue-700 text-white w-9 h-9 rounded-ds-sm flex items-center justify-center font-bold text-lg shadow-glow shrink-0">
              ⌘
            </div>
            <div className={`overflow-hidden transition-all duration-200 ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
              <div className="font-bold text-base tracking-tight text-text-1 leading-tight whitespace-nowrap">RelayAI</div>
              <div className="text-[11px] text-text-3 font-medium mt-0.5 whitespace-nowrap">Call Operations Platform</div>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden text-text-3 hover:text-text-1 transition-colors cursor-pointer shrink-0"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <div className={`px-5 text-[10.5px] font-bold tracking-wider uppercase text-text-4 mb-2 transition-opacity duration-200 ${collapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
          Workspace
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                title={collapsed ? item.name : undefined}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2.5 rounded-ds-sm text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-accent-soft text-text-1 shadow-[inset_2.5px_0_0_#3B82F6]'
                      : 'text-text-2 hover:bg-surface-2 hover:text-text-1'
                  }`
                }
              >
                <Icon size={17} strokeWidth={2.25} className="shrink-0" />
                <span className={`whitespace-nowrap overflow-hidden transition-all duration-200 ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse toggle — desktop only */}
        <div className="hidden lg:flex px-3 pb-2">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-ds-sm text-text-3 hover:bg-surface-2 hover:text-text-1 transition-colors cursor-pointer"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {/* Footer Status */}
        <div className={`p-4 border-t border-border ${collapsed ? 'flex justify-center' : ''}`}>
          {collapsed ? (
            <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-[ds-pulse-dot_2s_infinite]" title="System Operational" />
          ) : (
            <StatusBadge tone="success">System Operational</StatusBadge>
          )}
        </div>
      </aside>
    </>
  );
}