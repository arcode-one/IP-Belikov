import { el, button } from '../utils/dom.js';
import { icon } from '../utils/icons.js';
import { loopSlider } from '../components/loop-slider.js';

// Окно ленты с карточками выводит template-parts/blocks/products.php, здесь — стрелки, счётчик и прокрутка
export function initProducts(root) {
  const viewport = root.querySelector('.slider__viewport');
  const track = viewport.querySelector('.slider__track');
  const slides = [...track.querySelectorAll('.products__item')];

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
