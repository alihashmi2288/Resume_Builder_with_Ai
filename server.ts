import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { type Request, type Response } from 'express';
import { GoogleGenAI, ThinkingLevel, Type, type GenerateContentParameters, type GenerateContentResponse } from '@google/genai';
import mammoth from 'mammoth';
import { extractText, getDocumentProxy } from 'unpdf';
import {
  extractJsonObject,
  inferResumeMimeType,
  normalizeImportedResumeData,
} from './lib/resumeUtils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEXT_MODEL = 'gemini-4-hydrogen';

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('AI service key is not configured. Please set GEMINI_API_KEY in Settings > Secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function generateContentWithRetry(
  ai: GoogleGenAI,
  params: GenerateContentParameters,
  maxAttempts = 3
): Promise<GenerateContentResponse> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (error) {
      lastError = error;
      const errObj = error as { status?: number; message?: string };
      const msg = errObj?.message || '';
      const status = typeof errObj?.status === 'number' ? errObj.status : 0;
      const isTransient =
        status === 429 ||
        status === 503 ||
        status === 502 ||
        msg.includes('503') ||
        msg.includes('UNAVAILABLE') ||
        msg.includes('429');

      if (!isTransient || attempt === maxAttempts) {
        throw error;
      }
      const delayMs = 600 * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw lastError;
}

function parseFriendlyErrorMessage(error: unknown): { statusCode: number; message: string } {
  const errObj = error as { status?: number; message?: string };
  let rawMessage =
    errObj?.message ||
    (error instanceof Error ? error.message : 'An unexpected error occurred while processing your request.');
  let statusCode =
    typeof errObj?.status === 'number' && errObj.status >= 400 && errObj.status < 600
      ? errObj.status
      : 500;

  // Unwrap JSON error payloads returned by @google/genai
  if (rawMessage.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(rawMessage) as {
        error?: { code?: number; message?: string; status?: string };
      };
      if (parsed?.error?.code && parsed.error.code >= 400 && parsed.error.code < 600) {
        statusCode = parsed.error.code;
      }
      if (parsed?.error?.message) {
        rawMessage = parsed.error.message;
      }
    } catch {
      // Keep original string
    }
  }

  if (statusCode === 503 || rawMessage.toLowerCase().includes('high demand')) {
    rawMessage = 'AI Assistance is temporarily busy due to high demand. Please retry in a few seconds.';
  } else if (statusCode === 429) {
    rawMessage = 'Rate limit reached for AI Assistance. Please wait a moment and try again.';
  }

  return { statusCode, message: rawMessage };
}

