import { Loader2 } from 'lucide-react';

/**
 * GradientButton — the single primary-action button style (Send, Save,
 * Add Contact). Reserve the gradient/glow treatment for the ONE important
 * action per screen, per the "accent colours only for important actions"
 * rule — everything else should use ActionButton (secondary/outline).
 */
export default function GradientButton({
    children,
    loading = false,
    disabled = false,
    type = 'button',
    className = '',
    ...rest
}) {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={`ds-focus-ring relative inline-flex items-center justify-center gap-2 rounded-ds-md px-4 py-2.5 text-sm font-medium text-white
        bg-gradient-to-br from-accent to-blue-700
        shadow-[0_4px_14px_rgba(59,130,246,0.35)]
        transition-all duration-200
        hover:shadow-[0_6px_20px_rgba(59,130,246,0.45)] hover:-translate-y-0.5
        active:translate-y-0 active:scale-[0.98] active:shadow-[0_2px_8px_rgba(59,130,246,0.35)]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100
        cursor-pointer ${className}`}
            {...rest}
        >
            {loading && <Loader2 size={15} className="animate-ds-spin" />}
            {children}
        </button>
    );
}