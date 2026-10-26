import { reducedMotion } from '../utils/motion.js';

const ANIMATING = 'slider__track--animating';
const DRAGGING = 'slider__viewport--dragging';

/**
 * @param {object} options
 * @param {HTMLElement} options.viewport  — окно ленты (.slider__viewport)
 * @param {HTMLElement} options.track     — трек (.slider__track)
 * @param {HTMLElement[]} options.slides  — оригинальные карточки
 * @param {HTMLButtonElement} options.previous / options.next — треугольники
 * @param {number} [options.start]        — с какой карточки стартовать
 * @param {boolean} [options.wheel]       — листать вертикальным колесиком мыши (блок 1 по ТЗ)
 * @param {(clone: HTMLElement) => void} [options.prepareClone] — доработка копий (например, убрать H2)
 * @param {(first: number) => void} [options.onChange] — номер первой видимой карточки (для счётчика)
 */
export function loopSlider({ viewport, track, slides, previous, next, start = 0, wheel = false, prepareClone, onChange }) {
  const n = slides.length;
  const copy = () => slides.map((slide) => {
    const clone = slide.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.tabIndex = -1;
    for (const focusable of clone.querySelectorAll('button, a')) focusable.tabIndex = -1;
    prepareClone?.(clone);
    return clone;
  });
  track.append(...copy(), ...copy(), ...slides, ...copy(), ...copy());
  for (const img of track.querySelectorAll('img')) img.draggable = false;

  let index = 2 * n + start;
  let step = 0;
  let animating = false;
  let reported = -1;

  // Дробный шаг: offsetLeft округляет, и ошибка копится по десяткам карточек
  const measure = () => {
    const all = track.children;
    step = all.length > 1 ? all[1].getBoundingClientRect().left - all[0].getBoundingClientRect().left : viewport.clientWidth;
  };
  const place = (offset = 0, animate = false) => {
    track.classList.toggle(ANIMATING, animate && !reducedMotion.matches);
    track.style.transform = `translate3d(${-index * step + offset}px, 0, 0)`;
    const first = ((index % n) + n) % n;
    if (onChange && first !== reported) onChange(reported = first);
  };
  const visibleCount = () => Math.max(1, Math.round(viewport.clientWidth / step));

  // Незаметно переносим позицию в среднюю копию. Reflow обязателен: иначе следующая
  // анимация стартует со старой точки и лента «отматывается» назад через весь круг.
  const normalize = () => {
    while (index >= 3 * n) index -= n;
    while (index < 2 * n) index += n;
    place();
    void track.offsetWidth;
  };
  const currentX = () => new DOMMatrixReadOnly(getComputedStyle(track).transform).m41;

  const go = (delta) => {
    // Пока лента едет, просто перенацеливаем анимацию. В середину перескакиваем,
    // только когда кончается запас копий (больше круга быстрых кликов подряд).
    if (index + delta < n || index + delta + visibleCount() > 4 * n) {
      const offset = currentX() + index * step;
      normalize();
      place(offset);
      void track.offsetWidth;
    }
    index += delta;
    animating = !reducedMotion.matches;
    place(0, true);
    if (!animating) normalize();
  };
  // Доводим ленту до ближайшей карточки
  const settle = () => {
    animating = !reducedMotion.matches;
    place(0, true);
    if (!animating) normalize();
  };

  track.addEventListener('transitionend', (event) => {
    if (event.target !== track) return;
    animating = false;
    normalize();
  });

  previous.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  viewport.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    go(event.key === 'ArrowRight' ? 1 : -1);
  });

  // Свайп и перетаскивание мышью
  let drag = null;
  let suppressClickUntil = 0;

  viewport.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    // Схватили ленту на ходу — останавливаем её там, где она сейчас, без рывка
    let base = 0;
    if (animating) {
      const x = currentX();
      animating = false;
      index = Math.round(-x / step);
      base = x + index * step;
      normalize();
      place(base);
    }
    drag = { x: event.clientX, y: event.clientY, id: event.pointerId, dx: 0, base, t: performance.now(), active: false };
  });

  viewport.addEventListener('pointermove', (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.active) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      // Вертикальный жест отдаём странице
      if (Math.abs(dy) > Math.abs(dx)) {
        if (drag.base) settle();
        drag = null;
        return;
      }
      drag.active = true;
      viewport.setPointerCapture(event.pointerId);
      viewport.classList.add(DRAGGING);
    }
    drag.dx = dx;
    place(drag.base + dx);
  });

  const endDrag = (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const { dx: rawDx, base, t, active } = drag;
    const dx = rawDx + base;
    drag = null;
    viewport.classList.remove(DRAGGING);
    if (!active) {
      if (base) settle();
      return;
    }
    // Клик, который браузер шлёт сразу после перетаскивания, не должен открывать фото
    if (Math.abs(rawDx) > 6) suppressClickUntil = performance.now() + 350;
    const fast = Math.abs(rawDx) / Math.max(performance.now() - t, 1) > 0.4;
    let moved = Math.round(-dx / step);
    if (moved === 0 && fast && Math.abs(rawDx) > 20) moved = rawDx < 0 ? 1 : -1;
    index += Math.max(-n, Math.min(n, moved));
    settle();
  };
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  viewport.addEventListener('click', (event) => {
    if (performance.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  if (wheel) {
    // Колесико мыши листает ленту, но после полного круга отдаёт прокрутку странице,
    // чтобы бесконечная лента не «застревала» под курсором
    let accum = 0;
    let lapSteps = 0;
    let idle = 0;
    viewport.addEventListener('wheel', (event) => {
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      clearTimeout(idle);
      idle = setTimeout(() => { lapSteps = 0; accum = 0; }, 700);
      if (lapSteps >= n) return;
      event.preventDefault();
      accum += delta;
      if (Math.abs(accum) < 60 || animating) return;
      go(accum > 0 ? 1 : -1);
      accum = 0;
      lapSteps++;
    }, { passive: false });
    viewport.addEventListener('pointerleave', () => { lapSteps = 0; accum = 0; });
  } else {
    // Горизонтальный свайп двумя пальцами по тачпаду
    let accum = 0;
    viewport.addEventListener('wheel', (event) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      accum += event.deltaX;
      if (Math.abs(accum) < 60 || animating) return;
      go(accum > 0 ? 1 : -1);
      accum = 0;
    }, { passive: false });
  }

  new ResizeObserver(() => { measure(); place(); }).observe(viewport);
  measure();
  place();
}
