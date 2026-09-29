const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const sourceLogo = path.resolve("public/logo-badge.png");
if (!fs.existsSync(sourceLogo)) {
  console.error("Source logo public/logo-badge.png does not exist!");
  process.exit(1);
}

const tmpDir = path.resolve(".next/cache/icon_tmp");
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

console.log("Using source logo:", sourceLogo);

// 1. Generate resized PNGs
const sizes = [16, 32, 48, 64, 180, 192, 256];
for (const size of sizes) {
  const target = path.join(tmpDir, `icon_${size}.png`);
  execSync(`sips -z ${size} ${size} "${sourceLogo}" --out "${target}"`);
}

// 2. Build multi-resolution ICO (16, 32, 48, 64)
function buildIco(pngFiles) {
  const images = pngFiles.map(file => {
    const data = fs.readFileSync(file);
    const width = data.readUInt32BE(16);
    const height = data.readUInt32BE(20);
    return { width, height, data };
  });

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(images.length, 4); // Number of images

  let offset = 6 + images.length * 16;
  const entries = [];

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // Color palette (0 = true color)
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(img.data.length, 8); // Size of image data
    entry.writeUInt32LE(offset, 12); // Offset of image data
    entries.push(entry);
    offset += img.data.length;
  }

  return Buffer.concat([header, ...entries, ...images.map(img => img.data)]);
}

const icoBuffer = buildIco([
  path.join(tmpDir, "icon_16.png"),
  path.join(tmpDir, "icon_32.png"),
  path.join(tmpDir, "icon_48.png"),
  path.join(tmpDir, "icon_64.png")
]);

// Write favicon.ico to src/app and public
fs.writeFileSync("src/app/favicon.ico", icoBuffer);
fs.writeFileSync("public/favicon.ico", icoBuffer);
console.log("Written src/app/favicon.ico & public/favicon.ico:", icoBuffer.length, "bytes");

// Write app icons
fs.copyFileSync(path.join(tmpDir, "icon_32.png"), "src/app/icon.png");
fs.copyFileSync(path.join(tmpDir, "icon_32.png"), "public/icon.png");
fs.copyFileSync(path.join(tmpDir, "icon_32.png"), "public/favicon-32x32.png");
fs.copyFileSync(path.join(tmpDir, "icon_16.png"), "public/favicon-16x16.png");

fs.copyFileSync(path.join(tmpDir, "icon_180.png"), "src/app/apple-icon.png");
fs.copyFileSync(path.join(tmpDir, "icon_180.png"), "public/apple-icon.png");
fs.copyFileSync(path.join(tmpDir, "icon_180.png"), "public/apple-touch-icon.png");

console.log("All FoodWise favicon and apple-touch icons generated successfully!");
