import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const TILE_SIZE = 64;
const SPRITE_CACHE_FILE = path.join('src', 'assets', 'sprites', '.sprite-cache');
const CONFIGS = [
  {
    inputDir: path.join('src', 'assets', 'sprites', 'terrain'),
    outputPng: path.join('dist', 'terrain.png'),
    outputJson: path.join('public', 'terrain.json'),
  },
  {
    inputDir: path.join('src', 'assets', 'sprites', 'units'),
    outputPng: path.join('dist', 'units.png'),
    outputJson: path.join('public', 'units.json'),
  },
];

async function run() {
  const allFiles = [];
  for (const config of CONFIGS) {
    if (fs.existsSync(config.inputDir)) {
      const files = fs.readdirSync(config.inputDir)
        .filter(f => f.endsWith('.svg'))
        .map(f => path.join(config.inputDir, f));
      allFiles.push(...files);
    }
  }

  // Sort by full path for determinism
  allFiles.sort();

  const hash = crypto.createHash('sha256');
  for (const file of allFiles) {
    // Include relative path in hash so renames/moves trigger rebuild
    hash.update(path.relative('src/assets/sprites', file));
    hash.update(fs.readFileSync(file));
  }
  const currentHash = hash.digest('hex');

  if (fs.existsSync(SPRITE_CACHE_FILE)) {
    const cachedHash = fs.readFileSync(SPRITE_CACHE_FILE, 'utf8').trim();
    if (cachedHash === currentHash) {
      console.log('Sprites unchanged, skipping build.');
      process.exit(0);
    }
  }

  console.log('Building sprites...');
  for (const config of CONFIGS) {
    await buildSpritesheet(config);
  }

  // Ensure sprite cache directory exists (though it should)
  fs.mkdirSync(path.dirname(SPRITE_CACHE_FILE), { recursive: true });
  fs.writeFileSync(SPRITE_CACHE_FILE, currentHash);
  console.log('Sprites built successfully.');
}

async function buildSpritesheet(config) {
  const { inputDir, outputPng, outputJson } = config;
  if (!fs.existsSync(inputDir)) {
    console.warn(`Input directory ${inputDir} does not exist, skipping.`);
    return;
  }

  const files = fs.readdirSync(inputDir)
    .filter(f => f.endsWith('.svg'))
    .sort();

  if (files.length === 0) {
    console.warn(`No SVG files found in ${inputDir}, skipping.`);
    return;
  }

  const count = files.length;
  // Calculate grid dimensions for a square-ish layout
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  const width = cols * TILE_SIZE;
  const height = rows * TILE_SIZE;

  const composites = [];
  const jsonMap = {};

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const name = path.parse(file).name;
    const x = (i % cols) * TILE_SIZE;
    const y = Math.floor(i / cols) * TILE_SIZE;

    const svgBuffer = fs.readFileSync(path.join(inputDir, file));

    // Use sharp to rasterize SVG to PNG buffer
    const pngBuffer = await sharp(svgBuffer)
      .resize(TILE_SIZE, TILE_SIZE)
      .png()
      .toBuffer();

    composites.push({
      input: pngBuffer,
      top: y,
      left: x,
    });

    jsonMap[name] = { x, y, w: TILE_SIZE, h: TILE_SIZE };
  }

  // Ensure output directories exist
  fs.mkdirSync(path.dirname(outputPng), { recursive: true });
  fs.mkdirSync(path.dirname(outputJson), { recursive: true });

  // Create base image and composite the tiles
  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .png()
    .toFile(outputPng);

  fs.writeFileSync(outputJson, JSON.stringify(jsonMap, null, 2));
  console.log(`Generated ${outputPng} and ${outputJson}`);
}

run().catch(err => {
  console.error('Error building sprites:', err);
  process.exit(1);
});
