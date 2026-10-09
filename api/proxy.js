import https from 'https';

export default function handler(req, res) {
  const bodyChunks = [];
  req.on('data', (chunk) => bodyChunks.push(chunk));
  req.on('end', () => {
    const body = Buffer.concat(bodyChunks);

    const options = {
      hostname: 'viakidss-production.up.railway.app',
      port: 443,
      path: req.url,
      method: req.method,
      headers: {},
    };

    for (const [key, value] of Object.entries(req.headers)) {
      const k = key.toLowerCase();
      if (k !== 'origin' && k !== 'host' && k !== 'cookie' && k !== 'referer') {
        options.headers[key] = value;
      }
    }
    if (body.length > 0) {
      options.headers['content-length'] = body.length;
    }
    options.headers['x-forwarded-host'] = req.headers.host || '';

    const proxyReq = https.request(options, (proxyRes) => {
      let data = '';
      proxyRes.on('data', (chunk) => { data += chunk; });
      proxyRes.on('end', () => {
        res.statusCode = proxyRes.statusCode;
        const ct = proxyRes.headers['content-type'] || 'application/json';
        res.setHeader('Content-Type', ct);
        res.end(data);
      });
    });

    proxyReq.on('error', (err) => {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Proxy error', message: err.message }));
    });

    proxyReq.end(body);
  });
}
