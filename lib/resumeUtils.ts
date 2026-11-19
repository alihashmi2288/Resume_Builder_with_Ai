import type { HeadingCase, ResumeData } from '../types';

export const DEFAULT_SECTION_ORDER = [
  'summary',
  'skills',
  'experience',
  'education',
  'projects',
] as const;

export type SectionId = (typeof DEFAULT_SECTION_ORDER)[number];

export function normalizeSectionOrder(order?: string[]): string[] {
  const validSet = new Set<string>(DEFAULT_SECTION_ORDER);
  const seen = new Set<string>();
  const normalized: string[] = [];

  if (Array.isArray(order)) {
    for (const item of order) {
      if (validSet.has(item) && !seen.has(item)) {
        seen.add(item);
        normalized.push(item);
      }
    }
  }

  for (const fallback of DEFAULT_SECTION_ORDER) {
    if (!seen.has(fallback)) {
      seen.add(fallback);
      normalized.push(fallback);
    }
  }

  return normalized;
}

export function reorderSectionList(
  order: string[] | undefined,
  sourceId: string,
  targetId: string
): string[] {
  const normalized = normalizeSectionOrder(order);
  if (sourceId === targetId) return normalized;

  const fromIndex = normalized.indexOf(sourceId);
  const toIndex = normalized.indexOf(targetId);
  if (fromIndex === -1 || toIndex === -1) return normalized;

  const next = [...normalized];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

export function reorderItemList<T extends { id: string }>(
  items: T[] | undefined,
  activeId: string,
  overId: string
): T[] {
  const list = Array.isArray(items) ? [...items] : [];
  if (!activeId || !overId || activeId === overId) return list;

  const fromIndex = list.findIndex((item) => item.id === activeId);
  const toIndex = list.findIndex((item) => item.id === overId);
  if (fromIndex === -1 || toIndex === -1) return list;

  const [moved] = list.splice(fromIndex, 1);
  list.splice(toIndex, 0, moved);
  return list;
}

export function normalizeHiddenSections(hidden?: string[]): SectionId[] {
  const validSet = new Set<string>(DEFAULT_SECTION_ORDER);
  if (!Array.isArray(hidden)) return [];
  const seen = new Set<SectionId>();
  for (const item of hidden) {
    if (validSet.has(item)) {
      seen.add(item as SectionId);
    }
  }
  return Array.from(seen);
}

export function isSectionEnabled(data: ResumeData, sectionId: SectionId): boolean {
  return !Array.isArray(data.hiddenSections) || !data.hiddenSections.includes(sectionId);
}

export function getSkillList(skills?: string): string[] {
  return (skills || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function getVisibleContactItems(data: ResumeData): string[] {
  return [data.email, data.phone, data.website]
    .map((item) => (item || '').trim())
    .filter(Boolean);
}

export function shouldRenderSection(data: ResumeData, sectionId: SectionId): boolean {
  if (!isSectionEnabled(data, sectionId)) {
    return false;
  }
  switch (sectionId) {
    case 'summary':
      return Boolean((data.summary || '').trim());
    case 'skills':
      return getSkillList(data.skills).length > 0;
    case 'experience':
      return Array.isArray(data.experience) && data.experience.length > 0;
    case 'education':
      return Array.isArray(data.education) && data.education.length > 0;
    case 'projects':
      return Array.isArray(data.projects) && data.projects.length > 0;
    default:
      return true;
  }
}

export function getHeadingCaseClass(headingCase?: HeadingCase): string {
  switch (headingCase) {
    case 'lowercase':
      return 'lowercase';
    case 'titlecase':
      return 'normal-case';
    case 'uppercase':
    default:
      return 'uppercase';
  }
}

export function cleanBulletLine(line: string): string {
  return line.replace(/^\s*[-•*]\s*/, '').trim();
}

export interface ReadinessChecks {
  hasIdentity: boolean;
  hasSummary: boolean;
  hasSkills: boolean;
  hasExperience: boolean;
  hasMetrics: boolean;
  hasEducation: boolean;
}

export interface ReadinessResult {
  score: number;
  checks: ReadinessChecks;
  tips: string[];
}

const PLACEHOLDER_NAMES = new Set(['your name', '']);
const PLACEHOLDER_EMAILS = new Set(['youremail@example.com', '']);
const PLACEHOLDER_SUMMARIES = new Set([
  'a brief professional summary about yourself.',
  '',
]);

export function evaluateResumeReadiness(data: ResumeData): ReadinessResult {
  const nameClean = (data.name || '').trim().toLowerCase();
  const emailClean = (data.email || '').trim().toLowerCase();
  const summaryClean = (data.summary || '').trim().toLowerCase();

  const summaryEnabled = isSectionEnabled(data, 'summary');
  const skillsEnabled = isSectionEnabled(data, 'skills');
  const experienceEnabled = isSectionEnabled(data, 'experience');
  const educationEnabled = isSectionEnabled(data, 'education');
  const projectsEnabled = isSectionEnabled(data, 'projects');

  const hasIdentity =
    !PLACEHOLDER_NAMES.has(nameClean) &&
    !PLACEHOLDER_EMAILS.has(emailClean) &&
    emailClean.includes('@');

  const hasSummary =
    summaryEnabled &&
    !PLACEHOLDER_SUMMARIES.has(summaryClean) &&
    summaryClean.length >= 40;

  const skillList = getSkillList(data.skills);
  const hasSkills = skillsEnabled && skillList.length >= 4;

  const validExperience = (data.experience || []).filter(
    (exp) =>
      Boolean(exp.title?.trim()) &&
      Boolean(exp.company?.trim()) &&
      exp.company.trim().toLowerCase() !== 'tech corp'
  );
  const anyExperience = (data.experience || []).some(
    (exp) =>
      Boolean(exp.title?.trim()) &&
      Boolean(exp.company?.trim()) &&
      Boolean(exp.description?.trim())
  );
  const hasExperience =
    experienceEnabled && (validExperience.length > 0 || (hasIdentity && anyExperience));

  const metricDescriptions = [
    ...(experienceEnabled ? (data.experience || []).map((e) => e.description || '') : []),
    ...(projectsEnabled ? (data.projects || []).map((p) => p.description || '') : []),
  ].join(' ');
  const metricsApplicable = experienceEnabled || (projectsEnabled && (data.projects || []).length > 0);
  const hasMetrics =
    metricsApplicable &&
    /\d+%|\$\d+|\b\d+[kKmMbB+]?\b|\b\d+x\b/.test(metricDescriptions);

  const hasEducation =
    educationEnabled &&
    (data.education || []).some(
      (edu) =>
        Boolean(edu.degree?.trim()) &&
        Boolean(edu.university?.trim()) &&
        (edu.university.trim().toLowerCase() !== 'university of example' || hasIdentity)
    );

  let earned = 0;
  let totalPossible = 20; // Identity is always part of a resume
  if (hasIdentity) earned += 20;

  if (summaryEnabled) {
    totalPossible += 15;
    if (hasSummary) earned += 15;
  }
  if (skillsEnabled) {
    totalPossible += 15;
    if (hasSkills) earned += 15;
  }
  if (experienceEnabled) {
    totalPossible += 25;
    if (hasExperience) earned += 25;
  }
  if (metricsApplicable) {
    totalPossible += 15;
    if (hasMetrics) earned += 15;
  }
  if (educationEnabled) {
    totalPossible += 10;
    if (hasEducation) earned += 10;
  }

  const score = totalPossible > 0 ? Math.min(100, Math.round((earned / totalPossible) * 100)) : 0;

  const tips: string[] = [];
  if (!hasIdentity) tips.push('Replace placeholder name and email with your real contact info.');
  if (summaryEnabled && !hasSummary) tips.push('Write a tailored 2–3 sentence summary (at least 40 characters).');
  if (skillsEnabled && !hasSkills) tips.push('Add at least 4 relevant technical or domain skills.');
  if (experienceEnabled && !hasExperience) tips.push('Add work experience with your real role, company, and bullet points.');
  if (metricsApplicable && !hasMetrics) tips.push('Quantify achievements with numbers, percentages, or scale (e.g. "35%", "$40K", "50k+ users").');
  if (educationEnabled && !hasEducation) tips.push('Include your degree and institution.');

  return {
    score,
    checks: {
      hasIdentity,
      hasSummary,
      hasSkills,
      hasExperience,
      hasMetrics,
      hasEducation,
    },
    tips,
  };
}

export function isDefaultPlaceholderResume(data: ResumeData): boolean {
  return (
    (data.name || '').trim().toLowerCase() === 'your name' &&
    (data.email || '').trim().toLowerCase() === 'youremail@example.com'
  );
}

const EXTENSION_MIME_MAP: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.txt': 'text/plain',
  '.md': 'text/markdown',
  '.json': 'application/json',
};

export function inferResumeMimeType(fileName?: string, providedMimeType?: string): string {
  const cleanProvided = (providedMimeType || '').trim().toLowerCase();
  const cleanName = (fileName || '').trim().toLowerCase();
  const dotIdx = cleanName.lastIndexOf('.');
  const ext = dotIdx >= 0 ? cleanName.slice(dotIdx) : '';
  const mappedFromExt = ext ? EXTENSION_MIME_MAP[ext] : undefined;

  if (
    !cleanProvided ||
    cleanProvided === 'application/octet-stream' ||
    cleanProvided === 'binary/octet-stream'
  ) {
    return mappedFromExt || cleanProvided || 'application/octet-stream';
  }

  // Some browsers label .md or .pdf generically as text/plain or octet-stream; trust .pdf/.docx/.json extension
  if (ext === '.pdf' || ext === '.docx' || ext === '.json') {
    return mappedFromExt!;
  }

  return cleanProvided;
}

export function extractJsonObject<T = Record<string, unknown>>(rawText: string): T {
  const trimmed = (rawText || '').trim();
  if (!trimmed) {
    throw new Error('Model returned an empty JSON response.');
  }

  // Strip optional markdown code fences (```json ... ``` or ``` ... ```)
  const unfenced = trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    return JSON.parse(unfenced) as T;
  } catch {
    const start = unfenced.indexOf('{');
    const end = unfenced.lastIndexOf('}');
    if (start !== -1 && end > start) {
      return JSON.parse(unfenced.slice(start, end + 1)) as T;
    }
    throw new Error('Could not parse structured JSON from AI response.');
  }
}

export function normalizeImportedResumeData(
  raw: Record<string, unknown>,
  createId: () => string = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
): ResumeData {
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : v != null ? String(v).trim() : '');

  const rawEdu = Array.isArray(raw.education) ? raw.education : [];
  const rawExp = Array.isArray(raw.experience) ? raw.experience : [];
  const rawProj = Array.isArray(raw.projects) ? raw.projects : [];

  const themeColor = raw.themeColor;
  const fontSize = raw.fontSize;
  const lineHeight = raw.lineHeight;
  const margins = raw.margins;
  const headingCase = raw.headingCase;

  return {
    name: str(raw.name),
    email: str(raw.email),
    phone: str(raw.phone),
    website: str(raw.website),
    summary: str(raw.summary),
    skills: Array.isArray(raw.skills)
      ? raw.skills.map((s) => str(s)).filter(Boolean).join(', ')
      : str(raw.skills),
    education: rawEdu
      .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
      .map((item) => ({
        id: str(item.id) || createId(),
        university: str(item.university),
        degree: str(item.degree),
        startDate: str(item.startDate),
        endDate: str(item.endDate),
      })),
    experience: rawExp
      .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
      .map((item) => ({
        id: str(item.id) || createId(),
        company: str(item.company),
        title: str(item.title),
        startDate: str(item.startDate),
        endDate: str(item.endDate),
        description: Array.isArray(item.description)
          ? item.description.map((d) => str(d)).filter(Boolean).join('\n')
          : str(item.description),
      })),
    projects: rawProj
      .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
      .map((item) => ({
        id: str(item.id) || createId(),
        name: str(item.name),
        description: str(item.description),
        url: str(item.url),
      })),
    ...(typeof themeColor === 'string' ? { themeColor: themeColor as ResumeData['themeColor'] } : {}),
    ...(typeof fontSize === 'string' ? { fontSize: fontSize as ResumeData['fontSize'] } : {}),
    ...(typeof lineHeight === 'string' ? { lineHeight: lineHeight as ResumeData['lineHeight'] } : {}),
    ...(typeof margins === 'string' ? { margins: margins as ResumeData['margins'] } : {}),
    ...(headingCase === 'uppercase' || headingCase === 'titlecase' || headingCase === 'lowercase'
      ? { headingCase }
      : {}),
    sectionOrder: Array.isArray(raw.sectionOrder)
      ? normalizeSectionOrder(raw.sectionOrder as string[])
      : [...DEFAULT_SECTION_ORDER],
    hiddenSections: Array.isArray(raw.hiddenSections)
      ? normalizeHiddenSections(raw.hiddenSections as string[])
      : [],
  };
}

