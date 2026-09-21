import type { ImageMetadata } from 'astro';

// Every image dropped into src/assets/gallery/ or src/assets/team/ is picked up here.
// In src/data/club.json, set "image" to the file name (e.g. "spring-zine.jpg").
const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/{gallery,team}/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

export function findPhoto(name: string | undefined): ImageMetadata | undefined {
  if (!name) return undefined;
  const hit = Object.entries(files).find(([path]) => path.endsWith(`/${name}`));
  return hit?.[1].default;
}