function handleApiError(res: Response, error: unknown): void {
  console.error('Gemini API route error:', error);
  const { statusCode, message } = parseFriendlyErrorMessage(error);
  res.status(statusCode).json({ error: message });
}

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '15mb' }));

  app.post('/api/gemini/summary', async (req: Request, res: Response) => {
    try {
      const { resumeText } = req.body as { resumeText?: string };
      if (!resumeText) {
        res.status(400).json({ error: 'resumeText is required.' });
        return;
      }
      const ai = getAiClient();
      const response = await generateContentWithRetry(ai, {
        model: TEXT_MODEL,
        contents: `Based on the following resume details, write a professional and compelling summary of 2-3 sentences. Focus on key skills and experience. Resume Details:\n\n${resumeText}`,
        config: { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } },
      });
      res.json({ text: (response.text ?? '').trim() });
    } catch (error) {
      handleApiError(res, error);
    }
  });

  app.post('/api/gemini/enhance-bullet', async (req: Request, res: Response) => {
    try {
      const { bulletPoint, context } = req.body as { bulletPoint?: string; context?: string };
      if (!bulletPoint) {
        res.status(400).json({ error: 'bulletPoint is required.' });
        return;
      }
      const ai = getAiClient();
      const response = await generateContentWithRetry(ai, {
        model: TEXT_MODEL,
        contents: `Rewrite this resume bullet point to be more impactful and action-oriented, using the STAR method (Situation, Task, Action, Result) if possible. Context: ${context || ''}. Bullet point: "${bulletPoint}"`,
        config: { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } },
      });
      res.json({ text: (response.text ?? '').trim() });
    } catch (error) {
      handleApiError(res, error);
    }
  });

  app.post('/api/gemini/suggest-skills', async (req: Request, res: Response) => {
    try {
      const { jobTitle } = req.body as { jobTitle?: string };
      if (!jobTitle) {
        res.status(400).json({ error: 'jobTitle is required.' });
        return;
      }
      const ai = getAiClient();
      const response = await generateContentWithRetry(ai, {
        model: TEXT_MODEL,
        contents: `Suggest 5-7 relevant technical and soft skills for a resume targeting a "${jobTitle}" position. Provide the skills as a single comma-separated string.`,
        config: { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } },
      });
      res.json({ text: (response.text ?? '').trim() });
    } catch (error) {
      handleApiError(res, error);
    }
  });

  app.post('/api/gemini/cover-letter', async (req: Request, res: Response) => {
    try {
      const { resumeData, jobDescription, options } = req.body as {
        resumeData?: unknown;
        jobDescription?: string;
        options?: { tone?: string; companyName?: string; jobRole?: string };
      };
      if (!resumeData || !jobDescription) {
        res.status(400).json({ error: 'resumeData and jobDescription are required.' });
        return;
      }
      const tone = options?.tone || 'professional';
      const company = options?.companyName || 'Hiring Team';
      const role = options?.jobRole || 'the advertised role';

      const ai = getAiClient();
      const prompt = `Based on the following resume and job description, write a tailored cover letter for ${company} for the position of ${role}.
Tone: ${tone}.
Highlight relevant achievements, quantify metrics where applicable, and maintain a compelling, professional narrative without fluff.
---
RESUME:
${JSON.stringify(resumeData, null, 2)}
---
JOB DESCRIPTION:
${jobDescription}
---
COVER LETTER:`;

      const response = await generateContentWithRetry(ai, {
        model: TEXT_MODEL,
        contents: prompt,
        config: { thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM } },
      });
      res.json({ text: (response.text ?? '').trim() });
    } catch (error) {
      handleApiError(res, error);
    }
  });

  app.post('/api/gemini/keywords', async (req: Request, res: Response) => {
    try {
      const { resumeText, jobDescription } = req.body as {
        resumeText?: string;
        jobDescription?: string;
      };
      if (!resumeText || !jobDescription) {
        res.status(400).json({ error: 'resumeText and jobDescription are required.' });
        return;
      }
      const ai = getAiClient();
      const prompt = `Act as an expert ATS (Applicant Tracking System) resume analyzer. Compare the provided resume against the job description. Identify the top 10-15 most important keywords and skills from the job description that are either missing or underrepresented in the resume. List them as a single comma-separated string.
---
RESUME TEXT:
${resumeText}
---
JOB DESCRIPTION:
${jobDescription}
---
MISSING KEYWORDS:`;

      const response = await generateContentWithRetry(ai, {
        model: TEXT_MODEL,
        contents: prompt,
        config: { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } },
      });
      res.json({ text: (response.text ?? '').trim() });
    } catch (error) {
      handleApiError(res, error);
    }
  });

  app.post('/api/gemini/generate-resume', async (req: Request, res: Response) => {
    try {
      const { jobTitle } = req.body as { jobTitle?: string };
      if (!jobTitle) {
        res.status(400).json({ error: 'jobTitle is required.' });
        return;
      }
      const ai = getAiClient();
      const resumeSchema = {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          email: { type: Type.STRING },
          phone: { type: Type.STRING },
          website: { type: Type.STRING },
          summary: { type: Type.STRING, description: `A concise summary for a ${jobTitle}.` },
          skills: { type: Type.STRING, description: 'A comma-separated string of 5-7 relevant skills.' },
          education: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                university: { type: Type.STRING },
                degree: { type: Type.STRING },
                startDate: { type: Type.STRING },
                endDate: { type: Type.STRING },
              },
              required: ['university', 'degree', 'startDate', 'endDate'],
            },
          },
          experience: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                company: { type: Type.STRING },
                title: { type: Type.STRING },
                startDate: { type: Type.STRING },
                endDate: { type: Type.STRING },
                description: {
                  type: Type.STRING,
                  description: '2-3 action-oriented bullet points, separated by newlines (\\n).',
                },
              },
              required: ['company', 'title', 'startDate', 'endDate', 'description'],
            },
          },
          projects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                url: { type: Type.STRING },
              },
              required: ['name', 'description'],
            },
          },
        },
        required: [
          'name',
          'email',
          'phone',
          'website',
          'summary',
          'skills',
          'education',
          'experience',
          'projects',
        ],
      };

      const response = await generateContentWithRetry(ai, {
        model: TEXT_MODEL,
        contents: `Generate a full resume draft for a fictional person applying for the job title "${jobTitle}".`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: resumeSchema,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const rawParsed = extractJsonObject(response.text ?? '{}');
      const normalized = normalizeImportedResumeData(rawParsed, () => crypto.randomUUID());
      res.json(normalized);
    } catch (error) {
      handleApiError(res, error);
    }
  });

  app.post('/api/gemini/analyze-ats', async (req: Request, res: Response) => {
    try {
      const { resumeText, jobDescription } = req.body as {
        resumeText?: string;
        jobDescription?: string;
      };
      if (!resumeText || !jobDescription) {
        res.status(400).json({ error: 'resumeText and jobDescription are required.' });
        return;
      }
      const ai = getAiClient();
      const atsSchema = {
        type: Type.OBJECT,
        properties: {
          score: {
            type: Type.INTEGER,
            description: 'Overall matching percentage from 0 to 100 based on keywords and description match',
          },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '4-6 highly specific, actionable content improvement suggestions for the resume',
          },
          missingKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Top 8-12 keywords or skills from the job description that are missing or underrepresented in the resume',
          },
        },
        required: ['score', 'suggestions', 'missingKeywords'],
      };

      const prompt = `Act as an expert Applicant Tracking System (ATS) auditor. Analyze the following resume against the job description. Give a match score from 0 to 100, suggest specific, actionable changes to improve the match, and list key missing skills or keywords.
---
RESUME:
${resumeText}
---
JOB DESCRIPTION:
${jobDescription}
---`;

      const response = await generateContentWithRetry(ai, {
        model: TEXT_MODEL,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: atsSchema,
          thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM },
        },
      });

      const parsed = extractJsonObject(response.text ?? '{}');
      res.json(parsed);
    } catch (error) {
      handleApiError(res, error);
    }
  });

  app.post('/api/gemini/parse-resume', async (req: Request, res: Response) => {
    try {
      const { rawText, fileBase64, mimeType, fileName } = req.body as {
        rawText?: string;
        fileBase64?: string;
        mimeType?: string;
        fileName?: string;
      };

      if (!rawText?.trim() && !fileBase64) {
        res.status(400).json({ error: 'Please upload a resume file or paste your resume text.' });
        return;
      }

      const ai = getAiClient();
      const resumeSchema = {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Full name of the candidate' },
          email: { type: Type.STRING, description: 'Email address if present, otherwise empty string' },
          phone: { type: Type.STRING, description: 'Phone number if present, otherwise empty string' },
          website: { type: Type.STRING, description: 'Website, GitHub, or LinkedIn URL if present, otherwise empty string' },
          summary: { type: Type.STRING, description: 'Professional summary or objective; synthesize a concise 2-3 sentence summary from the resume if none is explicitly stated' },
          skills: { type: Type.STRING, description: 'Comma-separated list of key technical and domain skills extracted from the resume' },
          education: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                university: { type: Type.STRING },
                degree: { type: Type.STRING },
                startDate: { type: Type.STRING },
                endDate: { type: Type.STRING },
              },
              required: ['university', 'degree', 'startDate', 'endDate'],
            },
          },
          experience: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                company: { type: Type.STRING },
                title: { type: Type.STRING },
                startDate: { type: Type.STRING },
                endDate: { type: Type.STRING },
                description: {
                  type: Type.STRING,
                  description: 'Action-oriented bullet points separated by newlines (\\n), preserving metrics and achievements.',
                },
              },
              required: ['company', 'title', 'startDate', 'endDate', 'description'],
            },
          },
          projects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                url: { type: Type.STRING },
              },
              required: ['name', 'description'],
            },
          },
        },
        required: ['name', 'email', 'phone', 'website', 'summary', 'skills', 'education', 'experience', 'projects'],
      };

      const instruction =
        'Extract all structured resume information accurately from the provided resume document or text. Do not invent fake companies, degrees, or metrics that are not in the source. Format experience bullet points cleanly separated by newlines (\\n). Return empty arrays or empty strings for missing sections.';

      let contents: GenerateContentParameters['contents'] = '';

      if (fileBase64) {
        const resolvedMime = inferResumeMimeType(fileName, mimeType);
        const buffer = Buffer.from(fileBase64, 'base64');
        const isDocx =
          resolvedMime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        const isPdf = resolvedMime === 'application/pdf';
        const isImage = resolvedMime.startsWith('image/');

        if (isDocx) {
          const extracted = await mammoth.extractRawText({ buffer });
          const text = extracted.value?.trim();
          if (!text) {
            res.status(400).json({ error: 'Could not extract readable text from the DOCX file.' });
            return;
          }
          contents = `${instruction}\n\nRESUME TEXT:\n${text}`;
        } else if (isPdf) {
          let pdfText = '';
          try {
            const pdfProxy = await getDocumentProxy(new Uint8Array(buffer));
            const extracted = await extractText(pdfProxy, { mergePages: true });
            pdfText = (extracted.text || '').trim();
          } catch (pdfErr) {
            console.warn('unpdf text extraction failed, falling back to multimodal PDF input:', pdfErr);
          }

          if (pdfText.length >= 30) {
            contents = `${instruction}\n\nRESUME TEXT:\n${pdfText}`;
          } else {
            // Scanned or image-based PDF: send inline PDF bytes directly to Gemini
            contents = {
              parts: [
                {
                  inlineData: {
                    mimeType: 'application/pdf',
                    data: fileBase64,
                  },
                },
                { text: instruction },
              ],
            };
          }
        } else if (isImage) {
          contents = {
            parts: [
              {
                inlineData: {
                  mimeType: resolvedMime,
                  data: fileBase64,
                },
              },
              { text: instruction },
            ],
          };
        } else {
          const decodedText = buffer.toString('utf-8').trim();
          if (!decodedText || decodedText.startsWith('%PDF-')) {
            res.status(400).json({ error: 'Unsupported or unreadable file format. Please upload a PDF, DOCX, TXT, or image resume.' });
            return;
          }
          contents = `${instruction}\n\nRESUME TEXT:\n${decodedText}`;
        }
      } else {
        contents = `${instruction}\n\nRESUME TEXT:\n${rawText}`;
      }

      const response = await generateContentWithRetry(ai, {
        model: TEXT_MODEL,
        contents,
        config: {
          responseMimeType: 'application/json',
          responseSchema: resumeSchema,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const rawParsed = extractJsonObject(response.text ?? '{}');
      const normalized = normalizeImportedResumeData(rawParsed, () => crypto.randomUUID());

      res.json(normalized);
    } catch (error) {
      handleApiError(res, error);
    }
  });

  app.post('/api/gemini/tailor-summary', async (req: Request, res: Response) => {
    try {
      const { resumeData, jobDescription } = req.body as {
        resumeData?: unknown;
        jobDescription?: string;
      };
      if (!resumeData || !jobDescription) {
        res.status(400).json({ error: 'resumeData and jobDescription are required.' });
        return;
      }
      const ai = getAiClient();
      const response = await generateContentWithRetry(ai, {
        model: TEXT_MODEL,
        contents: `Rewrite the candidate's professional summary (2-3 crisp, ATS-optimized sentences) to align directly with the target job description while remaining truthful to the candidate's actual background.\n\nRESUME:\n${JSON.stringify(resumeData)}\n\nTARGET JOB DESCRIPTION:\n${jobDescription}\n\nTAILORED SUMMARY:`,
        config: { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } },
      });
      res.json({ text: (response.text ?? '').trim() });
    } catch (error) {
      handleApiError(res, error);
    }
  });

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.use((req: Request, res: Response, next) => {
      if (req.method === 'GET' && !req.path.startsWith('/api/')) {
        res.sendFile(path.join(distDir, 'index.html'));
        return;
      }
      next();
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
