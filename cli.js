#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const fetchStreamInfo = require('./index.js');

let url = process.argv[2];

const reProto = /^https?:\/\//;
if (!reProto.test(url)) url = `http://${ url }`;

fetchStreamInfo(url, (err, info) => {
  if (err) {
    console.error('%s %s', chalk.red.bold('Error:'), err.message);
    process.exit(1);
  }

  let title = info['Stream Title'] || info['Stream Name'];
  if (title) console.log('# %s\n', chalk.bold.yellow(title));

  Object.keys(info).forEach(key => {
    let value = info[key];
    if (key === 'Content Type') value = chalk.yellow(value);
    console.log('%s %s', chalk.blue(`${ key }:`), value);
  });
});
