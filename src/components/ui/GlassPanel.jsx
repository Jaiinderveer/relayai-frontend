/**
 * GlassPanel — blurred, translucent surface for chrome that floats above
 * content (top bars, floating toolbars, command palette shell).
 */
export default function GlassPanel({ children, className = '', ...rest }) {
  return (
    <div
      className={`glass-surface border border-border rounded-ds-lg shadow-ds-sm ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}