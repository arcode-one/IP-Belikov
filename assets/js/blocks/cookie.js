const STORAGE_KEY = 'cookie-consent';

export function initCookie() {
  const banner = document.querySelector('.cookie');

  let accepted = false;
  try { accepted = localStorage.getItem(STORAGE_KEY) === '1'; } catch { /* приватный режим */ }
  if (!accepted) banner.hidden = false;

  banner.querySelector('.cookie__button').addEventListener('click', () => {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* приватный режим */ }
    banner.hidden = true;
  });
}
