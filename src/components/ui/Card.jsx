/**
 * Card — base surface used by every panel in the app (KPI grids, chat
 * containers, form panels, list rows). Wraps the existing surface-2/border
 * pairing already used ad-hoc across pages so it only needs to be defined
 * once.
 */
export default function Card({
  children,
  as: Tag = 'div',
  hover = false,
  glow = false,
  padding = 'p-5',
  className = '',
  ...rest
}) {
  return (
    <Tag
      className={`bg-surface-2 border border-border rounded-ds-lg shadow-ds-sm ${padding} ${hover ? 'transition-all duration-200 hover:border-accent hover:-translate-y-0.5' : ''
        } ${glow ? 'hover:shadow-glow' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}