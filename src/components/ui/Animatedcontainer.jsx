export default function AnimatedContainer({
    children,
    delay = 0,
    className = '',
}) {
    return (
        <div
            className={`h-full min-h-0 flex flex-col animate-ds-fade-in ${className}`}
            style={{
                animationDelay: `${delay}ms`,
                opacity: 0,
            }}
        >
            {children}
        </div>
    );
}