// This is a Node.js script to generate PWA icons
// Run with: node generate-icons.js

const fs = require('fs');
const { createCanvas } = require('canvas');

function generateIcon(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#2563eb');
  gradient.addColorStop(1, '#7c3aed');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Add text
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${size * 0.4}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('MM', size / 2, size / 2);

  // Add subtitle
  ctx.font = `${size * 0.1}px Arial`;
  ctx.fillText('MotoMINDORO', size / 2, size * 0.75);

  // Save to file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filename, buffer);
  console.log(`Generated ${filename}`);
}

// Generate icons
generateIcon(192, 'pwa-192x192.png');
generateIcon(512, 'pwa-512x512.png');

console.log('Icons generated successfully!');
