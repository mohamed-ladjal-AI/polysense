import Card from '../ui/Card';
import Icon from '../ui/Icon';
import { aiRecommendation } from '../../data/dashboard';

export default function AiRecommendation() {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider">
        <Icon name="lightbulb" className="w-4 h-4 text-brand-primary" />
        AI RECOMMENDATION
      </div>

      <div className="mb-3">
        <span className="text-xs text-brand-primary block mb-1">Recommended action</span>
        <ul className="text-sm space-y-1">
          {aiRecommendation.actions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <span className="text-xs text-status-good block mb-1">Expected effect</span>
        <ul className="text-sm space-y-1">
          {aiRecommendation.effects.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className="flex-1 bg-brand-primary hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Apply Recommendation
        </button>
        <button
          type="button"
          aria-label="Copy recommendation"
          className="p-2 border border-brand-border rounded-lg hover:bg-brand-border transition-colors"
        >
          <Icon name="copy" className="w-5 h-5 text-brand-muted" />
        </button>
      </div>
    </Card>
  );
}