const fs = require('fs');
const path = require('path');
const https = require('https');

const WALLPAPERS_DIR = path.join(__dirname, 'frontend', 'public', 'wallpapers');
if (!fs.existsSync(WALLPAPERS_DIR)) fs.mkdirSync(WALLPAPERS_DIR, { recursive: true });

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      // Handle redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
        return;
      }
      const file = fs.createWriteStream(filepath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log("Fetching Wallpapers from Wallhaven API...");
  // anime category, toplist sorting, 16x9, purity safe
  const res = await fetch('https://wallhaven.cc/api/v1/search?q=anime&categories=010&purity=100&sorting=toplist&ratios=16x9&per_page=15');
  
  if (!res.ok) {
    console.error("Failed to fetch API", await res.text());
    process.exit(1);
  }
  
  const data = await res.json();
  const wallpapers_data = [];
  
  for (let i = 0; i < data.data.length; i++) {
    const item = data.data[i];
    const img_url = item.path;
    const name = `Wallhaven ${item.id}`;
    
    const filename = `wall_${item.id}.jpg`;
    const filepath = path.join(WALLPAPERS_DIR, filename);
    
    console.log(`Downloading ${name}...`);
    try {
      await downloadImage(img_url, filepath);
      wallpapers_data.push({
        id: i + 20,
        name: `Wallpaper ${i + 1}`,
        img: `/wallpapers/${filename}`,
        type: 'wallpaper'
      });
      await new Promise(r => setTimeout(r, 800)); // sleep to avoid rate limits
    } catch (e) {
      console.log(`Failed ${name}: ${e.message}`);
    }
  }
  
  console.log("\n--- COPY THIS TO SettingsPage.jsx Wallpapers ---");
  console.log(JSON.stringify(wallpapers_data, null, 2));
}

main();
