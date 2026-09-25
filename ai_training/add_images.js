/**
 * REBUILD DATASET MANAGER: ADD CUSTOM IMAGES
 * 
 * Usage:
 *   node add_images.js --class Concrete --file C:/path/to/my_concrete_photo.jpg
 *   node add_images.js --class Metal --folder C:/path/to/metal_scrap_photos/
 */

const fs = require('fs');
const path = require('path');

const CLASSES = [
  'Brick', 'Concrete', 'Metal', 'Wood', 'Drywall', 'Glass', 'Stone'
];

const DATASET_DIR = path.resolve(__dirname, 'dataset');
const TRAIN_DIR = path.join(DATASET_DIR, 'train');
const VAL_DIR = path.join(DATASET_DIR, 'val');

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      parsed[args[i].substring(2)] = args[i + 1];
      i++;
    }
  }
  return parsed;
}

function addImage(className, sourcePath, split = 'train') {
  if (!fs.existsSync(sourcePath)) {
    console.error(`[Error] File not found: ${sourcePath}`);
    return;
  }

  const targetDir = split === 'train' ? path.join(TRAIN_DIR, className) : path.join(VAL_DIR, className);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const ext = path.extname(sourcePath).toLowerCase();
  const destName = `${className.toLowerCase()}_user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}${ext}`;
  const destPath = path.join(targetDir, destName);

  fs.copyFileSync(sourcePath, destPath);
  console.log(`[Added] Successfully added ${sourcePath} -> ${destPath}`);
}

function showStats() {
  console.log('================================================================');
  console.log('REBUILD DATASET INVENTORY (7 CDW CLASSES)');
  console.log('================================================================');
  let totalTrain = 0;
  let totalVal = 0;
  for (const c of CLASSES) {
    const trainP = path.join(TRAIN_DIR, c);
    const valP = path.join(VAL_DIR, c);
    const trainCnt = fs.existsSync(trainP) ? fs.readdirSync(trainP).length : 0;
    const valCnt = fs.existsSync(valP) ? fs.readdirSync(valP).length : 0;
    totalTrain += trainCnt;
    totalVal += valCnt;
    console.log(`  ${c.padEnd(10)} : ${String(trainCnt).padStart(3)} train | ${String(valCnt).padStart(2)} val`);
  }
  console.log('----------------------------------------------------------------');
  console.log(`  TOTAL      : ${String(totalTrain).padStart(3)} train | ${String(totalVal).padStart(2)} val (Sum: ${totalTrain + totalVal} images)`);
  console.log('================================================================\n');
}

function main() {
  const args = parseArgs();

  if (args.stats || process.argv.includes('--stats') || Object.keys(args).length === 0) {
    showStats();
    console.log('Add images using:');
    console.log('  node add_images.js --class <ClassName> --file <path/to/image.jpg>');
    console.log('  node add_images.js --class <ClassName> --folder <path/to/folder/>');
    console.log('Available Classes: ' + CLASSES.join(', '));
    return;
  }

  const cls = args.class;
  if (!cls || !CLASSES.map(c => c.toLowerCase()).includes(cls.toLowerCase())) {
    console.log('Error: Invalid or missing class name.');
    console.log('Available Classes: ' + CLASSES.join(', '));
    return;
  }

  const matchedClass = CLASSES.find(c => c.toLowerCase() === cls.toLowerCase());
  const chosenSplit = args.split || null;

  if (args.file) {
    addImage(matchedClass, args.file, chosenSplit || 'train');
  } else if (args.folder) {
    if (!fs.existsSync(args.folder)) {
      console.error(`Folder not found: ${args.folder}`);
      return;
    }
    const files = fs.readdirSync(args.folder);
    let count = 0;
    for (const f of files) {
      const p = path.join(args.folder, f);
      if (['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.jfif', '.tiff'].includes(path.extname(f).toLowerCase())) {
        const split = chosenSplit ? chosenSplit : (count % 5 === 0 ? 'val' : 'train');
        addImage(matchedClass, p, split);
        count++;
      }
    }
    console.log(`Successfully ingested ${count} images into ${matchedClass}!`);
  } else {
    console.log('Specify either --file or --folder.');
  }
}

main();
