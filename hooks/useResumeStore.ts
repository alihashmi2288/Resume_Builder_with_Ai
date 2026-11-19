import { useReducer, useEffect, useCallback } from 'react';
import { type ResumeData, type Experience, type Education, type Project } from '../types';
import {
  DEFAULT_SECTION_ORDER,
  normalizeImportedResumeData,
  normalizeSectionOrder,
  reorderItemList,
} from '../lib/resumeUtils';
import {
  applyRedo,
  applyUndo,
  EMPTY_DRAFT_HISTORY,
  getHistoryGroupKey,
  isSameResumeData,
  recordHistoryChange,
  type DraftHistory,
  type HistoryActionMeta,
} from '../lib/resumeHistory';

export interface DraftProfile {
  id: string;
  name: string;
  data: ResumeData;
  updatedAt: string;
}

export interface ResumeStoreState {
  drafts: DraftProfile[];
  activeDraftId: string;
  historyByDraft: Record<string, DraftHistory>;
}

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
  themeColor: 'slate',
  fontSize: 'medium',
  lineHeight: 'normal',
  margins: 'normal',
  headingCase: 'uppercase',
  sectionOrder: [...DEFAULT_SECTION_ORDER],
  hiddenSections: []
};

const demoResume: ResumeData = {
  name: 'Alex Mercer',
  email: 'alex.mercer@email.com',
  phone: '(555) 019-2834',
  website: 'github.com/alexmercer',
  summary: 'Results-driven Senior Software Engineer with 5+ years of experience designing, building, and deploying scalable web applications. Expert in React, Node.js, and TypeScript, with a proven track record of optimizing application performance by 40% and leading cross-functional teams in agile environments.',
  skills: 'React, TypeScript, JavaScript, Node.js, Express, Next.js, HTML5, CSS3, Tailwind CSS, PostgreSQL, MongoDB, Git, Docker, RESTful APIs, AWS (S3, EC2)',
  education: [
    { id: crypto.randomUUID(), university: 'State University of Technology', degree: 'B.S. in Computer Science', startDate: '2016', endDate: '2020' },
  ],
  experience: [
    {
      id: crypto.randomUUID(),
      company: 'Innovate Solutions Inc.',
      title: 'Senior Software Engineer',
      startDate: '2022',
      endDate: 'Present',
      description: '- Architected and built a micro-frontend platform using React and TypeScript, increasing developer productivity by 25%.\n- Led a team of 4 engineers to migrate a legacy codebase to modern Next.js, resulting in a 40% improvement in PageSpeed scores.\n- Designed and implemented a secure REST API using Node.js and Express, supporting 50k+ daily active users.'
    },
    {
      id: crypto.randomUUID(),
      company: 'PixelForge Studio',
      title: 'Software Engineer',
      startDate: '2020',
      endDate: '2022',
      description: '- Built responsive e-commerce web applications using React and Tailwind CSS, increasing mobile conversion rates by 18%.\n- Integrated payment gateways (Stripe, PayPal) and optimized checkout flows to reduce cart abandonment by 12%.\n- Collaborated with UX/UI designers to establish a reusable component library, cutting design-to-code time in half.'
    }
  ],
  projects: [
    {
      id: crypto.randomUUID(),
      name: 'CloudSync Dashboard',
      description: 'A real-time server monitoring tool showing system metrics, built using React, Node.js, and WebSockets. Deployed on AWS with Docker containers.',
      url: 'github.com/alexmercer/cloudsync'
    },
    {
      id: crypto.randomUUID(),
      name: 'DevFlow Community Portal',
      description: 'A developer community hub with article sharing, comments, and real-time messaging. Developed with Next.js, PostgreSQL, and Tailwind CSS.',
      url: 'github.com/alexmercer/devflow'
    }
  ],
  themeColor: 'indigo',
  fontSize: 'medium',
  lineHeight: 'normal',
  margins: 'normal',
  headingCase: 'uppercase',
  sectionOrder: [...DEFAULT_SECTION_ORDER],
  hiddenSections: []
};

