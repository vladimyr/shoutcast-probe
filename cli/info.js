#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const fetchStreamInfo = require('../index');
const { isNetworkError } = require('../error');
const argv = require('minimist')(process.argv.slice(2));
const url = toUrl(argv._[0]);

fetchStreamInfo(url, (err, { server, url, info } = {}) => {
  if (err) {
    const { message } = processError(err);
    console.error('%s %s', chalk.red.bold('Error:'), message);
    process.exit(1);
  }

  if (argv.j || argv.json) {
    console.log(JSON.stringify({ server, url, info }));
    return;
  }

  const title = info['Stream Title'] || info['Stream Name'];
  if (title) console.log('# %s', chalk.bold.yellow(title));

  console.log('[%s]\n', server);
  Object.keys(info).forEach(key => {
    let value = info[key];
    if (key === 'Content Type') value = chalk.yellow(value);
    console.log('%s %s', chalk.blue(`${key}:`), value);
  });
});

function processError(err) {
  if (!isNetworkError(err)) return err;
  return new Error('Requested url is not stream url');
}

function toUrl(str) {
  if (!str) return str;
  const reHttp = /^https?:\/\//;
  return !reHttp.test(str) ? `http://${str}` : str;
}
