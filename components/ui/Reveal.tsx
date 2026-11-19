import * as React from 'react';
import { prefersReducedMotion } from '../../lib/animationUtils';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  className = '',
  delayMs = 0,
}) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = React.useState<boolean>(() => {
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      return true;
    }
    return false;
  });

  React.useEffect(() => {
    if (visible) return;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
    );

    observer.observe(node);

    // Safety fallback so scrolled content never remains hidden
    const fallbackTimer = window.setTimeout(() => {
      setVisible(true);
    }, 1500 + delayMs);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallbackTimer);
    };
  }, [visible, delayMs]);

  return (
    <div
      ref={ref}
      style={delayMs > 0 ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={`reveal-item transition-[opacity,transform] duration-500 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${className}`}
    >
      {children}
    </div>
  );
};
