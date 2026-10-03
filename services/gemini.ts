

import { GoogleGenAI, Type } from "@google/genai";
import { type ResumeData } from '../types';

let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is not configured. Please set the GEMINI_API_KEY environment variable to use AI features.");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

// Per coding guidelines, use a modern model. gemini-2.5-flash is suitable for these text tasks.
const textModel = "gemini-2.5-flash";

async function callGeminiText(prompt: string): Promise<string> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: textModel,
      contents: prompt,
    });
    // Per coding guidelines, access the text directly from the response.
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate content: ${error.message}`);
    }
    throw new Error("An unknown error occurred while calling the Gemini API.");
  }
}

export const generateAISummary = async (resumeText: string) => {
    const prompt = `Based on the following resume details, write a professional and compelling summary of 2-3 sentences. Focus on key skills and experience. Resume Details:\n\n${resumeText}`;
    return callGeminiText(prompt);
};

export const enhanceAIBulletPoint = async (bulletPoint: string, context: string) => {
    const prompt = `Rewrite this resume bullet point to be more impactful and action-oriented, using the STAR method (Situation, Task, Action, Result) if possible. Context: ${context}. Bullet point: "${bulletPoint}"`;
    return callGeminiText(prompt);
};

export const suggestAISkills = async (jobTitle: string) => {
    const prompt = `Suggest 5-7 relevant technical and soft skills for a resume targeting a "${jobTitle}" position. Provide the skills as a single comma-separated string.`;
    return callGeminiText(prompt);
};

export const generateAICoverLetter = async (resumeData: ResumeData, jobDescription: string): Promise<string> => {
    const prompt = `Based on the following resume and job description, write a professional and tailored cover letter. The tone should be confident and enthusiastic. The cover letter should highlight the most relevant skills and experiences from the resume that match the job requirements, and be structured in a standard cover letter format.
---
RESUME:
${JSON.stringify(resumeData, null, 2)}
---
JOB DESCRIPTION:
${jobDescription}
---
COVER LETTER:`;
    return callGeminiText(prompt);
};

export const analyzeAndSuggestKeywords = async (resumeText: string, jobDescription: string): Promise<string> => {
    const prompt = `Act as an expert ATS (Applicant Tracking System) resume analyzer. Compare the provided resume against the job description. Identify the top 10-15 most important keywords and skills from the job description that are either missing or underrepresented in the resume. List them as a single comma-separated string.
---
RESUME TEXT:
${resumeText}
---
JOB DESCRIPTION:
${jobDescription}
---
MISSING KEYWORDS:`;
    return callGeminiText(prompt);
};


export const generateAIResume = async (jobTitle: string): Promise<ResumeData> => {
    const prompt = `Generate a full resume draft for a fictional person applying for the job title "${jobTitle}".`;

    const resumeSchema = {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        website: { type: Type.STRING },
        summary: { type: Type.STRING, description: `A concise summary for a ${jobTitle}.` },
        skills: { type: Type.STRING, description: "A comma-separated string of 5-7 relevant skills." },
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
              description: { type: Type.STRING, description: "2-3 action-oriented bullet points, separated by newlines (\\n)." },
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

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: resumeSchema,
            },
        });
        
        const responseText = response.text.trim();
        const parsedData = JSON.parse(responseText);

        // Add unique IDs, as the model doesn't generate them
        parsedData.education.forEach((item: any) => item.id = crypto.randomUUID());
        parsedData.experience.forEach((item: any) => item.id = crypto.randomUUID());
        parsedData.projects.forEach((item: any) => item.id = crypto.randomUUID());

        return parsedData;

    } catch (e) {
        console.error("Failed to parse AI-generated resume JSON:", e);
        if (e instanceof Error) {
            throw new Error(`The AI returned an invalid format: ${e.message}. Please try again.`);
        }
        throw new Error("The AI returned an invalid format. Please try again.");
    }
};

export interface ATSAnalysisResult {
  score: number;
  suggestions: string[];
  missingKeywords: string[];
}

export const analyzeResumeATS = async (resumeText: string, jobDescription: string): Promise<ATSAnalysisResult> => {
    const prompt = `Act as an expert Applicant Tracking System (ATS) auditor. Analyze the following resume against the job description. Give a match score from 0 to 100, suggest specific, actionable changes to improve the match, and list key missing skills or keywords.
---
RESUME:
${resumeText}
---
JOB DESCRIPTION:
${jobDescription}
---`;

    const atsSchema = {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.INTEGER, description: "Overall matching percentage from 0 to 100 based on keywords and description match" },
        suggestions: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING }, 
          description: "4-6 highly specific, actionable content improvement suggestions for the resume" 
        },
        missingKeywords: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING }, 
          description: "Top 8-12 keywords or skills from the job description that are missing or underrepresented in the resume" 
        },
      },
      required: ['score', 'suggestions', 'missingKeywords'],
    };

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: atsSchema,
            },
        });
        
        const responseText = response.text.trim();
        return JSON.parse(responseText) as ATSAnalysisResult;

    } catch (e) {
        console.error("Failed to parse AI ATS audit JSON:", e);
        if (e instanceof Error) {
            throw new Error(`Failed to audit resume: ${e.message}`);
        }
        throw new Error("An error occurred during AI ATS audit. Please try again.");
    }
};