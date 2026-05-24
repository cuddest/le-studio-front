import { useEffect, useMemo, useState } from 'react';

export function useMediaSlider(items, intervalMs = 6000) {
  const safeItems = useMemo(() => (Array.isArray(items) ? items : []), [items]);
  const [activeIndex, setActiveIndex] = useState(0);

  const normalizedIndex = safeItems.length
    ? ((activeIndex % safeItems.length) + safeItems.length) % safeItems.length
    : 0;

  useEffect(() => {
    if (safeItems.length <= 1) return undefined;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % safeItems.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [safeItems.length, intervalMs]);

  const goTo = (index) => {
    if (!safeItems.length) return;
    const normalized = ((index % safeItems.length) + safeItems.length) % safeItems.length;
    setActiveIndex(normalized);
  };

  const next = () => goTo(activeIndex + 1);
  const prev = () => goTo(activeIndex - 1);

  return {
    activeIndex: normalizedIndex,
    activeItem: safeItems[normalizedIndex],
    hasItems: safeItems.length > 0,
    hasMany: safeItems.length > 1,
    next,
    prev,
    goTo,
  };
}
