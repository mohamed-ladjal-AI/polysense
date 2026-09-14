export default function Sparkline({ points, colorClass = 'stroke-status-good' }) {
  return (
    <svg
      className={`w-full h-4 ml-auto ${colorClass}`}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 100 20"
      aria-hidden="true"
    >
      <polyline points={points} strokeWidth="1.5" fill="none" />
    </svg>
  );
}