export type Action =
  | { type: 'SET_FIELD'; field: keyof ResumeData; value: any }
  | { type: 'TOGGLE_SECTION_VISIBILITY'; sectionId: string; visible?: boolean }
  | { type: 'ADD_ITEM'; field: 'experience' | 'education' | 'projects' }
  | { type: 'UPDATE_ITEM'; field: 'experience' | 'education' | 'projects'; id: string; data: Partial<Experience | Education | Project> }
  | { type: 'DELETE_ITEM'; field: 'experience' | 'education' | 'projects'; id: string }
  | { type: 'MOVE_ITEM_UP'; field: 'experience' | 'education' | 'projects'; id: string }
  | { type: 'MOVE_ITEM_DOWN'; field: 'experience' | 'education' | 'projects'; id: string }
  | { type: 'REORDER_ITEMS'; field: 'experience' | 'education' | 'projects'; activeId: string; overId: string }
  | { type: 'LOAD_DRAFT'; data: ResumeData }
  | { type: 'LOAD_DEMO_DATA' }
  | { type: 'RESET_DATA' }
  // Undo / Redo history actions
  | { type: 'UNDO' }
  | { type: 'REDO' }
  // Draft management actions
  | { type: 'SWITCH_DRAFT'; id: string }
  | { type: 'CREATE_DRAFT'; name: string; isDemo?: boolean }
  | { type: 'DUPLICATE_DRAFT'; id: string; newName: string }
  | { type: 'RENAME_DRAFT'; id: string; newName: string }
  | { type: 'DELETE_DRAFT'; id: string };

const singleResumeReducer = (state: ResumeData, action: Action): ResumeData => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'TOGGLE_SECTION_VISIBILITY': {
      const current = Array.isArray(state.hiddenSections) ? state.hiddenSections : [];
      const isCurrentlyHidden = current.includes(action.sectionId);
      const shouldBeVisible = action.visible !== undefined ? action.visible : isCurrentlyHidden;
      const nextHidden = shouldBeVisible
        ? current.filter((id) => id !== action.sectionId)
        : isCurrentlyHidden
          ? current
          : [...current, action.sectionId];
      return { ...state, hiddenSections: nextHidden };
    }
    case 'ADD_ITEM': {
      const newItem = { id: crypto.randomUUID(), ...getNewItemDefaults(action.field) };
      const currentHidden = Array.isArray(state.hiddenSections) ? state.hiddenSections : [];
      return {
        ...state,
        [action.field]: [...(state[action.field] || []), newItem],
        hiddenSections: currentHidden.filter((id) => id !== action.field),
      };
    }
    case 'UPDATE_ITEM':
      return {
        ...state,
        [action.field]: (state[action.field] || []).map((item: any) =>
          item.id === action.id ? { ...item, ...action.data } : item
        ),
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        [action.field]: (state[action.field] || []).filter((item: any) => item.id !== action.id),
      };
    case 'MOVE_ITEM_UP': {
      const { field, id } = action;
      const list = [...(state[field] || [])];
      const index = list.findIndex(item => item.id === id);
      if (index > 0) {
        const temp = list[index];
        list[index] = list[index - 1];
        list[index - 1] = temp;
      }
      return { ...state, [field]: list as any };
    }
    case 'MOVE_ITEM_DOWN': {
      const { field, id } = action;
      const list = [...(state[field] || [])];
      const index = list.findIndex(item => item.id === id);
      if (index >= 0 && index < list.length - 1) {
        const temp = list[index];
        list[index] = list[index + 1];
        list[index + 1] = temp;
      }
      return { ...state, [field]: list as any };
    }
    case 'REORDER_ITEMS':
      return {
        ...state,
        [action.field]: reorderItemList(state[action.field] as any, action.activeId, action.overId) as any,
      };
    case 'LOAD_DRAFT': {
      const normalized = normalizeImportedResumeData(
        action.data as unknown as Record<string, unknown>,
        () => crypto.randomUUID()
      );
      return {
        ...emptyResume,
        ...normalized,
        themeColor: action.data.themeColor || state.themeColor || emptyResume.themeColor,
        fontSize: action.data.fontSize || state.fontSize || emptyResume.fontSize,
        lineHeight: action.data.lineHeight || state.lineHeight || emptyResume.lineHeight,
        margins: action.data.margins || state.margins || emptyResume.margins,
        headingCase: action.data.headingCase || state.headingCase || emptyResume.headingCase,
        sectionOrder: normalizeSectionOrder(action.data.sectionOrder),
        hiddenSections: Array.isArray(action.data.hiddenSections) ? action.data.hiddenSections : [],
      };
    }
    case 'LOAD_DEMO_DATA':
      return demoResume;
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

