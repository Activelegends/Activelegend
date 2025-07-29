export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // اگر فایل استاتیک نیست، به index.html redirect کن
  if (!url.pathname.includes('.') || url.pathname.endsWith('/')) {
    return context.rewrite('/index.html');
  }
  
  return context.next();
} 