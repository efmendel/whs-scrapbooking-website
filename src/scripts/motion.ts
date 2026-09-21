import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

const mm = gsap.matchMedia();

// Everything below only runs when the visitor hasn't asked for reduced motion.
// With reduced motion the page is simply static (and `html.motion` is never set).
mm.add('(prefers-reduced-motion: no-preference)', () => {
  heroEntrance();
  tapeProgress();
  tearLabels();
  riseIn();
  flutterNotes();
  developPhotos();
  parallaxGallery();
  checkSteps();
  stampCode();
  ticketSlide();
  dealCards();
});

mm.add('(prefers-reduced-motion: no-preference) and (min-width: 1180px)', () => stitchThread());

/* ---------------- hero: the page assembles itself ---------------- */
function heroEntrance() {
  const label = $('.hero [data-hero="label"]');
  const lines = $('.hero [data-hero="line"]');
  const copy = $('.hero [data-hero="copy"]');
  const polaroids = $('.hero [data-hero="polaroid"]');
  const stickers = $('.hero [data-hero="sticker"]');
  const squiggle = document.querySelector<SVGPathElement>('[data-squiggle]');

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (label.length) tl.fromTo(label, { autoAlpha: 0, clipPath: 'inset(0 100% 0 0)' }, { autoAlpha: 1, clipPath: 'inset(0 0% 0 0)', duration: 0.5 });
  tl.fromTo(lines, { autoAlpha: 0, y: 40, rotation: -4 }, { autoAlpha: 1, y: 0, rotation: 0, duration: 0.55, stagger: 0.12, ease: 'back.out(1.8)' }, '-=0.2');

  if (squiggle) {
    const len = squiggle.getTotalLength();
    tl.fromTo(squiggle, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' }, '-=0.1');
  }

  tl.fromTo(copy, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.1 }, '-=0.5');

  // polaroids drop in from above, land with a little bounce, then get taped down
  polaroids.forEach((p, i) => {
    const tape = p.querySelector('[data-tape]');
    const at = 0.25 + i * 0.22;
    tl.fromTo(
      p,
      { autoAlpha: 0, y: -140, rotation: `+=${i % 2 ? 14 : -14}`, scale: 1.08 },
      { autoAlpha: 1, y: 0, rotation: `-=${i % 2 ? 14 : -14}`, scale: 1, duration: 0.7, ease: 'bounce.out' },
      at,
    );
    if (tape) tl.fromTo(tape, { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.out' }, at + 0.6);
  });

  // stickers slap on: too big, then settle
  tl.fromTo(
    stickers,
    { autoAlpha: 0, scale: 1.6 },
    { autoAlpha: 1, scale: 1, duration: 0.4, stagger: 0.12, ease: 'back.out(2.5)' },
    1.1,
  );

  return () => tl.kill();
}

/* ---------------- washi tape that grows with scroll ---------------- */
function tapeProgress() {
  const fill = document.querySelector('[data-progress]');
  if (!fill) return;
  gsap.to(fill, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
  });
}

/* ---------------- section labels get torn out left to right ---------------- */
function tearLabels() {
  $('[data-tear]:not([data-hero])').forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: 'inset(-20% 100% -20% 0)', y: 8 },
      {
        clipPath: 'inset(-20% 0% -20% 0)',
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      },
    );
  });
}

