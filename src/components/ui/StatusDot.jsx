export default function StatusDot({ color = 'good', className = 'w-2 h-2' }) {
  const colorClass = {
    good: 'bg-status-good',
    warning: 'bg-status-warning',
    danger: 'bg-status-danger',
    info: 'bg-status-info',
  }[color];

  return <span className={`${colorClass} ${className} rounded-full inline-block shrink-0`} />;
}