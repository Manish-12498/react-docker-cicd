import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import Navbar from './component/Navbar';
import TextArea from './component/TextArea';
import About from './component/About';
import Alert from './component/Alert';

const HISTORY_KEY = 'textutils-history-v1';
function readHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]').slice(0, 5); }
  catch { return []; }
}

export default function App() {
  const [mode, setMode] = useState(() => localStorage.getItem('textutils-theme') || 'light');
  const [text, setText] = useState('');
  const [alert, setAlert] = useState(null);
  const [history, setHistory] = useState(readHistory);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    localStorage.setItem('textutils-theme', mode);
  }, [mode]);
  useEffect(() => { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); }, [history]);
  const notify = useCallback((message, type = 'success') => setAlert({ message, type, id: Date.now() }), []);
  const closeAlert = useCallback(() => setAlert(null), []);
  const toggleTheme = () => setMode(current => current === 'light' ? 'dark' : 'light');
  const saveHistory = () => {
    const item = { id: `${Date.now()}-${Math.random()}`, text, preview: text.replace(/\s+/g, ' ').trim().slice(0, 58) || 'Untitled text', words: text.trim() ? text.trim().split(/\s+/).length : 0, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setHistory(current => [item, ...current.filter(entry => entry.text !== text)].slice(0, 5));
    notify('Text saved to recent history.');
  };

  return (
    <div className="app-shell">
      <Navbar mode={mode} onToggleTheme={toggleTheme} onClear={() => { setText(''); notify('Editor cleared.'); }} />
      <Alert alert={alert} onClose={closeAlert} />
      <TextArea text={text} setText={setText} notify={notify} onSaveHistory={saveHistory} history={history} onRestoreHistory={value => { setText(value); notify('Text restored from history.'); }} />
      <About />
      <footer className="site-footer"><span>© {new Date().getFullYear()} TextUtils</span><span>Text editing tools</span></footer>
    </div>
  );
}
