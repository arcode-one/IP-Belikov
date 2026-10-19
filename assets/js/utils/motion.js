export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/** behavior для scrollTo/scrollBy */
export const scrollBehavior = () => (reducedMotion.matches ? 'auto' : 'smooth');
