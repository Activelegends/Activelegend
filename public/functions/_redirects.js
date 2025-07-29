export async function onRequest(context) {
  const url = new URL(context.request.url);
  const pathname = url.pathname;
  
  // Static page redirects
  const redirects = {
    '/games': '/games.html',
    '/about': '/about.html',
    '/contact': '/contact.html',
    '/download': '/download.html',
    '/my-games': '/my-games.html',
    '/terms': '/terms.html',
    '/signup': '/signup.html'
  };
  
  // Check if we need to redirect
  if (redirects[pathname]) {
    return Response.redirect(url.origin + redirects[pathname], 200);
  }
  
  // For static files, serve them directly
  if (pathname.includes('.') && !pathname.endsWith('/')) {
    return context.next();
  }
  
  // For all other routes, serve index.html
  return context.rewrite('/index.html');
} 