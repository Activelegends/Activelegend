import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// کپی کردن _redirects به dist
function copyRedirects() {
  const distPath = path.join(__dirname, '../dist');
  const redirectsSource = path.join(__dirname, '../public/_redirects');
  const redirectsDest = path.join(distPath, '_redirects');
  
  console.log('🔍 Copying _redirects...');
  
  if (fs.existsSync(redirectsSource)) {
    fs.copyFileSync(redirectsSource, redirectsDest);
    console.log('✅ Copied: _redirects');
  } else {
    console.error('❌ _redirects not found in public folder!');
    process.exit(1);
  }
  
  // Validate _redirects content
  const redirectsContent = fs.readFileSync(redirectsDest, 'utf8');
  if (!redirectsContent.includes('/*') || !redirectsContent.includes('/index.html')) {
    console.error('❌ Invalid _redirects content!');
    process.exit(1);
  }
  
  console.log('✅ _redirects content is valid');
  console.log('🎉 Build completed successfully!');
}

copyRedirects(); 