export const MORSE = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....',
  I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
  Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
  Y: '-.--', Z: '--..', 0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-',
  5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.', '.': '.-.-.-', ',': '--..--',
  '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
  '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-',
  '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.', ' ': '/'
};
const REVERSE_MORSE = Object.fromEntries(Object.entries(MORSE).map(([key, value]) => [value, key]));

export function encodeMorse(value) {
  return value.toUpperCase().split('').map(char => MORSE[char] || '').filter((code, index, all) => code || value[index] === ' ').join(' ');
}
export function decodeMorse(value) {
  const input = value.trim();
  if (!input) return '';
  return input.split(/\s*\/\s*/).map(word => word.trim().split(/\s+/).map(code => REVERSE_MORSE[code] || '�').join('')).join(' ');
}
export function getTextStats(value) {
  const trimmed = value.trim();
  const words = trimmed ? trimmed.split(/\s+/) : [];
  const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || []).filter(s => s.trim()).length : 0;
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
  const readingMinutes = words.length ? Math.max(1, Math.ceil(words.length / 200)) : 0;
  const letters = (value.match(/[A-Za-z]/g) || []).length;
  return {
    characters: value.length,
    charactersNoSpaces: value.replace(/\s/g, '').length,
    words: words.length,
    sentences,
    paragraphs,
    letters,
    readingMinutes,
    averageWordLength: words.length ? (words.reduce((sum, word) => sum + word.length, 0) / words.length).toFixed(1) : '0.0'
  };
}
export function toTitleCase(value) {
  return value.toLowerCase().replace(/(^|\s|[-'])\S/g, match => match.toUpperCase());
}
export function toSentenceCase(value) {
  return value.toLowerCase().replace(/(^\s*[a-z]|[.!?]\s+[a-z])/g, match => match.toUpperCase());
}
export function reverseText(value) {
  return Array.from(value).reverse().join('');
}
export function removeDuplicateLines(value) {
  return [...new Set(value.split(/\r?\n/))].join('\n');
}
export function encodeBase64(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}
export function decodeBase64(value) {
  const binary = atob(value.trim());
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