const storeReducer = (state: ResumeStoreState, action: Action): ResumeStoreState => {
  const activeDraft = state.drafts.find(d => d.id === state.activeDraftId);
  const activeData = activeDraft ? activeDraft.data : emptyResume;

  switch (action.type) {
    case 'UNDO': {
      const result = applyUndo(state.historyByDraft[state.activeDraftId], activeData);
      if (!result) return state;
      return {
        ...state,
        drafts: state.drafts.map(draft =>
          draft.id === state.activeDraftId
            ? { ...draft, data: result.data, updatedAt: new Date().toISOString() }
            : draft
        ),
        historyByDraft: {
          ...state.historyByDraft,
          [state.activeDraftId]: result.history,
        },
      };
    }

    case 'REDO': {
      const result = applyRedo(state.historyByDraft[state.activeDraftId], activeData);
      if (!result) return state;
      return {
        ...state,
        drafts: state.drafts.map(draft =>
          draft.id === state.activeDraftId
            ? { ...draft, data: result.data, updatedAt: new Date().toISOString() }
            : draft
        ),
        historyByDraft: {
          ...state.historyByDraft,
          [state.activeDraftId]: result.history,
        },
      };
    }

    case 'SWITCH_DRAFT':
      if (state.drafts.some(d => d.id === action.id)) {
        return { ...state, activeDraftId: action.id };
      }
      return state;

    case 'CREATE_DRAFT': {
      const newId = crypto.randomUUID();
      const newDraftData = action.isDemo ? demoResume : emptyResume;
      const newDraft: DraftProfile = {
        id: newId,
        name: action.name,
        data: newDraftData,
        updatedAt: new Date().toISOString()
      };
      return {
        ...state,
        drafts: [...state.drafts, newDraft],
        activeDraftId: newId,
        historyByDraft: {
          ...state.historyByDraft,
          [newId]: EMPTY_DRAFT_HISTORY,
        },
      };
    }

    case 'DUPLICATE_DRAFT': {
      const targetDraft = state.drafts.find(d => d.id === action.id);
      if (!targetDraft) return state;
      const newId = crypto.randomUUID();
      const newDraft: DraftProfile = {
        id: newId,
        name: action.newName,
        data: JSON.parse(JSON.stringify(targetDraft.data)),
        updatedAt: new Date().toISOString()
      };
      return {
        ...state,
        drafts: [...state.drafts, newDraft],
        activeDraftId: newId,
        historyByDraft: {
          ...state.historyByDraft,
          [newId]: EMPTY_DRAFT_HISTORY,
        },
      };
    }

    case 'RENAME_DRAFT':
      return {
        ...state,
        drafts: state.drafts.map(d =>
          d.id === action.id ? { ...d, name: action.newName, updatedAt: new Date().toISOString() } : d
        )
      };

    case 'DELETE_DRAFT': {
      if (state.drafts.length <= 1) return state; // Prevent deleting the last draft
      const newDrafts = state.drafts.filter(d => d.id !== action.id);
      let newActiveId = state.activeDraftId;
      if (state.activeDraftId === action.id) {
        newActiveId = newDrafts[0].id;
      }
      const nextHistory = { ...state.historyByDraft };
      delete nextHistory[action.id];
      return {
        drafts: newDrafts,
        activeDraftId: newActiveId,
        historyByDraft: nextHistory,
      };
    }

    default: {
      const updatedData = singleResumeReducer(activeData, action);
      if (isSameResumeData(activeData, updatedData)) {
        return state;
      }
      const groupKey = getHistoryGroupKey(action as HistoryActionMeta, activeData, updatedData);
      const nextDraftHistory = recordHistoryChange(
        state.historyByDraft[state.activeDraftId],
        activeData,
        updatedData,
        groupKey
      );
      return {
        ...state,
        drafts: state.drafts.map(draft =>
          draft.id === state.activeDraftId
            ? { ...draft, data: updatedData, updatedAt: new Date().toISOString() }
            : draft
        ),
        historyByDraft: {
          ...state.historyByDraft,
          [state.activeDraftId]: nextDraftHistory,
        },
      };
    }
  }
};

