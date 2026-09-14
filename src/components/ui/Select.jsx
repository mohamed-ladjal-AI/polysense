import { Icon } from './Icon';

export default function Select({ options, ariaLabel }) {
  return (
    <div className="relative">
      <select
        aria-label={ariaLabel}
        className="appearance-none bg-brand-panel border border-brand-border text-brand-text text-sm rounded-lg pl-4 pr-10 py-1.5 focus:outline-none focus:border-brand-primary"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-brand-muted">
        <Icon name="chevronDown" className="w-4 h-4" />
      </div>
    </div>
  );
}