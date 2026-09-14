export default function Gauge({ value, unit, dasharray, colorClass = 'text-status-good', min = 0, max }) {
  return (
    <div className="relative w-16 h-16">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
        <path
          className="text-brand-dark"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeDasharray="75, 100"
          strokeWidth="3"
        />
        <path
          className={colorClass}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeDasharray={`${dasharray}, 100`}
          strokeWidth="3"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`${colorClass} font-bold text-lg leading-none mt-1`}>{value}</span>
        <span className="text-[10px] text-brand-muted">{unit}</span>
      </div>
    </div>
  );
}