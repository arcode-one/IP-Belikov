// ==========================================================================
// Подвал: контакты слева, мессенджеры MAX и VK справа.
// ==========================================================================

import { link } from '../utils/dom.js';
import { icon } from '../utils/icons.js';

export function initFooter(content) {
  const contacts = document.querySelector('.footer__contacts');
  const rows = [
    [content.address, ''],
    [`тел. ${content.phone.text}`, content.phone.href],
    [content.email.text, content.email.href],
  ];
  for (const [text, href] of rows) contacts.append(link(text, href));

  const socials = document.querySelector('.footer__social-links');
  for (const social of content.socials) {
    const item = link('', social.href, `social social--${social.id}`);
    item.append(icon(social.id));
    item.setAttribute('aria-label', social.text);
    item.title = social.text;
    // href="#" — ссылка-заглушка, пока заказчик не прислал адрес
    if (social.href === '#') item.addEventListener('click', (event) => event.preventDefault());
    else if (item.tagName === 'A') {
      item.target = '_blank';
      item.rel = 'noopener';
    }
    socials.append(item);
  }
}
