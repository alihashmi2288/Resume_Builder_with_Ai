import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cleanBulletLine,
  evaluateResumeReadiness,
  extractJsonObject,
  getHeadingCaseClass,
  getSkillList,
  getVisibleContactItems,
  inferResumeMimeType,
  isDefaultPlaceholderResume,
  isSectionEnabled,
  normalizeImportedResumeData,
  normalizeSectionOrder,
  reorderItemList,
  reorderSectionList,
  shouldRenderSection,
} from './resumeUtils';
import type { ResumeData } from '../types';

test('normalizeSectionOrder strips personal and preserves custom order', () => {
  assert.deepEqual(
    normalizeSectionOrder(['personal', 'experience', 'summary', 'skills']),
    ['experience', 'summary', 'skills', 'education', 'projects']
  );
  assert.deepEqual(normalizeSectionOrder(undefined), [
    'summary',
    'skills',
    'experience',
    'education',
    'projects',
  ]);
});

test('reorderSectionList moves source section to target position cleanly', () => {
  const base = ['summary', 'skills', 'experience', 'education', 'projects'];
  assert.deepEqual(reorderSectionList(base, 'projects', 'experience'), [
    'summary',
    'skills',
    'projects',
    'experience',
    'education',
  ]);
  assert.deepEqual(reorderSectionList(base, 'summary', 'education'), [
    'skills',
    'experience',
    'education',
    'summary',
    'projects',
  ]);
  assert.deepEqual(reorderSectionList(base, 'experience', 'experience'), base);
  assert.deepEqual(reorderSectionList(base, 'unknown', 'experience'), base);
});

test('reorderItemList reorders experience, education, or project items cleanly', () => {
  const items = [{ id: 'a', label: 1 }, { id: 'b', label: 2 }, { id: 'c', label: 3 }];
  assert.deepEqual(reorderItemList(items, 'c', 'a').map((i) => i.id), ['c', 'a', 'b']);
  assert.deepEqual(reorderItemList(items, 'a', 'c').map((i) => i.id), ['b', 'c', 'a']);
  assert.deepEqual(reorderItemList(items, 'b', 'missing').map((i) => i.id), ['a', 'b', 'c']);
});

test('cleanBulletLine removes leading bullet symbols without double bullets', () => {
  assert.equal(cleanBulletLine('• Spearheaded cloud migration'), 'Spearheaded cloud migration');
  assert.equal(cleanBulletLine('- Built React dashboard'), 'Built React dashboard');
  assert.equal(cleanBulletLine('  * Reduced latency by 35%'), 'Reduced latency by 35%');
});

test('getHeadingCaseClass maps uppercase, titlecase, and lowercase consistently', () => {
  assert.equal(getHeadingCaseClass(undefined), 'uppercase');
  assert.equal(getHeadingCaseClass('uppercase'), 'uppercase');
  assert.equal(getHeadingCaseClass('titlecase'), 'normal-case');
  assert.equal(getHeadingCaseClass('lowercase'), 'lowercase');
});

test('getVisibleContactItems and getSkillList omit empty values cleanly', () => {
  const data = {
    name: 'Alex',
    email: 'alex@example.com',
    phone: '  ',
    website: '',
    summary: 'Summary text',
    skills: 'React, , TypeScript,  ',
    education: [],
    experience: [],
    projects: [],
  } as ResumeData;

  assert.deepEqual(getVisibleContactItems(data), ['alex@example.com']);
  assert.deepEqual(getSkillList(data.skills), ['React', 'TypeScript']);
});

test('shouldRenderSection respects hiddenSections and empty section contents', () => {
  const data: ResumeData = {
    name: 'Alex Mercer',
    email: 'alex@example.com',
    phone: '555-0100',
    website: '',
    summary: 'Senior engineer.',
    skills: 'React, TypeScript',
    education: [{ id: '1', university: 'State Tech', degree: 'B.S.', startDate: '2018', endDate: '2022' }],
    experience: [{ id: '2', company: 'Acme', title: 'Engineer', startDate: '2022', endDate: 'Present', description: 'Built UI' }],
    projects: [],
    hiddenSections: ['experience'],
  };

  assert.equal(isSectionEnabled(data, 'experience'), false);
  assert.equal(shouldRenderSection(data, 'experience'), false);
  assert.equal(shouldRenderSection(data, 'projects'), false); // empty array
  assert.equal(shouldRenderSection(data, 'education'), true);
  assert.equal(shouldRenderSection(data, 'summary'), true);
});

