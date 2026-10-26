import { el, image, button, lockScroll } from '../utils/dom.js';
import { icon } from '../utils/icons.js';
import { bindSwipe } from '../utils/gestures.js';

let dialog;
let picture;
let counter;
let trigger = null;
let set = null;
let showing = 0;

/** Размер фото в окне: как можно крупнее, с полями 16px от краёв экрана */
function fit(img) {
  const ratio = img.naturalWidth / img.naturalHeight;
  const width = Math.min(window.innerWidth - 32, (window.innerHeight - 32) * ratio);
  img.style.width = `${Math.round(width)}px`;
  img.style.height = `${Math.round(width / ratio)}px`;
  return img;
}

/** Картинка скачана (или не скачалась — тогда покажем как есть, с alt) */
function loaded(img) {
  if (img.complete) return Promise.resolve(img);
  return new Promise((resolve) => {
    img.addEventListener('load', () => resolve(img), { once: true });
    img.addEventListener('error', () => resolve(img), { once: true });
  });
}

/**
 * Окно подстраивается под фото, поэтому пустым его показывать нельзя — схлопнется в точку.
 * Что придёт раньше: превью, уже скачанное на странице (растягиваем до того же размера),
 * или крупный файл. Крупный в итоге всегда заменяет превью. Пока показать нечего,
 * на экране остаётся прежнее фото. Промис — когда в окне уже есть что показать.
 */
function show(item) {
  const current = ++showing;
  const put = (img) => {
    if (current === showing) picture.replaceChildren(img.naturalWidth ? fit(img) : img);
  };
  const full = image(item, { eager: true });
  const fullShown = loaded(full).then(put);
  if (!item.preview || item.preview === item.src) return fullShown;

  const preview = image({ src: item.preview, alt: item.alt }, { eager: true });
  const previewShown = loaded(preview).then((img) => {
    if (full.complete && full.naturalWidth) return fullShown;
    if (!img.naturalWidth) return fullShown;
    put(img);
  });
  return Promise.race([fullShown, previewShown]);
}

function step(direction) {
  if (!set) return;
  set.index = (set.index + direction + set.items.length) % set.items.length;
  show(set.items[set.index]);
  counter.textContent = `${set.index + 1} / ${set.items.length}`;
  set.onChange?.(set.index);
}

export function initLightbox() {
  dialog = document.querySelector('#lightbox');
  picture = dialog.querySelector('.lightbox__image');
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());

  const previous = button('tri tri--overlay tri--prev lightbox__arrow', 'Предыдущее фото', () => step(-1), icon('tri-left'));
  const next = button('tri tri--overlay tri--next lightbox__arrow', 'Следующее фото', () => step(1), icon('tri-right'));
  counter = el('span', 'counter lightbox__counter');
  counter.setAttribute('aria-live', 'polite');
  dialog.append(previous, next, counter);

  dialog.addEventListener('keydown', (event) => {
    if (!set || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    step(event.key === 'ArrowRight' ? 1 : -1);
  });
  // Клик по затемнению вокруг фото закрывает окно
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) dialog.close();
  });
  dialog.addEventListener('close', () => {
    lockScroll(false);
    set = null;
    trigger?.focus({ preventScroll: true });
  });
  bindSwipe(picture, step);

  window.addEventListener('resize', () => {
    const img = picture.querySelector('img');
    if (dialog.open && img?.naturalWidth) fit(img);
  });
}

/**
 * Открыть фото.
 * @param {object} item — { src, alt, preview? } (preview — уже загруженная на странице уменьшенная копия)
 * @param {HTMLElement} from — элемент, на который вернуть фокус после закрытия
 * @param {{ items: object[], index: number, onChange?: (index: number) => void }} [gallery] — набор для листания
 */
export function openImage(item, from, gallery = null) {
  trigger = from;
  set = gallery && gallery.items.length > 1 ? { ...gallery } : null;
  dialog.classList.toggle('lightbox--set', !!set);
  if (set) counter.textContent = `${set.index + 1} / ${set.items.length}`;
  show(item).then(() => {
    if (dialog.open) return;
    dialog.showModal();
    lockScroll(true);
  });
}
