const fs = require('fs');
const path = require('path');

const FRAMES_DIR = path.join(__dirname, 'frontend', 'public', 'frames');
if (!fs.existsSync(FRAMES_DIR)) fs.mkdirSync(FRAMES_DIR, { recursive: true });

const frames = [
  {
    name: 'neon_pink',
    svg: `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="neon" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="5" y="5" width="190" height="190" fill="none" stroke="#ff00ff" stroke-width="6" filter="url(#neon)" rx="20" />
      <rect x="5" y="5" width="190" height="190" fill="none" stroke="#ffffff" stroke-width="2" rx="20" />
    </svg>`
  },
  {
    name: 'cyber_tech',
    svg: `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="190" height="190" fill="none" stroke="#00ffff" stroke-width="8" />
      <rect x="0" y="20" width="15" height="40" fill="#00ffff" />
      <rect x="185" y="140" width="15" height="40" fill="#00ffff" />
      <rect x="20" y="0" width="60" height="15" fill="#00ffff" />
      <rect x="120" y="185" width="60" height="15" fill="#00ffff" />
    </svg>`
  },
  {
    name: 'gold_vintage',
    svg: `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="180" height="180" fill="none" stroke="#ffd700" stroke-width="12" />
      <rect x="15" y="15" width="170" height="170" fill="none" stroke="#aa7700" stroke-width="2" />
      <rect x="5" y="5" width="190" height="190" fill="none" stroke="#aa7700" stroke-width="2" />
      <circle cx="20" cy="20" r="15" fill="#ffd700" />
      <circle cx="180" cy="20" r="15" fill="#ffd700" />
      <circle cx="20" cy="180" r="15" fill="#ffd700" />
      <circle cx="180" cy="180" r="15" fill="#ffd700" />
    </svg>`
  },
  {
    name: 'hearts',
    svg: `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="180" height="180" fill="none" stroke="#ffb6c1" stroke-width="20" rx="15" />
      <!-- Top hearts -->
      <path d="M 40,20 A 10,10 0 0,0 20,20 A 10,10 0 0,0 40,20 Z" fill="#ff1493" transform="translate(10, -10)" />
      <path d="M 80,20 A 10,10 0 0,0 60,20 A 10,10 0 0,0 80,20 Z" fill="#ff1493" transform="translate(20, -10)" />
      <path d="M 120,20 A 10,10 0 0,0 100,20 A 10,10 0 0,0 120,20 Z" fill="#ff1493" transform="translate(30, -10)" />
    </svg>`
  },
  {
    name: 'checkered',
    svg: `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="checker" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#ff0000" />
          <rect x="10" width="10" height="10" fill="#000000" />
          <rect y="10" width="10" height="10" fill="#000000" />
          <rect x="10" y="10" width="10" height="10" fill="#ff0000" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="200" height="200" fill="none" stroke="url(#checker)" stroke-width="24" rx="10" />
    </svg>`
  },
  {
    name: 'forest',
    svg: `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="180" height="180" fill="none" stroke="#2e8b57" stroke-width="16" rx="20" />
      <path d="M 10,10 Q 50,40 10,70 Q -30,40 10,10 Z" fill="#3cb371" transform="translate(0, 0)" />
      <path d="M 10,10 Q 50,40 10,70 Q -30,40 10,10 Z" fill="#3cb371" transform="translate(180, 0)" />
      <path d="M 10,10 Q 50,40 10,70 Q -30,40 10,10 Z" fill="#3cb371" transform="translate(0, 130)" />
      <path d="M 10,10 Q 50,40 10,70 Q -30,40 10,10 Z" fill="#3cb371" transform="translate(180, 130)" />
    </svg>`
  }
];

const framesData = [];
frames.forEach((f, i) => {
  fs.writeFileSync(path.join(FRAMES_DIR, `${f.name}.svg`), f.svg);
  framesData.push({
    id: i + 10,
    name: f.name.replace('_', ' ').toUpperCase(),
    img: `/frames/${f.name}.svg`,
    type: 'frame',
    price: 1500
  });
});

console.log("\n--- COPY THIS TO SettingsPage.jsx Frames ---");
console.log(JSON.stringify(framesData, null, 2));
