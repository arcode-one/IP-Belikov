import { button, imageData } from '../utils/dom.js';
import { icon } from '../utils/icons.js';
import { loopSlider } from '../components/loop-slider.js';
import { openImage } from '../components/lightbox.js';

// Окно ленты с фото выводит template-parts/blocks/equipment.php, здесь — стрелки, прокрутка и просмотр
export function initEquipment(root) {
  const viewport = root.querySelector('.slider__viewport');
  const track = viewport.querySelector('.slider__track');
  const slides = [...track.querySelectorAll('.equipment__item')];
  const items = slides.map(imageData);

  // Клик ловим на треке: так открываются и оригиналы, и копии по краям ленты
  track.addEventListener('click', (event) => {
    const card = event.target.closest('.equipment__item');
    if (!card) return;
    const index = Number(card.dataset.index);
    openImage(items[index], card, { items, index });
  });

  const previous = button('tri tri--overlay tri--prev', 'Предыдущие фото', null, icon('tri-left'));
  const next = button('tri tri--overlay tri--next', 'Следующие фото', null, icon('tri-right'));
  root.append(previous, next);
  loopSlider({ viewport, track, slides, previous, next });
}
