// ==========================================================================
// H1 и вводный текст. По ТЗ текст — заголовок H2, поэтому абзацы — span внутри него.
// ==========================================================================

import { el } from '../utils/dom.js';

export function initIntro(content) {
  document.querySelector('.intro__title').textContent = content.title;
  const text = document.querySelector('.intro__text');
  for (const paragraph of content.paragraphs) text.append(el('span', 'intro__paragraph', paragraph));
}
