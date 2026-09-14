import { useEffect, useState, useRef } from 'react';

const DEFAULT_EASING = (t) => 1 - Math.pow(1 - t, 3);

export function useAnimatedNumber(target, { duration = 600, decimals = 0 } = {}) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const startRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    fromRef.current = value;
    startRef.current = performance.now();

    const step = (now) => {
      const t = Math.min(1, (now - startRef.current) / duration);
      const eased = DEFAULT_EASING(t);
      const next = fromRef.current + (target - fromRef.current) * eased;
      setValue(next);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return decimals === 0 ? Math.round(value) : Number(value.toFixed(decimals));
}

export default useAnimatedNumber;