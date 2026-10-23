import { el, image, button } from '../utils/dom.js';
import { icon } from '../utils/icons.js';
import { loopSlider } from '../components/loop-slider.js';

export function initProducts(data, root) {
  const viewport = el('div', 'slider__viewport');
  viewport.tabIndex = 0;
  viewport.setAttribute('role', 'region');
  viewport.setAttribute('aria-label', data.title);
  const track = el('div', 'slider__track');
  viewport.append(track);

  const slides = data.items.map((item) => {
    const card = el('div', 'products__item');
    card.append(image(item, { className: 'products__image', alt: '' }), el('h2', 'products__title', item.title));
    return card;
  });

  const previous = button('tri tri--prev products__arrow', 'Предыдущие изделия', null, icon('tri-left'));
  const next = button('tri tri--next products__arrow', 'Следующие изделия', null, icon('tri-right'));
  const counter = el('span', 'counter products__counter');
  counter.setAttribute('aria-hidden', 'true');
  root.append(previous, viewport, next, counter);

  loopSlider({
    viewport,
    track,
    slides,
    previous,
    next,
    wheel: true,
    onChange: (first) => { counter.textContent = `${first + 1} / ${slides.length}`; },
    // У копий H2 заменяем на div, чтобы заголовков было 7, а не 35
    prepareClone: (clone) => {
      const title = clone.querySelector('h2');
      title.replaceWith(el('div', 'products__title', title.textContent));
    },
  });
}
