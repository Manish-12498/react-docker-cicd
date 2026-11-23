import React from 'react';

const items = [
  ['words', 'Words'],
  ['characters', 'Characters'],
  ['charactersNoSpaces', 'Characters (no spaces)'],
  ['sentences', 'Sentences'],
  ['paragraphs', 'Paragraphs'],
  ['readingMinutes', 'Reading time']
];

export default function TextSummary({ stats }) {
  return (
    <section className="panel analytics-panel" id="analytics">
      <div className="section-heading">
        <div>
          <p className="eyebrow">DOCUMENT DETAILS</p>
          <h2>Text statistics</h2>
        </div>
        <span className="live-indicator"><i /> Updating</span>
      </div>
      <dl className="stats-list">
        {items.map(([key, label]) => (
          <div className="stat-row" key={key}>
            <dt>{label}</dt>
            <dd>{stats[key].toLocaleString()}{key === 'readingMinutes' ? ' min' : ''}</dd>
          </div>
        ))}
      </dl>
      <div className="detail-stats">
        <div><span>Letters</span><strong>{stats.letters.toLocaleString()}</strong></div>
        <div><span>Average word length</span><strong>{stats.averageWordLength}</strong></div>
      </div>
      <p className="stats-footnote">Reading time is estimated at 200 words per minute.</p>
    </section>
  );
}