test('evaluateResumeReadiness scores placeholder resume below 100 and excludes intentionally hidden sections cleanly', () => {
  const placeholder: ResumeData = {
    name: 'Your Name',
    email: 'youremail@example.com',
    phone: '123-456-7890',
    website: 'yourportfolio.com',
    summary: 'A brief professional summary about yourself.',
    skills: 'React, TypeScript, Node.js, Tailwind CSS',
    education: [
      {
        id: '1',
        university: 'University of Example',
        degree: 'B.S. in Computer Science',
        startDate: '2018',
        endDate: '2022',
      },
    ],
    experience: [
      {
        id: '2',
        company: 'Tech Corp',
        title: 'Software Engineer',
        startDate: '2022',
        endDate: 'Present',
        description: '- Developed web applications.',
      },
    ],
    projects: [],
  };

  const placeholderResult = evaluateResumeReadiness(placeholder);
  assert.equal(isDefaultPlaceholderResume(placeholder), true);
  assert.ok(placeholderResult.score < 50, `Expected placeholder score < 50, got ${placeholderResult.score}`);

  const strongResume: ResumeData = {
    ...placeholder,
    name: 'Alex Mercer',
    email: 'alex.mercer@email.com',
    summary:
      'Senior Software Engineer with 5+ years of experience building scalable distributed applications.',
    education: [
      {
        id: '1',
        university: 'State University of Technology',
        degree: 'B.S. in Computer Science',
        startDate: '2016',
        endDate: '2020',
      },
    ],
    experience: [
      {
        id: '2',
        company: 'Innovate Solutions Inc.',
        title: 'Senior Software Engineer',
        startDate: '2022',
        endDate: 'Present',
        description: '• Improved PageSpeed scores by 40% across 50k+ daily users.',
      },
    ],
  };

  const strongResult = evaluateResumeReadiness(strongResume);
  assert.equal(strongResult.score, 100);
  assert.equal(strongResult.tips.length, 0);

  // Student / fresher resume with Experience hidden should still score 100 when visible sections are complete
  const studentResume: ResumeData = {
    ...strongResume,
    experience: [],
    hiddenSections: ['experience'],
  };
  const studentResult = evaluateResumeReadiness(studentResume);
  assert.equal(studentResult.score, 100);
  assert.equal(studentResult.tips.length, 0);
});

test('inferResumeMimeType resolves pdf and docx even when browser gives octet-stream', () => {
  assert.equal(inferResumeMimeType('Jordan_Resume.PDF', 'application/octet-stream'), 'application/pdf');
  assert.equal(inferResumeMimeType('cv.pdf', ''), 'application/pdf');
  assert.equal(
    inferResumeMimeType('cv.docx', ''),
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  );
  assert.equal(inferResumeMimeType('scan.png', 'application/octet-stream'), 'image/png');
});

test('extractJsonObject strips markdown fences and normalizeImportedResumeData fills safe defaults and IDs', () => {
  const raw = '```json\n{"name":"Jordan Patel","headingCase":"titlecase","hiddenSections":["projects"],"skills":["React","TypeScript"],"experience":[{"company":"CloudScale","title":"Staff Engineer","startDate":"2021","endDate":"Present","description":["Built UI","Cut load by 40%"]}]}\n```';
  const parsed = extractJsonObject(raw);
  let seq = 0;
  const normalized = normalizeImportedResumeData(parsed, () => `id-${++seq}`);
  assert.equal(normalized.name, 'Jordan Patel');
  assert.equal(normalized.email, '');
  assert.equal(normalized.headingCase, 'titlecase');
  assert.deepEqual(normalized.hiddenSections, ['projects']);
  assert.equal(normalized.skills, 'React, TypeScript');
  assert.equal(normalized.experience.length, 1);
  assert.equal(normalized.experience[0].id, 'id-1');
  assert.equal(normalized.experience[0].description, 'Built UI\nCut load by 40%');
  assert.deepEqual(normalized.education, []);
  assert.deepEqual(normalized.projects, []);
});

