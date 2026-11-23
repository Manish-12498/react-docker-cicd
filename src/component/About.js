import React from 'react';

export default function About() {
  return (
    <section className="about-section" id="about">
      <div>
        <p className="eyebrow">ABOUT THIS TOOL</p>
        <h2>A straightforward set of text utilities.</h2>
      </div>
      <p>
        TextUtils helps with common text tasks such as changing letter case,
        removing extra spaces, converting formats and checking basic text
        statistics. Text is processed in your browser. Nothing is uploaded
        to a server by this application.
      </p>
    </section>
  );
}
