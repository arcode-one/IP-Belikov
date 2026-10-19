import { el, image, button } from '../utils/dom.js';
import { bindSwipe } from '../utils/gestures.js';
import { createStage, createSideList, revealInList } from '../components/stage.js';
import { openImage } from '../components/lightbox.js';

export function initNotes(data, root) {
  const { items } = data;
  let index = 0;

  const { stage, photo } = createStage(() => openImage(items[index], photo));
  const { side, list, update } = createSideList('Список заметок');

  const cards = items.map((item, i) => {
    const card = el('article', 'notes__item');
    const head = button('notes__head', '', () => go(i), image(item, { className: 'notes__thumb', alt: '' }), el('h3', 'notes__title', item.title));
    const body = el('div', 'notes__body');
    for (const paragraph of item.text) body.append(el('p', 'notes__paragraph', paragraph));
    // Клик по тексту пункта тоже выбирает его
    card.addEventListener('click', (event) => { if (!event.target.closest('.notes__head')) go(i); });
    card.append(head, body);
    list.append(card);
    return card;
  });
  root.append(stage, side);

  function go(target, instant = false) {
    index = (target + items.length) % items.length;
    const item = items[index];
    photo.replaceChildren(image(item, { eager: true }));
    photo.setAttribute('aria-label', `Увеличить фото: ${item.title}`);
    cards.forEach((card, i) => {
      card.classList.toggle('notes__item--selected', i === index);
      card.querySelector('.notes__head').setAttribute('aria-pressed', i === index);
    });
    // Пункт встаёт заголовком к верху колонки
    revealInList(list, cards[index], { align: 'start', instant });
    update();
  }

  bindSwipe(stage, (direction) => go(index + direction));
  go(0, true);
}
