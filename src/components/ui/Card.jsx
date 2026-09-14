export default function Card({ as: Tag = 'div', className = '', children, ...rest }) {
  return (
    <Tag
      className={`bg-brand-panel border border-brand-border rounded-xl p-4 ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}