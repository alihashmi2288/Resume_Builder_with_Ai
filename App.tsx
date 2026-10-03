import * as React from 'react';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import { AppContext, type Theme } from './context/AppContext';
import HomePage from './pages/HomePage';
import BuilderPage from './pages/BuilderPage';
import TemplatesPage from './pages/TemplatesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CoverLetterPage from './pages/CoverLetterPage';
import { Header } from './components/ui/Header';
import { Footer } from './components/ui/Footer';

import { ToastProvider } from './context/ToastContext';

function App() {
  const [theme, setTheme] = React.useState<Theme>(() => {
    const storedTheme = localStorage.getItem('resume-theme');
    return (storedTheme as Theme) || 'dark';
  });
  
  React.useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('resume-theme', theme);
  }, [theme]);
  
  const contextValue = React.useMemo(() => ({
    theme,
    setTheme,
  }), [theme]);

  return (
    <AppContext.Provider value={contextValue}>
      <ToastProvider>
        <HashRouter>
          <div className="min-h-screen flex flex-col font-sans antialiased">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-background focus:text-primary focus:border-2 focus:border-primary focus:rounded-lg focus:font-semibold focus:outline-none"
            >
              Skip to main content
            </a>
            <Header />
            <main id="main-content" className="flex-grow container mx-auto px-4 py-8 outline-none" tabIndex={-1}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/builder" element={<BuilderPage />} />
                <Route path="/templates" element={<TemplatesPage />} />
                <Route path="/cover-letter" element={<CoverLetterPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </HashRouter>
      </ToastProvider>
    </AppContext.Provider>
  );
}

export default App;