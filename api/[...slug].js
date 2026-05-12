const RAILWAY_API = 'https://viakidss-production.up.railway.app/api';

module.exports = async function handler(req, res) {
  const slug = req.query.slug || [];
  const path = slug.join('/');
  const qs = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
  const url = `${RAILWAY_API}/${path}${qs}`;

  const headers = {};
  for (const [key, value] of Object.entries(req.headers)) {
    const k = key.toLowerCase();
    if (k !== 'origin' && k !== 'host' && k !== 'cookie') {
      headers[key] = value;
    }
  }

  const fetch = (await import('node-fetch')).default;
  let body;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  }

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body,
    });

    const data = await response.text();
    res.status(response.status);
    for (const [key, value] of response.headers.entries()) {
      if (key.toLowerCase() !== 'content-encoding' && key.toLowerCase() !== 'transfer-encoding') {
        res.setHeader(key, value);
      }
    }
    res.send(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy error', message: error.message });
  }
};
