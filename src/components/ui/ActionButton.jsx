/**
 * ActionButton — secondary / outline / icon-only button used everywhere
 * that isn't the single primary CTA (Refresh, Edit, Delete, toolbar icons).
 * variant: 'default' | 'ghost' | 'danger'
 */
export default function ActionButton({
    children,
    icon: Icon,
    variant = 'default',
    size = 'md',
    className = '',
    ...rest
}) {
    const variants = {
        default:
            'bg-surface-2 border border-border text-text-1 hover:border-accent hover:text-accent',
        ghost:
            'bg-transparent border border-transparent text-text-3 hover:bg-surface-2 hover:text-text-1',
        danger:
            'bg-surface-2 border border-border text-text-3 hover:border-danger/50 hover:text-danger hover:bg-danger-soft',
    };

    const sizes = {
        sm: 'text-[11px] px-2.5 py-1.5 gap-1.5',
        md: 'text-sm px-3.5 py-2 gap-2',
    };

    return (
        <button
            className={`ds-focus-ring inline-flex items-center justify-center font-medium rounded-ds-sm transition-all duration-150
        cursor-pointer shadow-ds-sm active:scale-[0.97] disabled:active:scale-100
        ${variants[variant]} ${sizes[size]} ${className}`}
            {...rest}
        >
            {Icon && <Icon size={size === 'sm' ? 13 : 15} strokeWidth={2.25} />}
            {children}
        </button>
    );
}