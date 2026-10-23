import { el, button } from '../utils/dom.js';
import { icon } from '../utils/icons.js';
import { scrollBehavior } from '../utils/motion.js';

/** Большое фото: кнопка на всю площадь (клик — открыть крупно) и значок «увеличить» */
export function createStage(onOpen) {
  const stage = el('div', 'stage');
  const photo = button('stage__photo', '', onOpen);
  photo.setAttribute('aria-haspopup', 'dialog');
  const zoom = el('span', 'stage__zoom');
  zoom.append(icon('maximize'));
  stage.append(photo, zoom);
  return { stage, photo };
}

/** Колонка справа: треугольник вверх, список, треугольник вниз */
export function createSideList(label) {
  const side = el('div', 'side-list');
  const list = el('div', 'side-list__items');
  list.setAttribute('role', 'group');
  list.setAttribute('aria-label', label);
  const scroll = (direction) => list.scrollBy({ top: direction * list.clientHeight * 0.75, behavior: scrollBehavior() });
  const up = button('tri tri--up side-list__arrow', 'Прокрутить вверх', () => scroll(-1), icon('tri-up'));
  const down = button('tri tri--down side-list__arrow', 'Прокрутить вниз', () => scroll(1), icon('tri-down'));
  side.append(up, list, down);

  const update = () => {
    up.disabled = list.scrollTop <= 2;
    down.disabled = list.scrollTop >= list.scrollHeight - list.clientHeight - 2;
  };
  list.addEventListener('scroll', update, { passive: true });
  new ResizeObserver(update).observe(list);
  bindDragScroll(list);
  return { side, list, update };
}

/** Перетаскивание списка мышью (палец и так прокручивает нативно) */
function bindDragScroll(list) {
  let drag = null;
  let suppressClickUntil = 0;

  list.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    drag = { y: event.clientY, x: event.clientX, top: list.scrollTop, left: list.scrollLeft, moved: false, id: event.pointerId };
  });
  list.addEventListener('pointermove', (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    const dy = event.clientY - drag.y;
    const dx = event.clientX - drag.x;
    if (!drag.moved && Math.hypot(dx, dy) < 6) return;
    if (!drag.moved) {
      drag.moved = true;
      try { list.setPointerCapture(event.pointerId); } catch { /* указатель уже отпущен */ }
      list.classList.add('side-list__items--dragging');
      window.getSelection()?.removeAllRanges();
    }
    list.scrollTop = drag.top - dy;
    list.scrollLeft = drag.left - dx;
  });
  const end = (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    if (drag.moved) suppressClickUntil = Date.now() + 300;
    list.classList.remove('side-list__items--dragging');
    drag = null;
  };
  list.addEventListener('pointerup', end);
  list.addEventListener('pointercancel', end);
  // Браузер не должен тащить картинку как файл
  list.addEventListener('dragstart', (event) => event.preventDefault());
  // После перетаскивания click не должен выбирать пункт
  list.addEventListener('click', (event) => {
    if (Date.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
}

/** Показывает выбранную миниатюру в колонке (или ленте), не прокручивая всю страницу */
export function revealInList(list, item) {
  const behavior = scrollBehavior();
  const vertical = list.scrollHeight > list.clientHeight + 1;
  if (vertical) {
    const top = item.offsetTop - list.offsetTop;
    if (top < list.scrollTop || top + item.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTo({ top: top - (list.clientHeight - item.offsetHeight) / 2, behavior });
    }
  } else if (list.scrollWidth > list.clientWidth + 1) {
    list.scrollTo({ left: item.offsetLeft - list.offsetLeft - (list.clientWidth - item.offsetWidth) / 2, behavior });
  }
}
