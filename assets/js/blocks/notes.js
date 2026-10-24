import { createGallery } from '../components/gallery.js';

// Заметки устроены как галерея: текст впечатан в картинки, крупно открываются по клику
export function initNotes(root) {
  createGallery(root, { listLabel: 'Список заметок' });
}
