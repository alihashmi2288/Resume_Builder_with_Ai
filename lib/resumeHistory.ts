import type { ResumeData } from '../types';

export const MAX_HISTORY_STEPS = 50;
export const COALESCE_WINDOW_MS = 800;

export interface DraftHistory {
  past: ResumeData[];
  future: ResumeData[];
  lastGroupKey: string | null;
  lastTimestamp: number;
}

export const EMPTY_DRAFT_HISTORY: DraftHistory = {
  past: [],
  future: [],
  lastGroupKey: null,
  lastTimestamp: 0,
};

export interface HistoryActionMeta {
  type: string;
  field?: string;
  id?: string;
  data?: Record<string, unknown>;
}

const TEXT_FIELDS = new Set(['name', 'email', 'phone', 'website', 'summary', 'skills']);

/**
 * Determines whether two rapid consecutive edits belong to the same typing burst
 * so undo reverts a word/thought instead of single keystrokes, while bulk AI fills,
 * tag clicks, deletes, section reorders, and visibility toggles always get their own undo step.
 */
export function getHistoryGroupKey(
  action: HistoryActionMeta,
  prevData: ResumeData,
  nextData: ResumeData
): string | null {
  if (action.type === 'SET_FIELD' && action.field && TEXT_FIELDS.has(action.field)) {
    const prevVal = String((prevData as unknown as Record<string, unknown>)[action.field] ?? '');
    const nextVal = String((nextData as unknown as Record<string, unknown>)[action.field] ?? '');
    if (Math.abs(nextVal.length - prevVal.length) > 12) {
      return null;
    }
    return `text:${action.field}`;
  }

  if (action.type === 'UPDATE_ITEM' && action.field && action.id && action.data) {
    const keys = Object.keys(action.data).sort();
    if (keys.length === 1) {
      const prop = keys[0];
      const val = action.data[prop];
      if (typeof val === 'string') {
        const prevList = (prevData as unknown as Record<string, unknown[]>)[action.field] || [];
        const prevItem = prevList.find(
          (item) => typeof item === 'object' && item !== null && (item as { id?: string }).id === action.id
        ) as Record<string, unknown> | undefined;
        const prevVal = String(prevItem?.[prop] ?? '');
        // Large replacement (e.g. STAR AI rewrite or Current Role checkbox toggle) creates discrete step
        if (Math.abs(val.length - prevVal.length) > 12 || (prop === 'endDate' && val === 'Present' && prevVal !== 'Present')) {
          return null;
        }
        return `item:${action.field}:${action.id}:${prop}`;
      }
    }
  }

  return null;
}

export function cloneResumeData(data: ResumeData): ResumeData {
  return JSON.parse(JSON.stringify(data)) as ResumeData;
}

export function isSameResumeData(a: ResumeData, b: ResumeData): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function recordHistoryChange(
  history: DraftHistory | undefined,
  prevData: ResumeData,
  nextData: ResumeData,
  groupKey: string | null,
  now: number = Date.now()
): DraftHistory {
  const base = history || EMPTY_DRAFT_HISTORY;

  if (isSameResumeData(prevData, nextData)) {
    return base;
  }

  const withinCoalesceWindow =
    groupKey !== null &&
    base.lastGroupKey === groupKey &&
    base.past.length > 0 &&
    now - base.lastTimestamp <= COALESCE_WINDOW_MS;

  if (withinCoalesceWindow) {
    return {
      past: base.past,
      future: [],
      lastGroupKey: groupKey,
      lastTimestamp: now,
    };
  }

  const nextPast = [...base.past, cloneResumeData(prevData)];
  const trimmedPast =
    nextPast.length > MAX_HISTORY_STEPS
      ? nextPast.slice(nextPast.length - MAX_HISTORY_STEPS)
      : nextPast;

  return {
    past: trimmedPast,
    future: [],
    lastGroupKey: groupKey,
    lastTimestamp: now,
  };
}

export function applyUndo(
  history: DraftHistory | undefined,
  currentData: ResumeData
): { data: ResumeData; history: DraftHistory } | null {
  const base = history || EMPTY_DRAFT_HISTORY;
  if (base.past.length === 0) {
    return null;
  }

  const previous = base.past[base.past.length - 1];
  const nextPast = base.past.slice(0, -1);
  const nextFuture = [cloneResumeData(currentData), ...base.future].slice(0, MAX_HISTORY_STEPS);

  return {
    data: cloneResumeData(previous),
    history: {
      past: nextPast,
      future: nextFuture,
      lastGroupKey: null,
      lastTimestamp: 0,
    },
  };
}

export function applyRedo(
  history: DraftHistory | undefined,
  currentData: ResumeData
): { data: ResumeData; history: DraftHistory } | null {
  const base = history || EMPTY_DRAFT_HISTORY;
  if (base.future.length === 0) {
    return null;
  }

  const [nextState, ...remainingFuture] = base.future;
  const nextPast = [...base.past, cloneResumeData(currentData)].slice(-MAX_HISTORY_STEPS);

  return {
    data: cloneResumeData(nextState),
    history: {
      past: nextPast,
      future: remainingFuture,
      lastGroupKey: null,
      lastTimestamp: 0,
    },
  };
}
