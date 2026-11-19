export type EasingFn = (t: number) => number;

export function clampProgress(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

export function easeOutCubic(t: number): number {
  const clamped = clampProgress(t);
  return 1 - Math.pow(1 - clamped, 3);
}

export function easeOutQuart(t: number): number {
  const clamped = clampProgress(t);
  return 1 - Math.pow(1 - clamped, 4);
}

export interface InterpolateCountOptions {
  elapsedMs: number;
  durationMs: number;
  from?: number;
  to: number;
  easing?: EasingFn;
}

/**
 * Computes an integer count between `from` and `to` for a given animation elapsed time.
 */
export function interpolateCount({
  elapsedMs,
  durationMs,
  from = 0,
  to,
  easing = easeOutQuart,
}: InterpolateCountOptions): number {
  if (!Number.isFinite(durationMs) || durationMs <= 0) {
    return Math.round(to);
  }
  if (!Number.isFinite(elapsedMs) || elapsedMs <= 0) {
    return Math.round(from);
  }
  const rawProgress = clampProgress(elapsedMs / durationMs);
  if (rawProgress >= 1) {
    return Math.round(to);
  }
  const eased = clampProgress(easing(rawProgress));
  return Math.round(from + (to - from) * eased);
}

/**
 * Computes continuous floating-point progress (0..target) for synchronized progress bars.
 */
export function interpolateBarPercentage(
  elapsedMs: number,
  durationMs: number,
  targetPercent: number,
  easing: EasingFn = easeOutQuart
): number {
  const safeTarget = Math.max(0, Math.min(100, targetPercent));
  if (!Number.isFinite(durationMs) || durationMs <= 0) return safeTarget;
  if (!Number.isFinite(elapsedMs) || elapsedMs <= 0) return 0;
  const rawProgress = clampProgress(elapsedMs / durationMs);
  if (rawProgress >= 1) return safeTarget;
  return Number((safeTarget * clampProgress(easing(rawProgress))).toFixed(2));
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
