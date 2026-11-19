import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clampProgress,
  easeOutCubic,
  easeOutQuart,
  interpolateBarPercentage,
  interpolateCount,
} from './animationUtils';

test('clampProgress clamps values cleanly between 0 and 1', () => {
  assert.equal(clampProgress(-0.5), 0);
  assert.equal(clampProgress(0), 0);
  assert.equal(clampProgress(0.42), 0.42);
  assert.equal(clampProgress(1.5), 1);
  assert.equal(clampProgress(Number.NaN), 0);
});

test('easeOutCubic and easeOutQuart start at 0, rise faster early, and finish at 1', () => {
  assert.equal(easeOutCubic(0), 0);
  assert.equal(easeOutCubic(1), 1);
  assert.equal(easeOutQuart(0), 0);
  assert.equal(easeOutQuart(1), 1);
  assert.ok(easeOutCubic(0.5) > 0.5);
  assert.ok(easeOutQuart(0.5) > easeOutCubic(0.5));
});

test('interpolateCount animates smoothly from 0 to 98 and clamps endpoints', () => {
  assert.equal(interpolateCount({ elapsedMs: 0, durationMs: 1200, to: 98 }), 0);
  assert.equal(interpolateCount({ elapsedMs: -50, durationMs: 1200, to: 98 }), 0);

  const quarter = interpolateCount({ elapsedMs: 300, durationMs: 1200, to: 98 });
  const half = interpolateCount({ elapsedMs: 600, durationMs: 1200, to: 98 });
  const threeQuarters = interpolateCount({ elapsedMs: 900, durationMs: 1200, to: 98 });

  assert.ok(quarter > 0 && quarter < half, `Expected 0 < ${quarter} < ${half}`);
  assert.ok(half < threeQuarters, `Expected ${half} < ${threeQuarters}`);
  assert.ok(threeQuarters <= 98, `Expected ${threeQuarters} <= 98`);

  assert.equal(interpolateCount({ elapsedMs: 1200, durationMs: 1200, to: 98 }), 98);
  assert.equal(interpolateCount({ elapsedMs: 2500, durationMs: 1200, to: 98 }), 98);
});

test('interpolateCount handles zero duration and custom start values', () => {
  assert.equal(interpolateCount({ elapsedMs: 100, durationMs: 0, to: 98 }), 98);
  assert.equal(interpolateCount({ elapsedMs: 0, durationMs: 1000, from: 20, to: 100 }), 20);
  assert.equal(interpolateCount({ elapsedMs: 1000, durationMs: 1000, from: 20, to: 100 }), 100);
});

test('interpolateBarPercentage tracks synchronized bar width up to targetPercent', () => {
  assert.equal(interpolateBarPercentage(0, 1200, 98), 0);
  const mid = interpolateBarPercentage(600, 1200, 98);
  assert.ok(mid > 50 && mid < 98, `Expected mid bar width between 50 and 98, got ${mid}`);
  assert.equal(interpolateBarPercentage(1200, 1200, 98), 98);
  assert.equal(interpolateBarPercentage(1200, 1200, 140), 100);
});
