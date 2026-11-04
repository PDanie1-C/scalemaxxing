import LexerInterface from './components/LexerInterface'
import About from './components/About'
import { useState } from 'react';
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('LexerInterface');

  return currentView === 'LexerInterface' 
    ? <LexerInterface onAbout={() => setCurrentView('about')} />
    : <About onBack={() => setCurrentView('LexerInterface')} />;
}

export default App
