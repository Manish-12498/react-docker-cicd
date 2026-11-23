import React from 'react';

export default function Navbar({ mode, onToggleTheme, onClear }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a className="brand" href="#home" aria-label="TextUtils home">
          <span className="brand-mark"><b>T</b></span>
          <span className="brand-name"><span className="c1">T</span><span className="c2">e</span><span className="c3">x</span><span className="c4">t</span><span className="c5">U</span><span className="c6">tils</span></span>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          <a className="nav-link active" href="#workspace">Editor</a>
          <a className="nav-link" href="#analytics">Statistics</a>
          <a className="nav-link" href="#about">About</a>
        </nav>
        <div className="nav-actions">
          <span className="local-note"><span className="status-dot" /> Runs in your browser</span>
          <button className="theme-button" type="button" onClick={onToggleTheme}>
            <span aria-hidden="true">{mode === 'dark' ? '☀' : '◐'}</span>
            <span>{mode === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
          <button className="clear-header" type="button" onClick={onClear}>Clear text</button>
        </div>
      </div>
    </header>
  );
}
