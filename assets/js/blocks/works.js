import { createGallery } from '../components/gallery.js';

export function initWorks(data, root) {
  createGallery(data.items, root, { listLabel: 'Миниатюры галереи' });
}
