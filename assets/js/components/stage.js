// ==========================================================================
// Большое фото (.stage) и колонка справа с прокруткой треугольниками (.side-list).
// Используются в «Галерее работ» и «Полезных заметках».
// ==========================================================================

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
  return { side, list, update };
}

/**
 * Показывает выбранный элемент в списке, не прокручивая всю страницу.
 * align: 'center' — для миниатюр; 'start' — для длинных пунктов заметок (видно заголовок).
 */
export function revealInList(list, item, { align = 'center', instant = false } = {}) {
  const behavior = instant ? 'auto' : scrollBehavior();
  const vertical = list.scrollHeight > list.clientHeight + 1;
  if (vertical) {
    const top = item.offsetTop - list.offsetTop;
    if (align === 'start') list.scrollTo({ top, behavior });
    else if (top < list.scrollTop || top + item.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTo({ top: top - (list.clientHeight - item.offsetHeight) / 2, behavior });
    }
  } else if (list.scrollWidth > list.clientWidth + 1) {
    list.scrollTo({ left: item.offsetLeft - list.offsetLeft - (list.clientWidth - item.offsetWidth) / 2, behavior });
  }
}
