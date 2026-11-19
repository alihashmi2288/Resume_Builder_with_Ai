import * as React from 'react';
import {
  easeOutQuart,
  interpolateCount,
  prefersReducedMotion,
} from '../../lib/animationUtils';

interface CountState {
  templates: number;
  passRate: number;
  privacy: number;
}

const TARGET_TEMPLATES = 9;
const TARGET_PASS_RATE = 98;
const TARGET_PRIVACY = 100;

export const StatStrip: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const hasTriggeredRef = React.useRef(false);

  const [counts, setCounts] = React.useState<CountState>(() => {
    if (prefersReducedMotion()) {
      return {
        templates: TARGET_TEMPLATES,
        passRate: TARGET_PASS_RATE,
        privacy: TARGET_PRIVACY,
      };
    }
    return {
      templates: 0,
      passRate: 0,
      privacy: 0,
    };
  });

  React.useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      hasTriggeredRef.current = true;
      setCounts({
        templates: TARGET_TEMPLATES,
        passRate: TARGET_PASS_RATE,
        privacy: TARGET_PRIVACY,
      });
      return;
    }

    const startOnce = () => {
      if (hasTriggeredRef.current) return;
      hasTriggeredRef.current = true;

      const startTime = performance.now();
      const totalDuration = 1250;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const templates = interpolateCount({
          elapsedMs: elapsed,
          durationMs: 850,
          from: 0,
          to: TARGET_TEMPLATES,
          easing: easeOutQuart,
        });
        const passRate = interpolateCount({
          elapsedMs: elapsed,
          durationMs: 1250,
          from: 0,
          to: TARGET_PASS_RATE,
          easing: easeOutQuart,
        });
        const privacy = interpolateCount({
          elapsedMs: elapsed,
          durationMs: 1050,
          from: 0,
          to: TARGET_PRIVACY,
          easing: easeOutQuart,
        });

        setCounts({ templates, passRate, privacy });

        if (elapsed < totalDuration) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          rafRef.current = null;
        }
      };

      rafRef.current = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          startOnce();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-12"
    >
      <div>
        <p
          data-testid="stat-templates-value"
          className="font-stat-display text-[#1c1c1e] dark:text-white tabular-nums"
        >
          {counts.templates}
        </p>
        <p className="text-sm font-medium text-[#555a6a] dark:text-[#a5a8b5] mt-1">
          ATS-Optimized Templates
        </p>
      </div>

      <div>
        <p
          data-testid="stat-ats-pass-value"
          className="font-stat-display text-[#d49700] dark:text-[#ffd02f] tabular-nums"
        >
          {counts.passRate}%
        </p>
        <p className="text-sm font-medium text-[#555a6a] dark:text-[#a5a8b5] mt-1">
          ATS Scanner Pass Rate
        </p>
      </div>

      <div>
        <p
          data-testid="stat-privacy-value"
          className="font-stat-display text-[#1c1c1e] dark:text-white tabular-nums"
        >
          {counts.privacy}%
        </p>
        <p className="text-sm font-medium text-[#555a6a] dark:text-[#a5a8b5] mt-1">
          Private &amp; Client-Side
        </p>
      </div>

      <div>
        <p className="font-stat-display text-[#1c1c1e] dark:text-white tabular-nums">
          0s
        </p>
        <p className="text-sm font-medium text-[#555a6a] dark:text-[#a5a8b5] mt-1">
          No Signup Required
        </p>
      </div>
    </div>
  );
};
