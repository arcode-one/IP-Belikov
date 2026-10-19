// ==========================================================================
// Просмотр фото крупно. Если передан набор (галерея, оборудование) — внутри можно листать
// треугольниками, свайпом и стрелками клавиатуры, а лента под окном идёт следом.
// ==========================================================================

import { el, image, button, lockScroll } from '../utils/dom.js';
import { icon } from '../utils/icons.js';
import { bindSwipe } from '../utils/gestures.js';

let dialog;
let picture;
let counter;
let trigger = null;
let set = null;

function show(item) {
  picture.replaceChildren(image(item, { eager: true }));
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
  counter = el('span', 'stage__counter lightbox__counter');
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
}

/**
 * Открыть фото.
 * @param {object} item — { src, alt }
 * @param {HTMLElement} from — элемент, на который вернуть фокус после закрытия
 * @param {{ items: object[], index: number, onChange?: (index: number) => void }} [gallery] — набор для листания
 */
export function openImage(item, from, gallery = null) {
  trigger = from;
  set = gallery && gallery.items.length > 1 ? { ...gallery } : null;
  dialog.classList.toggle('lightbox--set', !!set);
  if (set) counter.textContent = `${set.index + 1} / ${set.items.length}`;
  show(item);
  dialog.showModal();
  lockScroll(true);
}
