#!/usr/bin/env node

const {
  start: startPort = 8000,
  end: endPort = 9000,
  _: [server]
} = require('minimist')(process.argv.slice(2));
const chalk = require('chalk');
const whilst = require('async/whilst');
const fetchStreamInfo = require('../index');

const host = toUrl(server);
let port = startPort;
whilst(
  () => port <= endPort,
  cb => {
    const stream = `${host}:${port}`;
    processStream(stream, cb);
    port += 1;
  }
);

function processStream(stream, cb) {
  fetchStreamInfo(stream, (err, data = {}) => {
    if (err) {
      const message = `Failed to fetch stream info for ${stream}`;
      console.error(chalk.red.bold('Error:'), message, err.message);
      cb();
      return;
    }

    const { server, url, info } = data;
    console.log(JSON.stringify({ server, url, info }));
    cb();
  });
}

function toUrl(str) {
  if (!str) return str;
  const reHttp = /^https?:\/\//;
  return !reHttp.test(str) ? `http://${str}` : str;
}
