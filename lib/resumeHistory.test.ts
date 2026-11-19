import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyRedo,
  applyUndo,
  COALESCE_WINDOW_MS,
  EMPTY_DRAFT_HISTORY,
  getHistoryGroupKey,
  MAX_HISTORY_STEPS,
  recordHistoryChange,
} from './resumeHistory';
import type { ResumeData } from '../types';

const makeResume = (overrides: Partial<ResumeData> = {}): ResumeData => ({
  name: 'Alex Mercer',
  email: 'alex@example.com',
  phone: '555-0100',
  website: 'alex.dev',
  summary: 'Senior engineer.',
  skills: 'React, TypeScript',
  education: [
    { id: 'edu-1', university: 'State Tech', degree: 'B.S.', startDate: '2016', endDate: '2020' },
  ],
  experience: [
    { id: 'exp-1', company: 'Acme', title: 'Engineer', startDate: '2020', endDate: 'Present', description: 'Built web apps' },
    { id: 'exp-2', company: 'Beta', title: 'Intern', startDate: '2019', endDate: '2019', description: 'Wrote tests' },
  ],
  projects: [
    { id: 'proj-1', name: 'Portal', description: 'App portal', url: 'github.com/alex/portal' },
  ],
  sectionOrder: ['summary', 'skills', 'experience', 'education', 'projects'],
  hiddenSections: [],
  ...overrides,
});

test('applyUndo and applyRedo revert deletions cleanly and reset future on new edit', () => {
  const initial = makeResume();
  const afterDelete = makeResume({ experience: [initial.experience[0]] });

  const h1 = recordHistoryChange(EMPTY_DRAFT_HISTORY, initial, afterDelete, null, 1000);
  assert.equal(h1.past.length, 1);
  assert.equal(h1.future.length, 0);

  // Undo deletion -> original 2 experience entries restored
  const undone = applyUndo(h1, afterDelete);
  assert.ok(undone);
  assert.equal(undone.data.experience.length, 2);
  assert.equal(undone.data.experience[1].company, 'Beta');
  assert.equal(undone.history.past.length, 0);
  assert.equal(undone.history.future.length, 1);

  // Redo deletion -> back to 1 experience entry
  const redone = applyRedo(undone.history, undone.data);
  assert.ok(redone);
  assert.equal(redone.data.experience.length, 1);
  assert.equal(redone.history.past.length, 1);
  assert.equal(redone.history.future.length, 0);

  // New edit after Undo clears Redo future
  const afterRename = makeResume({ name: 'Jordan Mercer' });
  const hAfterNewEdit = recordHistoryChange(undone.history, undone.data, afterRename, 'text:name', 2000);
  assert.equal(hAfterNewEdit.future.length, 0);
  assert.equal(hAfterNewEdit.past.length, 1);
});

test('getHistoryGroupKey and recordHistoryChange coalesce rapid keystrokes but separate pauses, field switches, and AI jumps', () => {
  const r0 = makeResume({ name: 'A' });
  const r1 = makeResume({ name: 'Al' });
  const r2 = makeResume({ name: 'Ale' });
  const r3 = makeResume({ name: 'Alex' });

  const g1 = getHistoryGroupKey({ type: 'SET_FIELD', field: 'name' }, r0, r1);
  const g2 = getHistoryGroupKey({ type: 'SET_FIELD', field: 'name' }, r1, r2);
  const g3 = getHistoryGroupKey({ type: 'SET_FIELD', field: 'name' }, r2, r3);

  assert.equal(g1, 'text:name');
  let history = recordHistoryChange(EMPTY_DRAFT_HISTORY, r0, r1, g1, 1000);
  history = recordHistoryChange(history, r1, r2, g2, 1150);
  history = recordHistoryChange(history, r2, r3, g3, 1300);

  // Rapid typing collapsed into 1 undo step back to 'A'
  assert.equal(history.past.length, 1);
  assert.equal(history.past[0].name, 'A');

  // Typing after pause (> COALESCE_WINDOW_MS) creates a second undo step
  const r4 = makeResume({ name: 'Alex!' });
  history = recordHistoryChange(history, r3, r4, g3, 1300 + COALESCE_WINDOW_MS + 100);
  assert.equal(history.past.length, 2);
  assert.equal(history.past[1].name, 'Alex');

  // Large AI summary rewrite (> 12 chars) returns null groupKey -> always discrete
  const rAiSummary = makeResume({
    name: 'Alex!',
    summary: 'Staff frontend engineer specializing in resilient design systems and scalable web architecture.',
  });
  const aiKey = getHistoryGroupKey({ type: 'SET_FIELD', field: 'summary' }, r4, rAiSummary);
  assert.equal(aiKey, null);
  history = recordHistoryChange(history, r4, rAiSummary, aiKey, 2500);
  assert.equal(history.past.length, 3);
});

test('recordHistoryChange skips identical states and respects MAX_HISTORY_STEPS limit', () => {
  const base = makeResume();
  const unchanged = makeResume();
  const hSame = recordHistoryChange(EMPTY_DRAFT_HISTORY, base, unchanged, null, 1000);
  assert.equal(hSame.past.length, 0);

  let history = EMPTY_DRAFT_HISTORY;
  let current = makeResume({ name: 'User 0' });
  for (let i = 1; i <= MAX_HISTORY_STEPS + 10; i++) {
    const next = makeResume({ name: `User ${i}` });
    history = recordHistoryChange(history, current, next, null, 1000 + i * 1000);
    current = next;
  }

  assert.equal(history.past.length, MAX_HISTORY_STEPS);
  // Oldest retained snapshot should be User 10
  assert.equal(history.past[0].name, 'User 10');
});
