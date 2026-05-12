const https = require('https');
const http = require('http');

module.exports = function handler(req, res) {
  const path = req.url;
  const qsIndex = path.indexOf('?');
  const qs = qsIndex >= 0 ? path.substring(qsIndex) : '';
  const apiPath = qsIndex >= 0 ? path.substring(0, qsIndex) : path;

  const options = {
    hostname: 'viakidss-production.up.railway.app',
    port: 443,
    path: '/api' + apiPath + qs,
    method: req.method,
    headers: {},
  };

  for (const [key, value] of Object.entries(req.headers)) {
    const k = key.toLowerCase();
    if (k !== 'origin' && k !== 'host' && k !== 'cookie' && k !== 'referer') {
      options.headers[key] = value;
    }
  }
  options.headers['x-forwarded-host'] = req.headers.host || '';

  const proxyReq = https.request(options, (proxyRes) => {
    res.statusCode = proxyRes.statusCode;
    for (const [key, value] of Object.entries(proxyRes.headers)) {
      const k = key.toLowerCase();
      if (k !== 'content-encoding' && k !== 'transfer-encoding' && k !== 'content-length') {
        res.setHeader(key, value);
      }
    }
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Proxy error', message: err.message }));
  });

  req.pipe(proxyReq);
};
