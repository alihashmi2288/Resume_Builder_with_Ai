import { type ThemeColor } from '../types';

export interface ColorThemeClasses {
  text: string;
  border: string;
  bg: string;
  bgLight: string;
  borderLight: string;
  textDark: string;
  accentText: string;
}

/**
 * Returns theme-based Tailwind CSS classes to dynamically customize template accents.
 */
export const getThemeClasses = (color: ThemeColor = 'slate'): ColorThemeClasses => {
  switch (color) {
    case 'indigo':
      return {
        text: 'text-indigo-600',
        border: 'border-indigo-600',
        bg: 'bg-indigo-600',
        bgLight: 'bg-indigo-50',
        borderLight: 'border-indigo-200',
        textDark: 'text-indigo-900',
        accentText: 'text-indigo-500'
      };
    case 'emerald':
      return {
        text: 'text-emerald-600',
        border: 'border-emerald-600',
        bg: 'bg-emerald-600',
        bgLight: 'bg-emerald-50',
        borderLight: 'border-emerald-200',
        textDark: 'text-emerald-900',
        accentText: 'text-emerald-500'
      };
    case 'blue':
      return {
        text: 'text-blue-600',
        border: 'border-blue-600',
        bg: 'bg-blue-600',
        bgLight: 'bg-blue-50',
        borderLight: 'border-blue-200',
        textDark: 'text-blue-900',
        accentText: 'text-blue-500'
      };
    case 'rose':
      return {
        text: 'text-rose-600',
        border: 'border-rose-600',
        bg: 'bg-rose-600',
        bgLight: 'bg-rose-50',
        borderLight: 'border-rose-200',
        textDark: 'text-rose-900',
        accentText: 'text-rose-500'
      };
    case 'amber':
      return {
        text: 'text-amber-600',
        border: 'border-amber-600',
        bg: 'bg-amber-600',
        bgLight: 'bg-amber-50',
        borderLight: 'border-amber-200',
        textDark: 'text-amber-900',
        accentText: 'text-amber-500'
      };
    case 'slate':
    default:
      return {
        text: 'text-slate-700',
        border: 'border-slate-700',
        bg: 'bg-slate-700',
        bgLight: 'bg-slate-100',
        borderLight: 'border-slate-300',
        textDark: 'text-slate-900',
        accentText: 'text-slate-500'
      };
  }
};