/* ---------------- headings and intro copy ease up ---------------- */
function riseIn() {
  $('[data-rise]').forEach((el) => {
    gsap.from(el, {
      autoAlpha: 0,
      y: 24,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
}

/* ---------------- purpose notes flutter in, then the tape presses down ---------------- */
function flutterNotes() {
  const notes = $('[data-note]');
  if (!notes.length) return;
  const tl = gsap.timeline({ scrollTrigger: { trigger: notes[0], start: 'top 85%', once: true } });
  notes.forEach((note, i) => {
    const tape = note.querySelector('[data-tape]');
    tl.from(note, { autoAlpha: 0, y: 60, rotation: i % 2 ? 8 : -8, duration: 0.7, ease: 'back.out(1.4)' }, i * 0.15);
    if (tape) tl.from(tape, { scaleX: 0, duration: 0.3, ease: 'power2.out' }, i * 0.15 + 0.5);
  });
}

/* ---------------- polaroids "develop" from washed-out to full colour ---------------- */
function developPhotos() {
  $('.gallery [data-develop], .team [data-develop]').forEach((el) => {
    gsap.fromTo(
      el,
      { filter: 'sepia(0.6) saturate(0.2) brightness(1.35) contrast(0.8)' },
      {
        filter: 'sepia(0) saturate(1) brightness(1) contrast(1)',
        duration: 1.6,
        ease: 'power1.inOut',
        clearProps: 'filter',
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      },
    );
  });
}

/* ---------------- gallery items drift at slightly different speeds ---------------- */
function parallaxGallery() {
  if (window.matchMedia('(max-width: 720px)').matches) return;
  $('[data-parallax]').forEach((el) => {
    const speed = Number(el.dataset.parallax) || 1;
    gsap.fromTo(
      el,
      { y: 18 * speed },
      {
        y: -18 * speed,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
    const polaroid = el.querySelector('.polaroid');
    if (polaroid) {
      // straighten slightly as it passes the middle of the screen
      gsap.to(polaroid, {
        rotation: 0,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'center 45%', scrub: true },
      });
    }
  });
}

/* ---------------- steps get ticked off ---------------- */
function checkSteps() {
  $('[data-step]').forEach((step) => {
    const path = step.querySelector<SVGPathElement>('[data-check]');
    const svg = path?.ownerSVGElement;
    if (!path || !svg) return;
    const len = path.getTotalLength();
    const tl = gsap.timeline({ scrollTrigger: { trigger: step, start: 'top 70%', once: true } });
    tl.from(step, { autoAlpha: 0, x: -24, duration: 0.45, ease: 'power2.out' })
      .set(svg, { opacity: 1 })
      .fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.inOut' }, '+=0.15');
  });
}

/* ---------------- the class code gets stamped on ---------------- */
function stampCode() {
  const code = document.querySelector('[data-stamp]');
  const ink = document.querySelector('[data-ink]');
  const card = document.querySelector('[data-codecard]');
  if (!code || !card) return;
  const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 75%', once: true } });
  tl.from(card, { autoAlpha: 0, y: 40, rotation: 6, duration: 0.6, ease: 'back.out(1.3)' })
    .from(code, { scale: 1.8, autoAlpha: 0, rotation: -8, duration: 0.25, ease: 'power4.in' }, '+=0.1')
    .to(card, { x: 3, duration: 0.05, yoyo: true, repeat: 3, ease: 'none' })
    .set(card, { x: 0 });
  if (ink) tl.fromTo(ink, { autoAlpha: 0.9, scale: 0.7 }, { autoAlpha: 0, scale: 1.25, duration: 0.8, ease: 'power2.out' }, '<');
}

/* ---------------- the ticket slides out and gets punched ---------------- */
function ticketSlide() {
  const ticket = document.querySelector('[data-ticket]');
  const punch = document.querySelector('[data-punch]');
  if (!ticket) return;
  const tl = gsap.timeline({ scrollTrigger: { trigger: ticket, start: 'top 92%', once: true } });
  tl.from(ticket, { x: -120, autoAlpha: 0, rotation: 6, duration: 0.7, ease: 'power3.out' }, 0.5);
  if (punch) tl.from(punch, { scale: 0, duration: 0.2, ease: 'back.out(3)' }, '+=0.15');
}

/* ---------------- team cards get dealt onto the page ---------------- */
function dealCards() {
  const cards = $('[data-card]');
  if (!cards.length) return;
  gsap.set(cards, { autoAlpha: 0, y: 70, rotation: (i) => (i % 2 ? 10 : -10) });
  ScrollTrigger.batch(cards, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        rotation: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'back.out(1.5)',
        onComplete() {
          batch.forEach((el) => {
            const tape = (el as HTMLElement).querySelector('[data-tape]');
            if (tape) gsap.fromTo(tape, { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.out' });
          });
        },
      }),
  });
}

/* ---------------- a stitched thread sews down the page ---------------- */
function stitchThread() {
  const svg = document.querySelector<SVGSVGElement>('[data-stitch]');
  const line = svg?.querySelector<SVGPathElement>('[data-stitch-line]');
  const mask = svg?.querySelector<SVGPathElement>('[data-stitch-mask]');
  if (!svg || !line || !mask) return;

  let tween: gsap.core.Tween | undefined;

  const build = () => {
    const h = document.documentElement.scrollHeight;
    const w = 90;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.style.height = `${h}px`;

    // a lazy hand-sewn wiggle from the nav down to the footer
    const start = 110;
    const end = h - 60;
    const step = 140;
    let d = `M ${w / 2} ${start}`;
    for (let y = start, i = 0; y < end; y += step, i++) {
      const x = w / 2 + (i % 2 ? 18 : -18) + Math.sin(i * 1.3) * 6;
      d += ` Q ${x} ${y + step / 2} ${w / 2} ${Math.min(y + step, end)}`;
    }
    line.setAttribute('d', d);
    mask.setAttribute('d', d);

    const len = mask.getTotalLength();
    tween?.scrollTrigger?.kill();
    tween?.kill();
    tween = gsap.fromTo(
      mask,
      { strokeDasharray: len, strokeDashoffset: len },
      {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
      },
    );
  };

  build();
  ScrollTrigger.addEventListener('refreshInit', build);
  return () => {
    ScrollTrigger.removeEventListener('refreshInit', build);
    tween?.scrollTrigger?.kill();
    tween?.kill();
  };
}

// Fonts and images change the page height after load; re-measure once they're in.
window.addEventListener('load', () => ScrollTrigger.refresh());
document.fonts?.ready.then(() => ScrollTrigger.refresh());
