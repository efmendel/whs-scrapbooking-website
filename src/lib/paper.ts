// Shape helpers for the "handmade paper" look.
// Everything is deterministic (seeded with sine waves) so the page renders
// identically on every build, with no layout shift between server and client.

/** Torn-paper clip-path for small labels. Jagged top and bottom edges, in % units. */
export function tornLabel(seed: number, points = 26, depth = 10): string {
  const pts: string[] = [];
  for (let i = 0; i <= points; i++) {
    const x = ((i / points) * 100).toFixed(2);
    const y = (Math.abs(Math.sin(i * 1.7 + seed)) * depth).toFixed(2);
    pts.push(`${x}% ${y}%`);
  }
  for (let i = points; i >= 0; i--) {
    const x = ((i / points) * 100).toFixed(2);
    const y = (100 - Math.abs(Math.sin(i * 2.3 + seed * 1.3)) * depth).toFixed(2);
    pts.push(`${x}% ${y}%`);
  }
  return `polygon(${pts.join(', ')})`;
}

/**
 * Torn-paper clip-path for full-width bands. Edge depth is in px so it
 * stays the same size no matter how tall the section gets.
 */
export function tornBand({ top = true, bottom = true, points = 60, depth = 16 } = {}): string {
  const pts: string[] = [];
  for (let i = 0; i <= points; i++) {
    const x = ((i / points) * 100).toFixed(2);
    const d = Math.abs(Math.sin(i * 1.9)) * depth + Math.abs(Math.sin(i * 0.37)) * (depth / 2);
    pts.push(`${x}% ${top ? d.toFixed(1) : 0}px`);
  }
  for (let i = points; i >= 0; i--) {
    const x = ((i / points) * 100).toFixed(2);
    const d = Math.abs(Math.sin(i * 2.7 + 1)) * depth + Math.abs(Math.sin(i * 0.41)) * (depth / 2);
    pts.push(`${x}% ${bottom ? `calc(100% - ${d.toFixed(1)}px)` : '100%'}`);
  }
  return `polygon(${pts.join(', ')})`;
}
