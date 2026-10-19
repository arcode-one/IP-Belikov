// ==========================================================================
// Блок 2 «Галерея выполненных работ»: большое фото слева, миниатюры справа.
// Клик по фото открывает просмотр, в нём можно листать дальше.
// ==========================================================================

import { el, image, button } from '../utils/dom.js';
import { icon } from '../utils/icons.js';
import { bindSwipe, bindArrowKeys } from '../utils/gestures.js';
import { createStage, createSideList, revealInList } from '../components/stage.js';
import { openImage } from '../components/lightbox.js';

export function initWorks(data, root) {
  const { items } = data;
  let index = 0;

  const { stage, photo } = createStage(() => openImage(items[index], photo, { items, index, onChange: go }));
  const previous = button('tri tri--overlay tri--prev', 'Предыдущее фото', () => go(index - 1), icon('tri-left'));
  const next = button('tri tri--overlay tri--next', 'Следующее фото', () => go(index + 1), icon('tri-right'));
  const counter = el('span', 'stage__counter');
  counter.setAttribute('aria-hidden', 'true');
  stage.append(previous, next, counter);

  const { side, list, update } = createSideList('Миниатюры галереи');
  const thumbs = items.map((item, i) => {
    const thumb = button('works__thumb', `Показать фото ${i + 1}`, () => go(i), image(item, { alt: '' }));
    list.append(thumb);
    return thumb;
  });
  root.append(stage, side);

  function go(target) {
    index = (target + items.length) % items.length;
    photo.replaceChildren(image(items[index], { eager: true }));
    photo.setAttribute('aria-label', `Увеличить: ${items[index].alt}, ${index + 1} из ${items.length}`);
    counter.textContent = `${index + 1} / ${items.length}`;
    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle('works__thumb--selected', i === index);
      thumb.setAttribute('aria-pressed', i === index);
    });
    revealInList(list, thumbs[index]);
    update();
  }

  bindSwipe(stage, (direction) => go(index + direction));
  bindArrowKeys(root, (direction) => go(index + direction));
  go(0);
}
