import React, { useMemo, useState } from 'react';
import TextSummary from './TextSummary';
import { getTextStats, toTitleCase, toSentenceCase, reverseText, removeDuplicateLines, encodeMorse, decodeMorse, encodeBase64, decodeBase64 } from '../utils/textTools';

const tools = [
  { label: 'UPPERCASE', action: text => text.toUpperCase() },
  { label: 'lowercase', action: text => text.toLowerCase() },
  { label: 'Title case', action: toTitleCase },
  { label: 'Sentence case', action: toSentenceCase },
  { label: 'Reverse', action: reverseText },
  { label: 'Remove extra spaces', action: text => text.replace(/[ \t]+/g, ' ').replace(/^ | $/gm, '') },
  { label: 'Remove duplicate lines', action: removeDuplicateLines },
  { label: 'Morse encode', action: encodeMorse },
  { label: 'Morse decode', action: decodeMorse },
  { label: 'Base64 encode', action: encodeBase64 },
  { label: 'Base64 decode', action: decodeBase64 },
  { label: 'URL encode', action: text => encodeURIComponent(text) },
  { label: 'URL decode', action: text => decodeURIComponent(text) }
];

export default function TextArea({ text, setText, notify, onSaveHistory, history, onRestoreHistory }) {
  const [findValue, setFindValue] = useState('');
  const [replaceValue, setReplaceValue] = useState('');
  const [activeTool, setActiveTool] = useState('');
  const stats = useMemo(() => getTextStats(text), [text]);

  const runTool = tool => {
    try {
      if (!text) return notify('Add some text before using a tool.', 'error');
      setText(tool.action(text));
      setActiveTool(tool.label);
      notify(`${tool.label} applied.`);
    } catch (error) {
      notify(`Could not process text: ${error.message}`, 'error');
    }
  };
  const copyText = async () => {
    if (!text) return notify('Nothing to copy.', 'error');
    try { await navigator.clipboard.writeText(text); notify('Text copied to clipboard.'); }
    catch { notify('Clipboard access was blocked by your browser.', 'error'); }
  };
  const pasteText = async () => {
    try { setText(await navigator.clipboard.readText()); notify('Text pasted.'); }
    catch { notify('Clipboard access was blocked. Use Ctrl + V instead.', 'error'); }
  };
  const downloadText = () => {
    if (!text) return notify('Nothing to download.', 'error');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'textutils-note.txt'; link.click();
    URL.revokeObjectURL(url); notify('Text file downloaded.');
  };
  const replaceAll = () => {
    if (!findValue) return notify('Enter text to find first.', 'error');
    const escaped = findValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const matches = text.match(new RegExp(escaped, 'g')) || [];
    const next = text.replace(new RegExp(escaped, 'g'), replaceValue);
    setText(next); notify(`Replaced ${matches.length} occurrence(s).`);
  };

  return (
    <main className="main-content" id="workspace">
      <section className="page-heading" id="home">
        <div>
          <p className="eyebrow">TEXTUTILS / EDITOR</p>
          <h1>Text tools, made simple</h1>
          <p>Paste or type text, then choose a tool to make a change.</p>
        </div>
        <div className="heading-meta"><span className="status-dot" /> No account required</div>
      </section>

      <div className="workspace-grid">
        <section className="panel editor-panel">
          <div className="section-heading editor-heading">
            <div><p className="eyebrow">EDITOR</p><h2>Your text</h2></div>
            <span className="privacy-pill"><i /> Stored locally while this tab is open</span>
          </div>
          <div className="editor-toolbar">
            <span className="toolbar-label">TEXT ACTIONS</span>
            <button className="subtle-button" onClick={() => { setText(''); setActiveTool(''); }} type="button">Clear all</button>
          </div>
          <div className="tool-chips">
            {tools.map(tool => <button type="button" key={tool.label} className={`tool-chip ${activeTool === tool.label ? 'selected' : ''}`} onClick={() => runTool(tool)}>{tool.label}</button>)}
          </div>
          <label className="sr-only" htmlFor="text-editor">Enter or paste your text</label>
          <textarea id="text-editor" className="text-editor" value={text} onChange={event => setText(event.target.value)} placeholder="Type or paste text here..." spellCheck="true" />
          <div className="editor-footer"><span>{stats.words} words <b>·</b> {stats.characters} characters</span><span>Statistics update as you type</span></div>
          <div className="editor-actions">
            <button type="button" className="primary-button" onClick={copyText}><span>▣</span> Copy text</button>
            <button type="button" className="secondary-button" onClick={pasteText}>Paste</button>
            <button type="button" className="secondary-button" onClick={downloadText}>↓ Download .txt</button>
            <button type="button" className="secondary-button save-button" onClick={onSaveHistory} disabled={!text.trim()}>Save to history</button>
          </div>
        </section>
        <aside className="side-column">
          <TextSummary stats={stats} />
          <section className="panel replace-panel">
            <p className="eyebrow">QUICK EDIT</p><h2>Find & replace</h2>
            <label htmlFor="find-text">Find</label><input id="find-text" value={findValue} onChange={event => setFindValue(event.target.value)} placeholder="Word or phrase" />
            <label htmlFor="replace-text">Replace with</label><input id="replace-text" value={replaceValue} onChange={event => setReplaceValue(event.target.value)} placeholder="Replacement text" />
            <button className="secondary-button full-button" type="button" onClick={replaceAll}>Replace all matches <span>→</span></button>
          </section>
          <section className="panel history-panel">
            <div className="history-heading"><div><p className="eyebrow">YOUR RECENT WORK</p><h2>History</h2></div><span className="history-count">{history.length}/5</span></div>
            {history.length ? <ul className="history-list">{history.map(item => <li key={item.id}><button type="button" onClick={() => onRestoreHistory(item.text)}><strong>{item.preview}</strong><small>{item.words} words · {item.time}</small></button></li>)}</ul> : <p className="empty-history">Saved snippets will appear here.</p>}
          </section>
        </aside>
      </div>
    </main>
  );
}
