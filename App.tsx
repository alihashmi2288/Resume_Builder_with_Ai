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
      <HashRouter>
        <div className="min-h-screen flex flex-col font-sans antialiased">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
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
    </AppContext.Provider>
  );
}

export default App;