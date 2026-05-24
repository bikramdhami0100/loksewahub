import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(__dirname, '..', 'public', 'icons');

if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

function svgIcon(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e40af"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#bg)"/>
  <text x="50%" y="45%" dominant-baseline="central" text-anchor="middle" fill="white" font-size="${size * 0.35}" font-family="sans-serif" font-weight="bold">LH</text>
  <text x="50%" y="65%" dominant-baseline="central" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="${size * 0.08}" font-family="sans-serif">LoksewaHub</text>
</svg>`;
}

async function gen(size) {
  await sharp(Buffer.from(svgIcon(size))).png().toFile(path.join(iconsDir, `icon-${size}x${size}.png`));
  console.log(`Created icon-${size}x${size}.png`);
}

await gen(192);
await gen(512);
console.log('Done');
