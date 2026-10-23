import { el, image, link } from '../utils/dom.js';

export function initHero(content) {
  document.querySelector('.hero__brand').textContent = content.name;

  const contacts = document.querySelector('.hero__contacts');
  for (const contact of content.headerContacts) contacts.append(link(contact.text, contact.href));

  // H1 поверх фото: крупные строки и подстрока, переносы строк как в макете
  const lines = (className, list) => {
    const node = el('span', className);
    list.forEach((line, i) => node.append(...(i ? [el('br'), line] : [line])));
    return node;
  };
  document.querySelector('.hero__title').append(lines('hero__title-main', content.title), lines('hero__title-sub', content.subtitle));

  // Главное фото — первый экран, грузим сразу и с высоким приоритетом
  const photo = image(content.hero, { eager: true });
  photo.fetchPriority = 'high';
  document.querySelector('.hero__image').prepend(photo);
}
