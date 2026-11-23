import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { getTextStats, toTitleCase, encodeMorse, decodeMorse } from './utils/textTools';

test('renders the TextUtils workspace', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /text editor/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/enter or paste your text/i)).toBeInTheDocument();
});

test('updates live word analytics', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText(/enter or paste your text/i), { target: { value: 'Hello world' } });
  expect(screen.getByText('2', { selector: 'strong' })).toBeInTheDocument();
});

test('calculates text statistics', () => {
  expect(getTextStats('One two.\n\nThree')).toMatchObject({ words: 3, paragraphs: 2, characters: 15 });
});

test('converts title case and Morse code', () => {
  expect(toTitleCase('hello world')).toBe('Hello World');
  expect(decodeMorse(encodeMorse('SOS'))).toBe('SOS');
});
