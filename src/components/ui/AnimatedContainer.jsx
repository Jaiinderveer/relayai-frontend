/**
 * AnimatedContainer — fade/slide-in wrapper used for page transitions and
 * for staggering list items (KPI grids, contact cards) in on mount. Pure
 * CSS animation, no dependency added.
 */
export default function AnimatedContainer({ children, delay = 0, className = '' }) {
    return (
        <div
            className={`animate-ds-fade-in ${className}`}
            style={{ animationDelay: `${delay}ms`, opacity: 0 }}
        >
            {children}
        </div>
    );
}