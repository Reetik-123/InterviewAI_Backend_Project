#!/usr/bin/env node
const https = require('https');
const http = require('http');
const { URL } = require('url');

function request(opts, body) {
    return new Promise((resolve, reject) => {
        const lib = opts.protocol === 'https:' ? https : http;
        const req = lib.request(opts, (res) => {
            const chunks = [];
            res.on('data', (c) => chunks.push(c));
            res.on('end', () => {
                const text = Buffer.concat(chunks).toString();
                resolve({ statusCode: res.statusCode, headers: res.headers, body: text });
            });
        });
        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}

async function main() {
    const argv = require('minimist')(process.argv.slice(2));
    const backend = argv.backend || 'https://interviewai-backend-project.onrender.com';
    const origin = argv.origin || 'https://interviewai-backend-project-1.onrender.com';

    console.log('Backend:', backend);
    console.log('Origin header for CORS test:', origin);

    const url = new URL(backend + '/api/auth');
    const opts = {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname,
        method: 'OPTIONS',
        headers: {
            Origin: origin,
            'Access-Control-Request-Method': 'GET',
        },
    };

    try {
        const res = await request(opts);
        console.log('OPTIONS response status:', res.statusCode);
        console.log('Relevant headers:');
        console.log('  access-control-allow-origin:', res.headers['access-control-allow-origin']);
        console.log('  access-control-allow-credentials:', res.headers['access-control-allow-credentials']);

        // Also do a plain GET to root API to confirm server reachable
        const rootUrl = new URL(backend + '/');
        const getOpts = {
            protocol: rootUrl.protocol,
            hostname: rootUrl.hostname,
            port: rootUrl.port || (rootUrl.protocol === 'https:' ? 443 : 80),
            path: rootUrl.pathname,
            method: 'GET',
            headers: { Origin: origin },
        };
        const getRes = await request(getOpts);
        console.log('GET / response status:', getRes.statusCode);
    } catch (err) {
        console.error('Error during checks:', err.message || err);
        process.exitCode = 2;
    }
}

if (require.main === module) main();
