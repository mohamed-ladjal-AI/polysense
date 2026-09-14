import Card from '../ui/Card';
import Icon from '../ui/Icon';
import { predictions } from '../../data/dashboard';

const directionClass = {
  up: '',
  down: '',
  'diagonal-up': 'rotate-45',
  'diagonal-down': '-rotate-45',
};

function getArrowIcon(direction) {
  return direction === 'down' || direction === 'diagonal-down' ? 'arrowDown' : 'arrowUp';
}

const valueColorMap = {
  good: 'text-status-good',
  warning: 'text-status-warning',
  danger: 'text-status-danger',
};

function PredictionRow({ prediction }) {
  const valueColor = valueColorMap[prediction.status];
  const rotate = directionClass[prediction.direction];

  return (
    <div>
      <div className="flex justify-between items-end mb-1 text-xs gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Icon name={prediction.icon} className="w-4 h-4 text-brand-muted shrink-0" />
          <span className="text-brand-text truncate">{prediction.name}</span>
        </div>
        <div className="flex gap-3 md:gap-4 shrink-0">
          <span className="text-brand-muted">{prediction.nowLabel}</span>
          <span className="text-brand-muted flex flex-col items-end leading-tight">
            {prediction.futureLabel}
            <span className={`${valueColor} font-semibold text-sm flex items-center gap-1`}>
              {prediction.futureValue}
              {prediction.futureUnit}
              <Icon
                name={getArrowIcon(prediction.direction)}
                className={`w-3 h-3 ${rotate}`}
              />
            </span>
          </span>
        </div>
      </div>
      <div className="h-1.5 w-full bg-brand-dark rounded-full overflow-hidden flex">
        {prediction.segments.map((seg, i) => (
          <div
            key={i}
            className={`h-full ${seg.color} ${seg.borderLeft ? 'border-l border-brand-dark' : ''}`}
            style={{
              width: `${seg.width}%`,
              ...(seg.negativeMargin ? { marginLeft: `-${seg.negativeMargin}%` } : {}),
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function PredictionsPanel() {
  return (
    <Card className="flex-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-sm">
          PREDICTIONS
          <span className="text-brand-muted font-normal text-xs"> (Next 30 min)</span>
        </h2>
        <a href="#" className="text-xs text-brand-primary hover:underline">
          View all
        </a>
      </div>
      <div className="space-y-4">
        {predictions.map((p) => (
          <PredictionRow key={p.id} prediction={p} />
        ))}
      </div>
    </Card>
  );
}