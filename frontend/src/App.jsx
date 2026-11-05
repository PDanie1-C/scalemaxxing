import LexerInterface from './components/LexerInterface'
import About from './components/About'
import { useState, useEffect } from 'react';
import './App.css'
import contributors from './data/contributors';

function App() {
  const [currentView, setCurrentView] = useState('LexerInterface');
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  function enableLightMode() {
    setTheme("light");
  }

  function enableDarkMode() {
    setTheme("dark");
  }

  return currentView === 'LexerInterface' 
    ? <LexerInterface
        setLightMode={enableLightMode}
        setDarkMode={enableDarkMode}
        onAbout={() => setCurrentView('about')}
      />
    : <About onBack={() => setCurrentView('LexerInterface')}/>;
}

export default App
