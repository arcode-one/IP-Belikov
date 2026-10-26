import { createGallery } from '../components/gallery.js';

export function initWorks(root) {
  createGallery(root, { listLabel: 'Миниатюры галереи' });
}
