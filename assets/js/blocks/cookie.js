// ==========================================================================
// Плашка о cookies и обработке персональных данных (по ТЗ — всплывающее окно).
// Выбор запоминается в localStorage.
// ==========================================================================

import { el } from '../utils/dom.js';
import { icon } from '../utils/icons.js';

const STORAGE_KEY = 'cookie-consent';

export function initCookie() {
  const banner = document.querySelector('.cookie');
  const badge = el('span', 'cookie__icon');
  badge.append(icon('cookie'));
  banner.prepend(badge);

  let accepted = false;
  try { accepted = localStorage.getItem(STORAGE_KEY) === '1'; } catch { /* приватный режим */ }
  if (!accepted) banner.hidden = false;

  banner.querySelector('.cookie__button').addEventListener('click', () => {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* приватный режим */ }
    banner.hidden = true;
  });
}
