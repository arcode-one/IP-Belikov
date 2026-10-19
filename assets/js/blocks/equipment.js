// ==========================================================================
// Блок 3 «Оборудование»: по 3 фото в ширину, бесконечная лента.
// Клик по фото открывает просмотр, в нём можно листать дальше.
// ==========================================================================

import { el, image, button } from '../utils/dom.js';
import { icon } from '../utils/icons.js';
import { loopSlider } from '../components/loop-slider.js';
import { openImage } from '../components/lightbox.js';

export function initEquipment(data, root) {
  const viewport = el('div', 'slider__viewport');
  viewport.tabIndex = 0;
  viewport.setAttribute('role', 'region');
  viewport.setAttribute('aria-label', data.title);
  const track = el('div', 'slider__track');
  viewport.append(track);

  const slides = data.items.map((item, i) => {
    const zoom = el('span', 'equipment__zoom');
    zoom.append(icon('maximize'));
    const card = button('equipment__item', `Увеличить фото ${i + 1}`, null, image(item, { alt: '' }), zoom);
    card.dataset.index = i;
    card.setAttribute('aria-haspopup', 'dialog');
    return card;
  });

  // Клик ловим на треке: так открываются и оригиналы, и копии по краям ленты
  track.addEventListener('click', (event) => {
    const card = event.target.closest('.equipment__item');
    if (!card) return;
    const index = Number(card.dataset.index);
    openImage(data.items[index], card, { items: data.items, index });
  });

  const previous = button('tri tri--overlay tri--prev', 'Предыдущие фото', null, icon('tri-left'));
  const next = button('tri tri--overlay tri--next', 'Следующие фото', null, icon('tri-right'));
  root.append(viewport, previous, next);
  loopSlider({ viewport, track, slides, previous, next });
}
