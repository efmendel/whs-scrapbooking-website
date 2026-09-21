// Scissors cursor + "click an empty spot to add a sticker".
// Mouse/trackpad only; touch devices keep their normal behaviour.

const fine = window.matchMedia('(pointer: fine)');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

const MAX_STICKERS = 12;
const LIFETIME_MS = 9000;

// Clicking on any of these should behave normally, not add a sticker.
const SKIP =
  'a, button, input, textarea, select, label, summary, p, h1, h2, h3, figcaption, li, .lbl, .code-card, .hero__code, .nav__sheet, [data-no-stick]';

const shapes: Record<string, string> = {
  heart:
    '<path d="M50 88 C20 66 6 50 6 32 C6 18 17 8 30 8 C39 8 46 13 50 20 C54 13 61 8 70 8 C83 8 94 18 94 32 C94 50 80 66 50 88Z" fill="var(--rose)" stroke="var(--card)" stroke-width="12" stroke-linejoin="round" paint-order="stroke"/>',
  star:
    '<polygon points="50,6 61,38 95,38 67,58 78,92 50,72 22,92 33,58 5,38 39,38" fill="var(--honey)" stroke="var(--card)" stroke-width="12" stroke-linejoin="round" paint-order="stroke"/>',
  sparkle:
    '<path d="M50 5 C54 36 64 46 95 50 C64 54 54 64 50 95 C46 64 36 54 5 50 C36 46 46 36 50 5Z" fill="var(--apricot)" stroke="var(--card)" stroke-width="12" stroke-linejoin="round" paint-order="stroke"/>',
  blush:
    '<path d="M50 88 C20 66 6 50 6 32 C6 18 17 8 30 8 C39 8 46 13 50 20 C54 13 61 8 70 8 C83 8 94 18 94 32 C94 50 80 66 50 88Z" fill="var(--blush)" stroke="var(--card)" stroke-width="12" stroke-linejoin="round" paint-order="stroke"/>',
};
const kinds = Object.keys(shapes);

function init() {
  if (!fine.matches) return;
  document.documentElement.classList.add('fancy-cursor');

  const layer = document.querySelector<HTMLElement>('[data-sticker-layer]');
  if (!layer) return;
  const placed: SVGSVGElement[] = [];

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest(SKIP)) return;
    if (window.getSelection()?.toString()) return;

    const rect = layer.getBoundingClientRect();
    const size = 44 + Math.round(Math.random() * 20);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    const rotate = Math.round(Math.random() * 50 - 25);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '-10 -10 120 120');
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));
    svg.style.left = `${x}px`;
    svg.style.top = `${y}px`;
    svg.style.rotate = `${rotate}deg`;
    svg.innerHTML = shapes[kind];
    layer.appendChild(svg);
    placed.push(svg);

    if (!reduced.matches) {
      svg.animate(
        [
          { transform: 'scale(1.7)', opacity: 0 },
          { transform: 'scale(0.9)', opacity: 1, offset: 0.7 },
          { transform: 'scale(1)', opacity: 1 },
        ],
        { duration: 320, easing: 'cubic-bezier(.34,1.56,.64,1)' },
      );
    }

    const remove = () => {
      const i = placed.indexOf(svg);
      if (i === -1) return;
      placed.splice(i, 1);
      if (reduced.matches) return svg.remove();
      svg.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(10px)' }], { duration: 400, fill: 'forwards' })
        .finished.then(() => svg.remove());
    };
    setTimeout(remove, LIFETIME_MS);
    if (placed.length > MAX_STICKERS) {
      const oldest = placed.shift();
      oldest?.remove();
    }
  });
}

init();
