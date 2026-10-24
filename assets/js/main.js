import { initLightbox } from './components/lightbox.js';
import { initPolicyDialog } from './components/policy-dialog.js';
import { initProducts } from './blocks/products.js';
import { initWorks } from './blocks/works.js';
import { initNotes } from './blocks/notes.js';
import { initEquipment } from './blocks/equipment.js';
import { initLeadForm } from './blocks/lead-form.js';
import { initCookie } from './blocks/cookie.js';

// Разметку и контент выводит WordPress (template-parts/blocks), здесь только поведение

// Общие окна — до блоков, блоки открывают в них фото
initLightbox();
initPolicyDialog();

// Секции с фото: пустую секцию WordPress не выводит вовсе
const sections = [
  ['products', initProducts],
  ['works', initWorks],
  ['equipment', initEquipment],
  ['notes', initNotes],
];
for (const [id, init] of sections) {
  const section = document.querySelector(`#${id}`);
  if (section) init(section.querySelector(`.${id}`), section.querySelector('.section__title').textContent);
}

initLeadForm();
initCookie();

// Показываем страницу, когда всё собрано и шрифт загружен (но ждём шрифт не дольше 1,5 с)
const fontsReady = Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 1500))]);
fontsReady.then(() => document.documentElement.classList.remove('is-loading'));
