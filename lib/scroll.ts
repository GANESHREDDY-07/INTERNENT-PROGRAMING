let frame = 0;

export function scrollToTarget(target: Element | null) {
  if (!target) return;

  const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  const top = Math.max(
    0,
    target.getBoundingClientRect().top + window.scrollY - margin,
  );
  const start = window.scrollY;
  const distance = top - start;

  cancelAnimationFrame(frame);
  if (Math.abs(distance) < 2) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, top);
    return;
  }

  const duration = Math.min(900, 380 + Math.abs(distance) * 0.16);
  const begin = performance.now();
  const ease = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const tick = (now: number) => {
    const progress = Math.min(1, (now - begin) / duration);
    window.scrollTo(0, start + distance * ease(progress));
    if (progress < 1) frame = requestAnimationFrame(tick);
  };

  frame = requestAnimationFrame(tick);
}

export function scrollToId(id: string) {
  scrollToTarget(document.getElementById(id));
}
