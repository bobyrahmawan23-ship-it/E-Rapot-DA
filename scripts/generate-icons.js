import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 8-pointed star points generator (Rub el Hizb / two interlocking squares rotated 45 deg)
// We'll draw two concentric 8-pointed stars and the Islamic iconography
const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="soft-shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.15" />
    </filter>
  </defs>

  <!-- Clean crisp white background for icon clarity -->
  <rect width="512" height="512" rx="48" fill="#ffffff" />

  <g transform="translate(256, 256)">
    <!-- Outer Green Octagram Star -->
    <!-- Square 1 -->
    <rect x="-172" y="-172" width="344" height="344" rx="12" fill="none" stroke="#0e8847" stroke-width="12" stroke-linejoin="round" />
    <!-- Square 2 rotated 45 deg -->
    <rect x="-172" y="-172" width="344" height="344" rx="12" fill="none" stroke="#0e8847" stroke-width="12" stroke-linejoin="round" transform="rotate(45)" />

    <!-- Inner Blue Octagram Star -->
    <rect x="-144" y="-144" width="288" height="288" rx="8" fill="none" stroke="#1d3478" stroke-width="10" stroke-linejoin="round" />
    <rect x="-144" y="-144" width="288" height="288" rx="8" fill="none" stroke="#1d3478" stroke-width="10" stroke-linejoin="round" transform="rotate(45)" />

    <!-- Crescent and Star at Top -->
    <g transform="translate(0, -165)">
      <!-- Crescent -->
      <path d="M -34, -4 C -34, 22, 34, 22, 34, -4 C 20, 16, -20, 16, -34, -4 Z" fill="#0e8847" />
      <!-- Star -->
      <polygon points="0,-24 4,-12 16,-12 6,-4 10,8 0,1 -10,8 -6,-4 -16,-12 -4,-12" fill="#0e8847" />
    </g>

    <!-- Open Holy Quran on Rehal (Center) -->
    <g transform="translate(0, -32) scale(1.08)">
      <!-- Rehal (Book Stand) -->
      <path d="M -70, 75 L 0, 32 L 70, 75 L 55, 30 L 0, -2 L -55, 30 Z" fill="#222222" />
      <path d="M -55, 78 L 0, 42 L 55, 78 L 38, 48 L 0, 20 L -38, 48 Z" fill="#ffffff" stroke="#222222" stroke-width="3" />

      <!-- Left Quran Page (Open curved Mushaf) -->
      <path d="M -3, 3 C -30, -5, -65, -8, -88, 14 C -84, -28, -50, -56, -2, -44 Z" fill="#ffffff" stroke="#1f1f1f" stroke-width="5" stroke-linejoin="round" />
      <!-- Left Page Inner Lines (Text Lines) -->
      <line x1="-72" y1="-8" x2="-14" y2="-12" stroke="#222222" stroke-width="3" stroke-linecap="round" />
      <line x1="-74" y1="-18" x2="-16" y2="-22" stroke="#222222" stroke-width="3" stroke-linecap="round" />
      <line x1="-70" y1="-28" x2="-18" y2="-32" stroke="#222222" stroke-width="3" stroke-linecap="round" />
      <line x1="-62" y1="2" x2="-14" y2="-2" stroke="#222222" stroke-width="3" stroke-linecap="round" />
      <line x1="-54" y1="12" x2="-14" y2="8" stroke="#222222" stroke-width="3" stroke-linecap="round" />

      <!-- Right Quran Page -->
      <path d="M 3, 3 C 30, -5, 65, -8, 88, 14 C 84, -28, 50, -56, 2, -44 Z" fill="#ffffff" stroke="#1f1f1f" stroke-width="5" stroke-linejoin="round" />
      <!-- Right Page Inner Lines (Text Lines) -->
      <line x1="14" y1="-12" x2="72" y2="-8" stroke="#222222" stroke-width="3" stroke-linecap="round" />
      <line x1="16" y1="-22" x2="74" y2="-18" stroke="#222222" stroke-width="3" stroke-linecap="round" />
      <line x1="18" y1="-32" x2="70" y2="-28" stroke="#222222" stroke-width="3" stroke-linecap="round" />
      <line x1="14" y1="-2" x2="62" y2="2" stroke="#222222" stroke-width="3" stroke-linecap="round" />
      <line x1="14" y1="8" x2="54" y2="12" stroke="#222222" stroke-width="3" stroke-linecap="round" />

      <!-- Quran Center spine crease -->
      <path d="M 0, -45 C -2, -20, -2, 10, 0, 32" stroke="#1f1f1f" stroke-width="5" stroke-linecap="round" />
    </g>

    <!-- Typography: TAHFIDZ QUR'AN DARUL ABIDIN -->
    <text x="0" y="78" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="25" fill="#1b2a4a" letter-spacing="1.5">TAHFIDZ QUR'AN</text>
    <text x="0" y="106" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="23" fill="#1b2a4a" letter-spacing="1.5">DARUL ABIDIN</text>
  </g>
</svg>
`.trim();

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);
fs.writeFileSync(path.join(publicDir, 'logo.svg'), svgContent);

// Maskable icon with 15% safe padding
const maskableSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#0f5132" />
  <circle cx="256" cy="256" r="220" fill="#ffffff" />
  <g transform="translate(64, 64) scale(0.75)">
    ${svgContent.replace(/<svg[^>]*>/, '').replace('</svg>', '')}
  </g>
</svg>
`.trim();

async function buildPngs() {
  const svgBuffer = Buffer.from(svgContent);

  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'pwa-192x192.png'));
  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-512x512.png'));
  await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(svgBuffer).resize(32, 32).png().toFile(path.join(publicDir, 'favicon.ico'));

  const maskableBuffer = Buffer.from(maskableSvg);
  await sharp(maskableBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  console.log('PWA icons successfully generated in public/ folder!');
}

buildPngs().catch(console.error);
