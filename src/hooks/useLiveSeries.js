import { useEffect, useRef, useState } from 'react';

function smoothNoise(i) {
  return (
    0.5 * Math.sin(i / 8) +
    0.25 * Math.sin(i / 3.1 + 1.3) +
    0.15 * Math.sin(i / 1.7 + 2.1)
  );
}

function seedValue(i, [min, max]) {
  const base = min + (max - min) * 0.5;
  const amp = (max - min) * 0.3;
  return base + amp * smoothNoise(i);
}

export default function useLiveSeries({
  length = 60,
  interval = 1000,
  bounds = [],
} = {}) {
  const [series, setSeries] = useState(() =>
    Array.from({ length }, (_, i) => bounds.map((b) => seedValue(i, b)))
  );

  const tickRef = useRef(0);
  const boundsRef = useRef(bounds);
  boundsRef.current = bounds;

  useEffect(() => {
    const id = setInterval(() => {
      tickRef.current += 1;
      setSeries((prev) => {
        const last = prev[prev.length - 1];
        const newPoint = last.map((v, idx) => {
          const range = boundsRef.current[idx] || [0, 1];
          const [min, max] = range;
          const span = max - min;
          const drift = (Math.random() - 0.5) * span * 0.06;
          const pull = (min + span * 0.5 - v) * 0.06;
          const noise = Math.sin(tickRef.current / 4 + idx) * span * 0.015;
          const next = v + drift + pull + noise;
          return Math.min(max, Math.max(min, next));
        });
        return [...prev.slice(1), newPoint];
      });
    }, interval);
    return () => clearInterval(id);
  }, [interval]);

  return series;
}