/** Элемент с классом и текстом: el('p', 'about__paragraph', 'Текст') */
export function el(tag, className = '', text = '') {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

/** Картинка. eager — грузить сразу (первый экран, большое фото), иначе лениво */
export function image(item, { className = '', eager = false, alt } = {}) {
  const img = document.createElement('img');
  if (className) img.className = className;
  img.src = item.src;
  img.alt = alt ?? item.alt ?? item.title ?? '';
  img.loading = eager ? 'eager' : 'lazy';
  img.decoding = 'async';
  return img;
}

/** Ссылка, если адрес валидный (http, mailto, tel, #), иначе просто текст */
export function link(text, href, className = '') {
  const valid = /^(https?:|mailto:|tel:|#)/i.test(href || '');
  const node = el(valid ? 'a' : 'span', className, text);
  if (valid) node.href = href;
  return node;
}

/** Кнопка type="button" с подписью для скринридера и обработчиком клика */
export function button(className, label, onClick, ...children) {
  const node = el('button', className);
  node.type = 'button';
  if (label) node.setAttribute('aria-label', label);
  if (onClick) node.addEventListener('click', onClick);
  node.append(...children);
  return node;
}

/** Блокирует прокрутку страницы под всплывающим окном */
export function lockScroll(locked) {
  document.body.style.overflow = locked ? 'hidden' : '';
}
