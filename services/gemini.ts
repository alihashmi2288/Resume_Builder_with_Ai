import { type ResumeData } from '../types';

export interface CoverLetterOptions {
  tone?: 'professional' | 'confident' | 'enthusiastic' | 'concise' | 'technical';
  companyName?: string;
  jobRole?: string;
}

export interface ATSAnalysisResult {
  score: number;
  suggestions: string[];
  missingKeywords: string[];
}

async function postGemini<T>(endpoint: string, payload: unknown): Promise<T> {
  const response = await fetch(`/api/gemini/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      (data as { error?: string })?.error ||
      `Request failed with status ${response.status}`;
    if (response.status === 429 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gemini-rate-limited'));
    }
    throw new Error(message);
  }

  return data as T;
}

export const generateAISummary = async (resumeText: string): Promise<string> => {
  const data = await postGemini<{ text: string }>('summary', { resumeText });
  return data.text;
};

export const enhanceAIBulletPoint = async (
  bulletPoint: string,
  context: string
): Promise<string> => {
  const data = await postGemini<{ text: string }>('enhance-bullet', {
    bulletPoint,
    context,
  });
  return data.text;
};

export const suggestAISkills = async (jobTitle: string): Promise<string> => {
  const data = await postGemini<{ text: string }>('suggest-skills', { jobTitle });
  return data.text;
};

export const generateAICoverLetter = async (
  resumeData: ResumeData,
  jobDescription: string,
  options?: CoverLetterOptions
): Promise<string> => {
  const data = await postGemini<{ text: string }>('cover-letter', {
    resumeData,
    jobDescription,
    options,
  });
  return data.text;
};

export const analyzeAndSuggestKeywords = async (
  resumeText: string,
  jobDescription: string
): Promise<string> => {
  const data = await postGemini<{ text: string }>('keywords', {
    resumeText,
    jobDescription,
  });
  return data.text;
};

export const generateAIResume = async (jobTitle: string): Promise<ResumeData> => {
  return postGemini<ResumeData>('generate-resume', { jobTitle });
};

export const analyzeResumeATS = async (
  resumeText: string,
  jobDescription: string
): Promise<ATSAnalysisResult> => {
  return postGemini<ATSAnalysisResult>('analyze-ats', {
    resumeText,
    jobDescription,
  });
};

export interface ParseResumePayload {
  rawText?: string;
  fileBase64?: string;
  mimeType?: string;
  fileName?: string;
}

export const parseResumeInput = async (
  payload: ParseResumePayload
): Promise<ResumeData> => {
  return postGemini<ResumeData>('parse-resume', payload);
};

export const tailorAISummary = async (
  resumeData: ResumeData,
  jobDescription: string
): Promise<string> => {
  const data = await postGemini<{ text: string }>('tailor-summary', {
    resumeData,
    jobDescription,
  });
  return data.text;
};