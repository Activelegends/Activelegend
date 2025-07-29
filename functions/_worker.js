export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // Serve static files directly
    if (pathname.includes('.') && !pathname.endsWith('/')) {
      return env.ASSETS.fetch(request);
    }
    
    // For all routes, serve index.html
    const indexRequest = new Request(new URL('/index.html', url), request);
    return env.ASSETS.fetch(indexRequest);
  }
}; 