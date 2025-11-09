export interface Education {
  id: string;
  university: string;
  degree: string;
  startDate: string;
  // Fix: Changed type from DRAFT_MODE to string.
  endDate: string;
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
}

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  website: string;
  summary: string;
  skills: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
}

export type TemplateId = 'classic' | 'modern' | 'creative' | 'technical' | 'minimalist' | 'academic' | 'executive' | 'infographic' | 'startup';