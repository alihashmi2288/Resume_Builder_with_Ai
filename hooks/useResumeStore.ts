import { useReducer, useEffect } from 'react';
import { type ResumeData, type Experience, type Education, type Project } from '../types';

const emptyResume: ResumeData = {
  name: 'Your Name',
  email: 'youremail@example.com',
  phone: '123-456-7890',
  website: 'yourportfolio.com',
  summary: 'A brief professional summary about yourself.',
  skills: 'React, TypeScript, Node.js, Tailwind CSS',
  education: [
    { id: crypto.randomUUID(), university: 'University of Example', degree: 'B.S. in Computer Science', startDate: '2018', endDate: '2022' },
  ],
  experience: [
    { id: crypto.randomUUID(), company: 'Tech Corp', title: 'Software Engineer', startDate: '2022', endDate: 'Present', description: '- Developed and maintained web applications.\n- Collaborated with cross-functional teams.' },
  ],
  projects: [
    { id: crypto.randomUUID(), name: 'Project A', description: 'A cool project I built.', url: 'github.com/yourname/project-a' },
  ],
};

export type Action =
  | { type: 'SET_FIELD'; field: keyof ResumeData; value: any }
  | { type: 'ADD_ITEM'; field: 'experience' | 'education' | 'projects' }
  | { type: 'UPDATE_ITEM'; field: 'experience' | 'education' | 'projects'; id: string; data: Partial<Experience | Education | Project> }
  | { type: 'DELETE_ITEM'; field: 'experience' | 'education' | 'projects'; id: string }
  | { type: 'LOAD_DRAFT'; data: ResumeData }
  | { type: 'RESET_DATA' };

const reducer = (state: ResumeData, action: Action): ResumeData => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'ADD_ITEM':
      const newItem = { id: crypto.randomUUID(), ...getNewItemDefaults(action.field) };
      return { ...state, [action.field]: [...state[action.field], newItem] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        [action.field]: state[action.field].map((item: Experience | Education | Project) =>
          item.id === action.id ? { ...item, ...action.data } : item
        ),
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        [action.field]: state[action.field].filter((item: Experience | Education | Project) => item.id !== action.id),
      };
    case 'LOAD_DRAFT':
      return action.data;
    case 'RESET_DATA':
        return emptyResume;
    default:
      return state;
  }
};

const getNewItemDefaults = (field: 'experience' | 'education' | 'projects') => {
  switch (field) {
    case 'experience': return { company: '', title: '', startDate: '', endDate: '', description: '' };
    case 'education': return { university: '', degree: '', startDate: '', endDate: '' };
    case 'projects': return { name: '', description: '', url: '' };
  }
};


export const useResumeStore = () => {
    const initializer = () => {
        try {
            const storedData = localStorage.getItem('resume-draft');
            return storedData ? JSON.parse(storedData) : emptyResume;
        } catch (error) {
            console.error("Error parsing resume draft from localStorage", error);
            return emptyResume;
        }
    };

    const [resumeData, dispatch] = useReducer(reducer, undefined, initializer);

    useEffect(() => {
        try {
            localStorage.setItem('resume-draft', JSON.stringify(resumeData));
        } catch (error) {
            console.error("Error saving resume draft to localStorage", error);
        }
    }, [resumeData]);

    return { resumeData, dispatch };
};