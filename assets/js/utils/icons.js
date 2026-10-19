/** <span class="icon icon--phone"> — декоративная иконка, скринридер её пропускает */
export function icon(name, className = '') {
  const node = document.createElement('span');
  node.className = `icon icon--${name}${className ? ` ${className}` : ''}`;
  node.setAttribute('aria-hidden', 'true');
  return node;
}
