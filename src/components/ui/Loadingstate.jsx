import { Loader2 } from 'lucide-react';

/**
 * LoadingState — inline loading indicator for async fetches (metrics,
 * queue, contacts). Not a full-page blocker — designed to sit inline where
 * content will appear once loaded.
 */
export default function LoadingState({ label = 'Loading...', className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 text-sm text-text-3 py-6 ${className}`}>
      <Loader2 size={15} className="animate-ds-spin text-accent" />
      {label}
    </div>
  );
}