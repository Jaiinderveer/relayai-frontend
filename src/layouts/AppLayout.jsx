import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import AnimatedContainer from '../components/ui/AnimatedContainer';

/**
 * AppLayout — same <Outlet/>, same mobileNavOpen coordination as before.
 *
 * Structural fix: previously TopBar + main lived inside a single
 * `absolute inset-0 overflow-y-auto` block, and <main> had no height of
 * its own (just margin/padding). That meant `height: 100%` on any routed
 * page (e.g. Analytics' `h-full`) had nothing real to resolve against —
 * percentage height only looks at the *immediate* parent's specified
 * height, and main's was `auto`. The whole page just grew and the outer
 * div became the only scrollable region.
 *
 * Fix: make the content column a real flex column. TopBar is now a
 * `shrink-0` sibling (no longer needs to be part of a scrolling region —
 * it's always visible above it). <main> is `flex-1 min-h-0 overflow-y-auto`,
 * which gives it a genuine, bounded height via flexbox (not a CSS
 * percentage), so pages that opt into `h-full flex flex-col` (like
 * Analytics) get a real height to size against and can manage their own
 * internal scroll regions — while pages that don't (Contacts, Live
 * Monitor, Agentic Chat) keep exactly the same page-level scroll
 * behavior as before, via main's own overflow-y-auto as a fallback.
 */ 
export default function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-text-2">
      <Sidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="shrink-0 px-4 pt-6 sm:px-6 sm:pt-8 md:px-10 max-w-7xl mx-auto w-full">
          <TopBar onMenuClick={() => setMobileNavOpen(true)} />
        </div>
        <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-4 pt-6 pb-6 sm:px-6 sm:pt-8 sm:pb-8 md:px-10 max-w-7xl mx-auto w-full">
          <AnimatedContainer key={location.pathname} className="h-full min-h-0 flex flex-col">
            <Outlet />
          </AnimatedContainer>
        </main>
      </div>
    </div>
  );
}