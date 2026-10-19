import { el, image, button } from '../utils/dom.js';
import { icon } from '../utils/icons.js';
import { scrollBehavior } from '../utils/motion.js';
import { bindSwipe } from '../utils/gestures.js';
import { createStage, createSideList, revealInList } from '../components/stage.js';
import { openImage } from '../components/lightbox.js';

// На телефоне заметки работают аккордеоном: открыт только выбранный пункт
const accordion = window.matchMedia('(max-width: 700px)');

export function initNotes(data, root) {
  const { items } = data;
  let index = 0;

  const { stage, photo } = createStage(() => openImage(items[index], photo));
  const { side, list, update } = createSideList('Список заметок');

  const cards = items.map((item, i) => {
    const card = el('article', 'notes__item');
    const head = button('notes__head', '', () => go(i), image(item, { className: 'notes__thumb', alt: '' }), el('h3', 'notes__title', item.title), icon('chevron-down', 'notes__chevron'));
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
      const head = card.querySelector('.notes__head');
      // Телефон: кнопка раскрывает пункт; компьютер: выбирает пункт для большого фото
      head.removeAttribute(accordion.matches ? 'aria-pressed' : 'aria-expanded');
      head.setAttribute(accordion.matches ? 'aria-expanded' : 'aria-pressed', i === index);
    });
    if (accordion.matches) {
      // Выбранный пункт встаёт первым под фото (CSS order), страница едет к фото
      if (!instant) stage.scrollIntoView({ block: 'start', behavior: scrollBehavior() });
    } else {
      // Пункт встаёт заголовком к верху колонки
      revealInList(list, cards[index], { align: 'start', instant });
    }
    update();
  }

  accordion.addEventListener('change', () => go(index, true));

  bindSwipe(stage, (direction) => go(index + direction));
  go(0, true);
}
