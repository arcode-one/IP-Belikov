import { el, button, imageData } from '../utils/dom.js';
import { icon } from '../utils/icons.js';
import { loopSlider } from '../components/loop-slider.js';
import { openImage } from '../components/lightbox.js';

// Карточки выводит template-parts/blocks/equipment.php, здесь собираем из них ленту
export function initEquipment(root, title) {
  const slides = [...root.querySelectorAll('.equipment__item')];
  const items = slides.map(imageData);
  const viewport = el('div', 'slider__viewport');
  viewport.tabIndex = 0;
  viewport.setAttribute('role', 'region');
  viewport.setAttribute('aria-label', title);
  const track = el('div', 'slider__track');
  viewport.append(track);

  // Клик ловим на треке: так открываются и оригиналы, и копии по краям ленты
  track.addEventListener('click', (event) => {
    const card = event.target.closest('.equipment__item');
    if (!card) return;
    const index = Number(card.dataset.index);
    openImage(items[index], card, { items, index });
  });

  const previous = button('tri tri--overlay tri--prev', 'Предыдущие фото', null, icon('tri-left'));
  const next = button('tri tri--overlay tri--next', 'Следующие фото', null, icon('tri-right'));
  root.append(viewport, previous, next);
  loopSlider({ viewport, track, slides, previous, next });
}
