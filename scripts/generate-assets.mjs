import sharp from "sharp";
import { mkdirSync } from "fs";

const NAVY = "#1A2B4A";
const NAVY2 = "#2C4A7A";
const GOLD = "#D4AF37";
const WHITE = "#FFFFFF";

mkdirSync("resources", { recursive: true });

// A simple house glyph as an SVG path group, drawn in a 200x200 local
// coordinate space, used at different scales below.
const housePath = (color) => `
  <g fill="${color}">
    <path d="M100 20 L176 82 L164 82 L164 176 L116 176 L116 122 L84 122 L84 176 L36 176 L36 82 L24 82 Z" />
  </g>
`;

const iconSvg = (size, { withBadge } = { withBadge: true }) => `
<svg width="${size}" height="${size}" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="${NAVY}"/>
  ${
    withBadge
      ? `<rect x="212" y="212" width="600" height="600" rx="132" fill="${GOLD}"/>`
      : ""
  }
  <g transform="translate(212,212) scale(3)">
    ${housePath(withBadge ? NAVY : GOLD)}
  </g>
</svg>`;

const foregroundSvg = () => `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(312,312) scale(2)">
    ${housePath(GOLD)}
  </g>
</svg>`;

const backgroundSvg = () => `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="${NAVY}"/>
</svg>`;

const splashSvg = () => `
<svg width="2732" height="2732" viewBox="0 0 2732 2732" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="60%" y2="100%">
      <stop offset="0%" stop-color="${NAVY}"/>
      <stop offset="100%" stop-color="${NAVY2}"/>
    </linearGradient>
  </defs>
  <rect width="2732" height="2732" fill="url(#bg)"/>
  <rect x="1116" y="1116" width="500" height="500" rx="110" fill="${GOLD}"/>
  <g transform="translate(1116,1116) scale(2.5)">
    ${housePath(NAVY)}
  </g>
  <text x="1366" y="1780" text-anchor="middle" font-family="Arial, sans-serif" font-size="120" font-weight="900" fill="${GOLD}">CasaFeliz</text>
</svg>`;

const jobs = [
  ["resources/icon.png", iconSvg(1024), 1024],
  ["resources/icon-foreground.png", foregroundSvg(), 1024],
  ["resources/icon-background.png", backgroundSvg(), 1024],
  ["resources/splash.png", splashSvg(), 2732],
  ["resources/splash-dark.png", splashSvg(), 2732],
];

for (const [path, svg, size] of jobs) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(path);
  console.log("wrote", path);
}
