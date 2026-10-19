import { image, link } from '../utils/dom.js';

export function initHero(content) {
  document.querySelector('.hero__brand').textContent = content.name;

  const contacts = document.querySelector('.hero__contacts');
  for (const contact of content.headerContacts) contacts.append(link(contact.text, contact.href));

  // Главное фото — первый экран, грузим сразу и с высоким приоритетом
  const photo = image(content.hero, { eager: true });
  photo.fetchPriority = 'high';
  document.querySelector('.hero__image').append(photo);
}
