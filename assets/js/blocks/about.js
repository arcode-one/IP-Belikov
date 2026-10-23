import { el } from '../utils/dom.js';

export function initAbout(content) {
  document.querySelector('.about__title').textContent = content.about.title;
  const text = document.querySelector('.about__text');
  for (const paragraph of content.about.paragraphs) text.append(el('p', 'about__paragraph', paragraph));
}