export const useResumeStore = () => {
  const initializer = (): ResumeStoreState => {
    try {
      const storedDrafts = localStorage.getItem('resume-drafts');
      if (storedDrafts) {
        const parsed = JSON.parse(storedDrafts);
        if (parsed && Array.isArray(parsed.drafts) && parsed.activeDraftId) {
          return {
            drafts: parsed.drafts,
            activeDraftId: parsed.activeDraftId,
            historyByDraft: {},
          };
        }
      }

      // Legacy migration check
      const storedLegacyDraft = localStorage.getItem('resume-draft');
      if (storedLegacyDraft) {
        const legacyData = JSON.parse(storedLegacyDraft);
        return {
          drafts: [
            {
              id: 'default',
              name: 'Primary Profile',
              data: {
                ...emptyResume,
                ...legacyData
              },
              updatedAt: new Date().toISOString()
            }
          ],
          activeDraftId: 'default',
          historyByDraft: {},
        };
      }

      return {
        drafts: [
          {
            id: 'default',
            name: 'Primary Profile',
            data: emptyResume,
            updatedAt: new Date().toISOString()
          }
        ],
        activeDraftId: 'default',
        historyByDraft: {},
      };
    } catch (error) {
      console.error('Error initializing resume store', error);
      return {
        drafts: [
          {
            id: 'default',
            name: 'Primary Profile',
            data: emptyResume,
            updatedAt: new Date().toISOString()
          }
        ],
        activeDraftId: 'default',
        historyByDraft: {},
      };
    }
  };

  const [state, dispatch] = useReducer(storeReducer, undefined, initializer);

  useEffect(() => {
    try {
      localStorage.setItem(
        'resume-drafts',
        JSON.stringify({ drafts: state.drafts, activeDraftId: state.activeDraftId })
      );
    } catch (error) {
      console.error('Error saving resume drafts to localStorage', error);
    }
  }, [state.drafts, state.activeDraftId]);

  const activeDraft = state.drafts.find(d => d.id === state.activeDraftId) || state.drafts[0];
  const resumeData = activeDraft ? activeDraft.data : emptyResume;
  const activeHistory = state.historyByDraft[state.activeDraftId] || EMPTY_DRAFT_HISTORY;

  const canUndo = activeHistory.past.length > 0;
  const canRedo = activeHistory.future.length > 0;
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const redo = useCallback(() => dispatch({ type: 'REDO' }), []);

  return {
    resumeData,
    drafts: state.drafts,
    activeDraftId: state.activeDraftId,
    canUndo,
    canRedo,
    undoCount: activeHistory.past.length,
    redoCount: activeHistory.future.length,
    undo,
    redo,
    dispatch
  };
};