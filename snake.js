#!/usr/bin/env node
const express = require('express');
const localtunnel = require('localtunnel');

const app = express();
const port = 3000;
const subdomain = 'tidy-cameras-guess-83-81-204-111';

app.get('/', (req, res) => {
    console.log('/ called!');
    res.send('hello world');
});

async function startTunnel() {
    const tunnel = await localtunnel({port: port, subdomain: subdomain});
    console.log(tunnel.url);
    tunnel.on('close', () => { console.log('tunnel closed') });
    return tunnel;
}

(async () => { 
    const tunnel = await startTunnel(); 
    app.listen(port, () => { console.log(`App listening on port ${port}`); });
})();
