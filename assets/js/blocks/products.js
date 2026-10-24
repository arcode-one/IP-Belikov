import { el, button } from '../utils/dom.js';
import { icon } from '../utils/icons.js';
import { loopSlider } from '../components/loop-slider.js';

// Карточки выводит template-parts/blocks/products.php, здесь собираем из них ленту
export function initProducts(root, title) {
  const slides = [...root.querySelectorAll('.products__item')];
  const viewport = el('div', 'slider__viewport');
  viewport.tabIndex = 0;
  viewport.setAttribute('role', 'region');
  viewport.setAttribute('aria-label', title);
  const track = el('div', 'slider__track');
  viewport.append(track);

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
      const heading = clone.querySelector('h2');
      heading.replaceWith(el('div', 'products__title', heading.textContent));
    },
  });
}
