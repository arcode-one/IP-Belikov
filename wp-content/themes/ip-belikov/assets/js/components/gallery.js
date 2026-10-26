import { el, image, button, imageData } from '../utils/dom.js';
import { icon } from '../utils/icons.js';
import { bindSwipe, bindArrowKeys } from '../utils/gestures.js';
import { createStage, createSideList, revealInList } from './stage.js';
import { openImage } from './lightbox.js';

/**
 * Галерея: большое фото с треугольниками и счётчиком, справа колонка миниатюр.
 * Используется в «Галерее работ» и «Полезных заметках».
 * Миниатюры выводит template-parts/blocks/gallery.php, остальное собираем здесь.
 */
export function createGallery(root, { listLabel }) {
  const thumbs = [...root.querySelectorAll('.side-list__thumb')];
  const items = thumbs.map(imageData);
  let index = 0;

  const { stage, photo } = createStage(() => openImage(items[index], photo, { items, index, onChange: go }));
  const previous = button('tri tri--overlay tri--prev', 'Предыдущее фото', () => go(index - 1), icon('tri-left'));
  const next = button('tri tri--overlay tri--next', 'Следующее фото', () => go(index + 1), icon('tri-right'));
  const counter = el('span', 'counter stage__counter');
  counter.setAttribute('aria-hidden', 'true');
  stage.append(previous, next, counter);

  const { side, list, update } = createSideList(listLabel);
  thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => go(i)));
  list.append(...thumbs);
  root.append(stage, side);

  function go(target) {
    index = (target + items.length) % items.length;
    photo.replaceChildren(image(items[index], { eager: true }));
    photo.setAttribute('aria-label', `Увеличить: ${items[index].alt}, ${index + 1} из ${items.length}`);
    counter.textContent = `${index + 1} / ${items.length}`;
    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle('side-list__thumb--selected', i === index);
      thumb.setAttribute('aria-pressed', i === index);
    });
    revealInList(list, thumbs[index]);
    update();
  }

  bindSwipe(stage, (direction) => go(index + direction));
  bindArrowKeys(root, (direction) => go(index + direction));
  go(0);
}
