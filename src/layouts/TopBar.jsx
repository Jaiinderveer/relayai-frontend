import { useLocation } from 'react-router-dom';
import { Menu, Search, Bell, CircleUserRound } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import StatusBadge from '../components/ui/StatusBadge';

// Same lookup as before — page copy, not business logic.
const pageTitles = {
  '/chat': { title: 'Agentic Workspace', sub: 'Delegate natural language tasks directly to AI agents.' },
  '/monitor': { title: 'Live Call Monitor', sub: 'Real-time call queue status and telephony transcript records.' },
  '/analytics': { title: 'Executive Analytics', sub: 'Real-time system operational metrics and call performance data.' },
  '/contacts': { title: 'Contact Directory', sub: 'Manage your automated calling recipient lists.' }
};

/**
 * TopBar — same route->title mapping as before. `onMenuClick` (from
 * AppLayout) opens the mobile sidebar drawer; the button only renders below
 * `lg`. Search/notifications/profile are presentational placeholders — no
 * backend endpoint exists for any of them yet, so they're intentionally
 * inert rather than faking functionality.
 */
export default function TopBar({ onMenuClick }) {
  const location = useLocation();
  const current = pageTitles[location.pathname] || { title: 'RelayAI', sub: 'Call Operations Platform' };

  return (
    <PageHeader
      title={current.title}
      subtitle={current.sub}
      badge={
        <div className="flex items-center gap-2">
          {/* Workspace search — visual only, not wired to a data source */}
          

          <button
            className="p-2 rounded-full text-text-3 hover:bg-surface-2 hover:text-text-1 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={16} />
          </button>

          <button
            className="p-1 rounded-full text-text-3 hover:text-text-1 transition-colors cursor-pointer"
            aria-label="Profile"
          >
            <CircleUserRound size={26} />
          </button>

          <StatusBadge tone="accent" className="hidden sm:inline-flex">
            Database Synced
          </StatusBadge>

          {/* Mobile nav toggle */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-full text-text-3 hover:bg-surface-2 hover:text-text-1 transition-colors cursor-pointer"
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
        </div>
      }
    />
  );
}