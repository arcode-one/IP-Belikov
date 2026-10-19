/**
 * Свайп влево/вправо по элементу (мышь, палец, перо — Pointer Events).
 * Вертикальная прокрутка страницы остаётся нативной.
 * move(1) — следующее фото, move(-1) — предыдущее.
 */
export function bindSwipe(surface, move) {
  let start = null;
  let suppressClickUntil = 0;

  surface.addEventListener('pointerdown', (event) => {
    if (event.isPrimary && event.button === 0) start = { x: event.clientX, y: event.clientY, id: event.pointerId };
  });
  surface.addEventListener('pointercancel', () => { start = null; });
  surface.addEventListener('pointerup', (event) => {
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    start = null;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.3) return;
    suppressClickUntil = Date.now() + 300;
    move(dx < 0 ? 1 : -1);
  });
  // После свайпа браузер шлёт click — он не должен открывать фото
  surface.addEventListener('click', (event) => {
    if (Date.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
}

/** Стрелки ← → на клавиатуре (кроме полей ввода) */
export function bindArrowKeys(root, move) {
  root.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || event.target.matches('input, textarea')) return;
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 1 : -1);
  });
}
