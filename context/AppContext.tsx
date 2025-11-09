import * as React from 'react';

export type Theme = 'light' | 'dark';

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};