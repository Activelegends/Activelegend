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
  
  console.log('🔍 Checking build files...');
  
  if (!fs.existsSync(indexPath)) {
    console.error('❌ index.html not found in dist folder!');
    console.error('Please run "npm run build" first');
    process.exit(1);
  }
  
  console.log('✅ index.html found');
  
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Validate index.html content
  if (!indexContent.includes('<html') || !indexContent.includes('</html>')) {
    console.error('❌ Invalid index.html content!');
    process.exit(1);
  }
  
  console.log('✅ index.html content is valid');
  
  let createdCount = 0;
  pages.forEach(page => {
    if (page.path === '/') return; // index.html already exists
    
    const filePath = path.join(distPath, page.file);
    fs.writeFileSync(filePath, indexContent);
    console.log(`✅ Created: ${page.file}`);
    createdCount++;
  });
  
  // Copy vercel.json to dist
  const vercelSource = path.join(__dirname, '../vercel.json');
  const vercelDest = path.join(distPath, 'vercel.json');
  if (fs.existsSync(vercelSource)) {
    fs.copyFileSync(vercelSource, vercelDest);
    console.log('✅ Copied: vercel.json');
  }
  
  // Copy _redirects to dist
  const redirectsSource = path.join(__dirname, '../public/_redirects');
  const redirectsDest = path.join(distPath, '_redirects');
  if (fs.existsSync(redirectsSource)) {
    fs.copyFileSync(redirectsSource, redirectsDest);
    console.log('✅ Copied: _redirects');
  }
  
  console.log(`🎉 Successfully created ${createdCount} static pages!`);
  console.log('📁 Files in dist folder:');
  
  const files = fs.readdirSync(distPath);
  files.forEach(file => {
    if (file.endsWith('.html')) {
      console.log(`  📄 ${file}`);
    }
  });
}

buildStaticPages(); 