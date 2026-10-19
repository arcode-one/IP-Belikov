// ==========================================================================
// Точка входа скриптов. Каждый блок страницы — свой модуль в assets/js/blocks.
// ==========================================================================

import content from './content.js';
import { initLightbox } from './components/lightbox.js';
import { initPolicyDialog } from './components/policy-dialog.js';
import { initHero } from './blocks/hero.js';
import { initIntro } from './blocks/intro.js';
import { initProducts } from './blocks/products.js';
import { initWorks } from './blocks/works.js';
import { initNotes } from './blocks/notes.js';
import { initEquipment } from './blocks/equipment.js';
import { initContact } from './blocks/contact.js';
import { initLeadForm } from './blocks/lead-form.js';
import { initFooter } from './blocks/footer.js';
import { initCookie } from './blocks/cookie.js';

// Общие окна — до блоков, блоки открывают в них фото
initLightbox();
initPolicyDialog();

initHero(content);
initIntro(content);

// Секции с фото: если в секции нет ни одного элемента, она скрывается
const sections = [
  ['products', initProducts],
  ['works', initWorks],
  ['notes', initNotes],
  ['equipment', initEquipment],
];
for (const [id, init] of sections) {
  const data = content[id];
  const section = document.querySelector(`#${id}`);
  if (!data?.items?.length) {
    section.hidden = true;
    continue;
  }
  section.querySelector('.section__title').textContent = data.title;
  init(data, section.querySelector(`.${id}`));
}

initContact(content);
initLeadForm(content);
initFooter(content);
initCookie();
