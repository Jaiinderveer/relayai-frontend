import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import AnimatedContainer from '../components/ui/AnimatedContainer';

/**
 * AppLayout — same <Outlet/> and overall flex/scroll structure as before.
 * The only new state is `mobileNavOpen`, which exists purely to coordinate
 * the hamburger button (in TopBar) with the drawer (in Sidebar) — no store,
 * no routing change.
 */
export default function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-text-2">
      <Sidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 flex flex-col overflow-hidden px-4 py-6 sm:px-6 sm:py-8 md:px-10 w-full">
          <TopBar onMenuClick={() => setMobileNavOpen(true)} />

          <main className="mt-6 flex-1 min-h-0 overflow-hidden">
            <AnimatedContainer key={location.pathname} className="h-full">
              <Outlet />
            </AnimatedContainer>
          </main>
        </div>
      </div>
    </div>
  );
}