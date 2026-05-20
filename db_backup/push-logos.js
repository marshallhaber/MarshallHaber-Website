const http = require('http');
const fs = require('fs');

const logos = JSON.parse(fs.readFileSync(__dirname + '/logos.json')).clients;
const KEY = '234583419264838';

// Fetch current clients page, merge in updated logos, push back
const getOptions = { hostname: 'localhost', port: 5000, path: '/api/admin/pages/clients', method: 'GET' };

http.get(getOptions, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const page = JSON.parse(body);
    const sections = page.sections || {};

    // Replace the list with data from logos.json
    sections.list = logos;

    const payload = JSON.stringify({ sections });
    const putOptions = {
      hostname: 'localhost', port: 5000,
      path: '/api/admin/pages/clients',
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': KEY, 'Content-Length': Buffer.byteLength(payload) }
    };

    const req = http.request(putOptions, res2 => {
      let r = '';
      res2.on('data', d => r += d);
      res2.on('end', () => {
        const result = JSON.parse(r);
        console.log(result.page ? `Done — pushed ${logos.length} clients to DB` : 'Error: ' + r);
      });
    });
    req.write(payload);
    req.end();
  });
});
