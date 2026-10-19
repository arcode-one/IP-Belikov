import { el, link } from '../utils/dom.js';
import { icon } from '../utils/icons.js';

export function initContact(content) {
  const list = document.querySelector('.contact__list');
  const rows = [
    ['map-pin', 'Адрес', content.address, ''],
    ['phone', 'Телефон', content.phone.text, content.phone.href],
    ['mail', 'Email', content.email.text, content.email.href],
  ];
  for (const [iconName, label, text, href] of rows) {
    const item = el('li', 'contact__item');
    item.append(icon(iconName, 'contact__icon'), el('span', 'contact__label', label), link(text, href));
    list.append(item);
  }
}
