import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// مسیرهای صفحات
const pages = [
  { path: '/', file: 'index.html' },
  { path: '/games', file: 'games.html' },
  { path: '/about', file: 'about.html' },
  { path: '/contact', file: 'contact.html' },
  { path: '/download', file: 'download.html' },
  { path: '/my-games', file: 'my-games.html' },
  { path: '/terms', file: 'terms.html' },
  { path: '/signup', file: 'signup.html' }
];

// کپی کردن index.html برای هر صفحه
function buildStaticPages() {
  const distPath = path.join(__dirname, '../dist');
  const indexPath = path.join(distPath, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.error('index.html not found in dist folder!');
    return;
  }
  
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  pages.forEach(page => {
    if (page.path === '/') return; // index.html already exists
    
    const filePath = path.join(distPath, page.file);
    fs.writeFileSync(filePath, indexContent);
    console.log(`✅ Created: ${page.file}`);
  });
  
  console.log('🎉 All static pages created successfully!');
}

buildStaticPages(); 