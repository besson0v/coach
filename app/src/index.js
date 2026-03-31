import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const port = process.env.PORT || 8787;
const dataFile = path.resolve(process.cwd(), 'data', 'state.json');

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  } catch {
    return {
      status: 'bootstrapped',
      app: 'Coach',
      version: 1,
      entities: {
        workouts: [],
        symptoms: [],
        labs: [],
        visits: [],
        documents: [],
        protocols: []
      }
    };
  }
}

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: true, app: 'Coach', port }));
    return;
  }

  if (req.url === '/state') {
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(loadState(), null, 2));
    return;
  }

  res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
  res.end('Coach backend bootstrap is alive');
});

server.listen(port, () => {
  console.log(`Coach bootstrap server listening on :${port}`);
});
