import { lockScroll } from '../utils/dom.js';

export function initPolicyDialog() {
  const dialog = document.querySelector('#policy-dialog');
  const body = dialog.querySelector('.policy-dialog__body');
  let trigger = null;

  document.addEventListener('click', async (event) => {
    const linkEl = event.target.closest('a[data-policy]');
    if (!linkEl) return;
    event.preventDefault();
    trigger = linkEl;
    try {
      if (!body.childElementCount) {
        const response = await fetch(linkEl.href);
        if (!response.ok) throw new Error(String(response.status));
        const page = new DOMParser().parseFromString(await response.text(), 'text/html');
        const policy = page.querySelector('.policy');
        policy.querySelectorAll('.policy__back').forEach((back) => back.remove());
        policy.classList.remove('policy--page');
        policy.querySelector('.policy__title').id = 'policy-dialog-title';
        body.replaceChildren(policy);
      }
      dialog.showModal();
      body.scrollTop = 0;
      lockScroll(true);
    } catch {
      location.href = linkEl.href;
    }
  });

  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    lockScroll(false);
    trigger?.focus({ preventScroll: true });
  });
}
